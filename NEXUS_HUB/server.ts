import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbInstance } from './server-db';

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // 1. Authentication route
  app.post('/api/auth/login', (req, res) => {
    const { customId } = req.body;
    if (!customId || typeof customId !== 'string') {
      res.status(400).json({ success: false, error: 'Authorization ID is required' });
      return;
    }

    const trimmed = customId.trim();
    if (trimmed.length !== 5) {
      res.status(400).json({ success: false, error: 'Employee credentials must be exactly a five character alphanumeric ID (e.g. PM100, LD501)' });
      return;
    }

    const user = dbInstance.getUserByCustomId(trimmed);
    if (!user) {
      res.status(401).json({ success: false, error: 'This ID is not whitelisted. Access is denied.' });
      return;
    }

    res.json({ success: true, user });
  });

  // Get current session validation
  app.get('/api/auth/me', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized credentials' });
      return;
    }
    const user = dbInstance.getUserById(userId);
    if (!user) {
      res.status(401).json({ success: false, error: 'User whitelisting invalid' });
      return;
    }
    res.json({ success: true, user });
  });

  // Register a new Employee in the whitelist (for MANAGER only)
  app.post('/api/auth/whitelist', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    // Only MANAGER can hire/whitelist new employees and define their ID and role
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to hire and whitelist new personnel' });
      return;
    }

    const { name, customId, globalRole } = req.body;
    if (!name || !customId || !globalRole) {
      res.status(400).json({ success: false, error: 'Missing name, customId, or role' });
      return;
    }

    if (customId.trim().length !== 5) {
      res.status(400).json({ success: false, error: 'Custom IDs must be exactly 5 alphanumeric characters' });
      return;
    }

    const existing = dbInstance.getUserByCustomId(customId);
    if (existing) {
      res.status(400).json({ success: false, error: 'An employee with this 5-char ID already exists in the whitelist' });
      return;
    }

    const newUser = dbInstance.addUser(name, customId, globalRole);
    res.json({ success: true, user: newUser });
  });

  // ==========================================
  // ADMIN PORTAL API ROUTINGS (MANAGER ONLY ACTIONS OR GRANTED ONLY ACTIONS)
  // ==========================================
  
  // 1. Complete User Deletion from Whole System
  app.delete('/api/admin/remove-employee-completely', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER role is authorized to purge personnel from the complete system' });
      return;
    }

    const userId = req.body.userId || req.query.userId;
    if (!userId) {
      res.status(400).json({ success: false, error: 'User ID is required to remove employee' });
      return;
    }

    const success = dbInstance.removeUserCompletely(userId);
    if (!success) {
      res.status(404).json({ success: false, error: 'Employee not found' });
      return;
    }

    res.json({ success: true, message: 'Employee successfully purged from entire corporate system' });
  });

  // 1.5. Fetch Fired Employees
  app.get('/api/admin/fired-employees', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to view fired employee data' });
      return;
    }
    res.json({ success: true, list: dbInstance.getFiredEmployees() });
  });

  // 2. Revoke Admin Access (Portal Only)
  app.delete('/api/admin/remove-admin-account', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to customize administration pool privileges' });
      return;
    }

    const accountId = req.body.accountId || req.query.accountId;
    if (!accountId) {
      res.status(400).json({ success: false, error: 'Account ID is required to revoke portal access' });
      return;
    }

    const success = dbInstance.removeAdminAccountOnly(accountId);
    if (!success) {
      res.status(404).json({ success: false, error: 'Admin account privilege node not found' });
      return;
    }

    res.json({ success: true, message: 'Portal access successfully revoked' });
  });

  // 3. Update Employee Whitelisted Role
  app.put('/api/admin/update-employee-role', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to modify whitelisted roles' });
      return;
    }

    const { userId, globalRole } = req.body;
    if (!userId || !globalRole) {
      res.status(400).json({ success: false, error: 'Missing userId or globalRole parameters' });
      return;
    }

    const success = dbInstance.updateUserRole(userId, globalRole);
    if (!success) {
      res.status(404).json({ success: false, error: 'Employee whitelisting invalid' });
      return;
    }

    res.json({ success: true, message: 'Employee role successfully updated' });
  });

  app.post('/api/admin/login', (req, res) => {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      res.status(400).json({ success: false, error: 'Admin ID and Password are secure pre-requisites.' });
      return;
    }
    const admin = dbInstance.getAdminAccountByAdminId(adminId);
    if (!admin || admin.password !== password) {
      res.status(412).json({ success: false, error: 'Administrative authentication rejected. Security credentials invalid.' });
      return;
    }
    const user = dbInstance.getUserById(admin.linkedUserId);
    if (!user) {
      res.status(412).json({ success: false, error: 'No associated corporate leadership node aligned with this ID.' });
      return;
    }
    res.json({ success: true, admin, user });
  });

  app.get('/api/admin/accounts', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to view the admin pool' });
      return;
    }

    const list = dbInstance.getAdminAccounts().map(adm => {
      const u = dbInstance.getUserById(adm.linkedUserId);
      return {
        ...adm,
        user: u || { name: 'Unknown', customId: 'N/A', globalRole: 'JUNIOR DEVELOPER' }
      };
    });
    res.json({ success: true, accounts: list });
  });

  app.get('/api/admin/unassigned-leaders', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to view candidates for promotion' });
      return;
    }

    const admins = dbInstance.getAdminAccounts();
    const leaders = dbInstance.getUsers().filter(u => {
      // The MANAGER can promote any employee to have admin portal access
      const hasAdminAccount = admins.some(a => a.linkedUserId === u.id);
      return u.globalRole !== 'MANAGER' && !hasAdminAccount;
    });
    res.json({ success: true, leaders });
  });

  app.post('/api/admin/register-admin', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    if (!requester || requester.globalRole !== 'MANAGER') {
      res.status(403).json({ success: false, error: 'Only the MANAGER is authorized to customize administration pool privileges' });
      return;
    }

    const { adminId, password, linkedUserId } = req.body;
    if (!adminId || !password || !linkedUserId) {
      res.status(400).json({ success: false, error: 'Missing compulsory admin construction fields.' });
      return;
    }
    const result = dbInstance.addAdminAccount(adminId, password, linkedUserId);
    if (!result) {
      res.status(400).json({ success: false, error: 'Admin ID must be globally unique, and associated user must be an active corporate whitelisted employee.' });
      return;
    }
    res.json({ success: true, admin: result });
  });

  // 2. Dashboard - Company wide overview
  app.get('/api/dashboard', (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Authentication session required' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid user credentials' });
      return;
    }

    const roster = dbInstance.getUsers();
    const projects = dbInstance.getProjects().map(proj => {
      const memberships = dbInstance.getProjectMemberships(proj.id);
      const leaderMembership = memberships.find(m => m.role === 'TEAM_LEADER');
      const leaderName = leaderMembership ? leaderMembership.user.name : 'Unassigned';
      return {
        ...proj,
        memberCount: memberships.length,
        leaderName
      };
    });

    const adminAccounts = dbInstance.getAdminAccounts();
    const hasAdminAccess = user.globalRole === 'MANAGER' || adminAccounts.some(a => a.linkedUserId === userId);
    const systemCommands = dbInstance.getSystemCommands();

    res.json({
      success: true,
      roster,
      projects,
      totalActiveProjects: projects.length,
      hasAdminAccess,
      adminAccounts,
      systemCommands
    });
  });

  // Write a new command (Manager/Admins can write commands)
  app.post('/api/commands', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    if (!requester) {
      res.status(401).json({ success: false, error: 'Unauthorized session' });
      return;
    }

    // Verify if they have admin portal access (either Manager or whitelisted in adminAccounts)
    const adminAccounts = dbInstance.getAdminAccounts();
    const hasAdminAccess = requester.globalRole === 'MANAGER' || adminAccounts.some(a => a.linkedUserId === requesterId);

    if (!hasAdminAccess) {
      res.status(403).json({ success: false, error: 'Only authorized administrators can publish commands' });
      return;
    }

    const { commandText } = req.body;
    if (!commandText || typeof commandText !== 'string' || !commandText.trim()) {
      res.status(400).json({ success: false, error: 'Command text is required' });
      return;
    }

    const createdBy = `${requester.name} (${requester.globalRole})`;
    const newCommand = dbInstance.addSystemCommand(commandText, createdBy);
    res.json({ success: true, command: newCommand });
  });

  // Delete an existing command
  app.delete('/api/commands/:id', (req, res) => {
    const requesterId = req.headers['x-user-id'] as string;
    const requester = dbInstance.getUserById(requesterId);
    
    if (!requester) {
      res.status(401).json({ success: false, error: 'Unauthorized session' });
      return;
    }

    const adminAccounts = dbInstance.getAdminAccounts();
    const hasAdminAccess = requester.globalRole === 'MANAGER' || adminAccounts.some(a => a.linkedUserId === requesterId);

    if (!hasAdminAccess) {
      res.status(403).json({ success: false, error: 'Only authorized administrators can delete commands' });
      return;
    }

    const { id } = req.params;
    const success = dbInstance.deleteSystemCommand(id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Command not found' });
      return;
    }

    res.json({ success: true, message: 'Command successfully deleted' });
  });

  // Create workspace project (restricted to manager/leadership roles)
  app.post('/api/projects', (req, res) => {
    const { name, description, deadline, leaderUserId, pmUserId } = req.body;
    if (!name || !description || !deadline || !leaderUserId || !pmUserId) {
      res.status(400).json({ success: false, error: 'Missing compulsory fields to establish project workspace' });
      return;
    }

    const pmUser = dbInstance.getUserById(pmUserId);
    const isAuthorized = !!pmUser;
    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Only registered system users can launch new project domains' });
      return;
    }

    const newProj = dbInstance.createProject(name, description, deadline, leaderUserId, pmUserId);
    res.status(201).json({ success: true, project: newProj });
  });

  // Helper for access checks
  function resolveUserAccess(userId: string, projectId: string, enteredGateChallengeId?: string) {
    const user = dbInstance.getUserById(userId);
    if (!user) return { allowed: false, spectatorChallengeRequired: false, role: null };

    // MANAGER global override to manage any workspace
    if (user.globalRole === 'MANAGER') {
      return { allowed: true, spectatorChallengeRequired: false, role: 'TEAM_LEADER' as const };
    }

    const memberships = dbInstance.getProjectMemberships(projectId);
    const userMember = memberships.find(m => m.userId === userId);

    if (!userMember) {
      return { allowed: false, spectatorChallengeRequired: false, role: null };
    }

    if (userMember.role === 'SPECTATOR') {
      // Spectator must bypass the challenge gate!
      // They are only "allowed" after confirming their 5-character customId matches!
      const codeMatches = enteredGateChallengeId?.trim().toUpperCase() === user.customId.toUpperCase();
      if (!codeMatches) {
        return { allowed: false, spectatorChallengeRequired: true, role: 'SPECTATOR' as const };
      }
      return { allowed: true, spectatorChallengeRequired: false, role: 'SPECTATOR' as const };
    }

    // Full regular members: TEAM_LEADER, TEAM_MEMBER
    return { allowed: true, spectatorChallengeRequired: false, role: userMember.role };
  }

  // 3. Project Workspace Isolation Details
  app.get('/api/project/:projectId', (req, res) => {
    const { projectId } = req.params;
    const userId = req.query.userId as string;
    const gateCode = req.query.gateCode as string;

    if (!userId) {
      res.status(401).json({ error: 'Access session missing' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    if (!user) {
      res.status(401).json({ error: 'Invalid agent credentials' });
      return;
    }

    const access = resolveUserAccess(userId, projectId, gateCode);

    if (!access.allowed) {
      if (access.spectatorChallengeRequired) {
        res.status(403).json({
          allowed: false,
          spectatorChallengeRequired: true,
          message: 'Target challenge gate is locked. Type your unique 5-character ID to unlock Read Mode.'
        });
        return;
      }
      res.status(403).json({
        allowed: false,
        spectatorChallengeRequired: false,
        message: 'This project space is strictly isolated. You do not hold access authorization.'
      });
      return;
    }

    // Success! Prepare fully hydrated workspace data
    const project = dbInstance.getProjectById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project workspace space matching that ID was not found.' });
      return;
    }

    const columns = dbInstance.getColumns(projectId);
    const tasks = dbInstance.getTasks(projectId);
    const reports = dbInstance.getReports(projectId);
    const messages = dbInstance.getMessages(projectId);
    const memberships = dbInstance.getProjectMemberships(projectId);

    res.json({
      allowed: true,
      spectatorChallengeRequired: false,
      role: access.role,
      data: {
        project,
        columns,
        tasks,
        reports,
        messages,
        memberships
      }
    });
  });

  // UPDATE MEMBER PRESENCE STATUS
  app.post('/api/project/:projectId/member/:userId/presence', (req, res) => {
    const { projectId, userId } = req.params;
    const { presenceStatus } = req.body;

    if (!presenceStatus || !['WORKING', 'OFF'].includes(presenceStatus)) {
      res.status(400).json({ success: false, error: 'Invalid presenceStatus value' });
      return;
    }

    const updated = dbInstance.updatePresenceStatus(projectId, userId, presenceStatus as any);
    if (updated) {
      res.json({ success: true, updatedPresenceStatus: presenceStatus });
    } else {
      res.status(404).json({ success: false, error: 'Project membership not found' });
    }
  });

  // ADD MEMBER ID (leadership authorization ADMIN or Project Admin/TEAM_LEADER only)
  app.post('/api/project/:projectId/member', (req, res) => {
    const { projectId } = req.params;
    const { requesterUserId, customId, role, jobTitle } = req.body;

    if (!requesterUserId || !customId || !role) {
      res.status(400).json({ success: false, error: 'Missing mandatory variables to enroll project member.' });
      return;
    }

    const requester = dbInstance.getUserById(requesterUserId);
    if (!requester) {
      res.status(401).json({ success: false, error: 'Requester user profile invalid.' });
      return;
    }

    // Privilege authorization checklist: Anyone can manage roster now
    const isAuthorized = !!requester;

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Authorization denied: Only registered system users can amend team rosters.' });
      return;
    }

    const result = dbInstance.addMembership(projectId, customId, role, jobTitle);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({ success: true, membership: result.membership });
  });

  // REMOVE MEMBER ID (leadership authorization ADMIN or Project Admin/TEAM_LEADER only)
  app.delete('/api/project/:projectId/member/:memberUserId', (req, res) => {
    const { projectId, memberUserId } = req.params;
    const requesterUserId = req.headers['x-user-id'] as string;

    if (!requesterUserId) {
      res.status(401).json({ success: false, error: 'Requester authentication required in x-user-id header.' });
      return;
    }

    const requester = dbInstance.getUserById(requesterUserId);
    if (!requester) {
      res.status(401).json({ success: false, error: 'Requester user profile invalid.' });
      return;
    }

    const isAuthorized = !!requester;

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Authorization denied: Only registered system users can amend team rosters.' });
      return;
    }

    const deleted = dbInstance.removeMembership(projectId, memberUserId);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Membership record not found or already deleted.' });
      return;
    }

    res.json({ success: true, message: 'Member successfully removed from project.' });
  });

  // ADD TASK (TEAM_LEADER or TEAM_MEMBER only)
  app.post('/api/project/:projectId/task', (req, res) => {
    const { projectId } = req.params;
    const { userId, title, columnId, assigneeIds } = req.body;

    if (!userId || !title || !columnId) {
      res.status(400).json({ error: 'Incomplete parameters supplied to establish task block.' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    const memberships = dbInstance.getProjectMemberships(projectId);
    const requesterMember = memberships.find(m => m.userId === userId);

    const canEdit = !!user;
    if (!canEdit) {
      res.status(403).json({ error: 'Action denied: Only registered system users can edit project tasks.' });
      return;
    }

    const addedByStr = user ? `${user.name} (${user.globalRole})` : undefined;
    const task = dbInstance.addTask(projectId, title, columnId, assigneeIds || [], addedByStr);
    res.status(201).json({ success: true, task });
  });

  // UPDATE TASK COLUMN/STATUS (TEAM_LEADER or TEAM_MEMBER only)
  app.put('/api/project/:projectId/task/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;
    const { userId, columnId, status } = req.body;

    if (!userId || !columnId || !status) {
      res.status(400).json({ error: 'Missing column or status arguments to pivot task.' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    const memberships = dbInstance.getProjectMemberships(projectId);
    const requesterMember = memberships.find(m => m.userId === userId);

    const canEdit = !!user;
    if (!canEdit) {
      res.status(403).json({ error: 'Action denied: Only registered system users can mutate project board components.' });
      return;
    }

    const updatedTask = dbInstance.updateTaskStatus(taskId, columnId, status);
    if (!updatedTask) {
      res.status(404).json({ error: 'Target task element not found' });
      return;
    }

    res.json({ success: true, task: updatedTask });
  });

  // DELETE TASK (TEAM_LEADER or TEAM_MEMBER only)
  app.delete('/api/project/:projectId/task/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;
    const userId = req.body.userId || (req.query.userId as string);

    if (!userId) {
      res.status(400).json({ error: 'Credentials required to delete task.' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    const memberships = dbInstance.getProjectMemberships(projectId);
    const requesterMember = memberships.find(m => m.userId === userId);

    const canEdit = !!user;
    if (!canEdit) {
      res.status(403).json({ error: 'Action denied: Permissions are insufficient to delete project tasks.' });
      return;
    }

    const success = dbInstance.deleteTask(taskId);
    if (!success) {
      res.status(404).json({ error: 'Target task was not found' });
      return;
    }

    res.json({ success: true });
  });

  // POST MESSAGE (Strict chat feed lock for SPECTATORS!)
  app.post('/api/project/:projectId/message', (req, res) => {
    const { projectId } = req.params;
    const { userId, text } = req.body;

    if (!userId || !text) {
      res.status(400).json({ error: 'Message parameters are insufficient.' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    const isAffiliated = !!user;

    if (!isAffiliated) {
      res.status(403).json({ error: 'Communication denied: You hold no membership privileges in this workspace.' });
      return;
    }

    const message = dbInstance.addMessage(projectId, userId, text);
    if (!message) {
      res.status(400).json({ error: 'Could not append chat message.' });
      return;
    }

    res.json({ success: true, message });
  });

  // SUBMIT REPORTS LOG (PM or TEAM_LEADER or TEAM_MEMBER)
  app.post('/api/project/:projectId/report', (req, res) => {
    const { projectId } = req.params;
    const { userId, title, content, status, scheduledDate } = req.body;

    if (!userId || !title || !content || !status || !scheduledDate) {
      res.status(400).json({ error: 'Incomplete parameters to create milestones report.' });
      return;
    }

    const user = dbInstance.getUserById(userId);
    const canCreateReport = !!user;
    if (!canCreateReport) {
      res.status(403).json({ error: 'Authorization denied: Only project participants are authorized to log reports.' });
      return;
    }

    const report = dbInstance.addReport(projectId, title, content, status, scheduledDate);
    res.status(201).json({ success: true, report });
  });

  // UPDATE PROJECT MEMBER ACCESSIBILITY/ROLE
  app.post('/api/project/:projectId/member/:userId/role', (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body; // 'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR'
    const requesterUserId = req.headers['x-user-id'] as string;

    if (!requesterUserId) {
      res.status(401).json({ success: false, error: 'Requester authentication required in x-user-id header.' });
      return;
    }

    if (!role || (role !== 'TEAM_LEADER' && role !== 'TEAM_MEMBER' && role !== 'SPECTATOR')) {
      res.status(400).json({ success: false, error: 'Valid accessibility level role is required' });
      return;
    }

    const requester = dbInstance.getUserById(requesterUserId);
    if (!requester) {
      res.status(401).json({ success: false, error: 'Requester user profile invalid.' });
      return;
    }

    const isAuthorized = !!requester;

    if (!isAuthorized) {
      res.status(403).json({ success: false, error: 'Authorization denied: Only registered system users can configure member accessibility.' });
      return;
    }

    const updated = dbInstance.updateMembershipRole(projectId, userId, role);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Membership record not found.' });
      return;
    }

    res.json({ success: true });
  });


  // 4. Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
