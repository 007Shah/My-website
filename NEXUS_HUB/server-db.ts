import fs from 'fs';
import path from 'path';
import { User, Project, ProjectMembership, Column, Report, Task, Message, AdminAccount, GlobalRole, SystemCommand } from './src/types';

const DB_FILE = path.join(process.cwd(), 'database.json');

export interface DBStore {
  users: User[];
  projects: Project[];
  memberships: ProjectMembership[];
  columns: Column[];
  reports: Report[];
  tasks: Task[];
  messages: Message[];
  adminAccounts: AdminAccount[];
  systemCommands?: SystemCommand[];
  firedEmployees?: { id: string, name: string, customId: string, globalRole: string, firedAt: string }[];
}

const initialData: DBStore = {
  users: [
    { id: 'u1', customId: 'PM100', name: 'Patricia Miller', globalRole: 'MANAGER' },
    { id: 'u2', customId: 'LD501', name: 'Lucas Vance', globalRole: 'TEAM LEADER' },
    { id: 'u3', customId: 'LD502', name: 'Devon Chen', globalRole: 'TEAM LEADER' },
    { id: 'u4', customId: 'DV001', name: 'Alex Mercer', globalRole: 'SENIOR DEVELOPER' },
    { id: 'u5', customId: 'DV002', name: 'Sarah Connor', globalRole: 'SENIOR DESIGNER' },
    { id: 'u6', customId: 'DV003', name: 'James Holden', globalRole: 'JUNIOR DEVELOPER' },
    { id: 'u7', customId: 'DV004', name: 'Naomi Nagata', globalRole: 'ML ENGINEER' },
    { id: 'u8', customId: 'DV005', name: 'Elio Perlman', globalRole: 'INTERNEE' },
    { id: 'u9', customId: 'MN201', name: 'Thomas Wayne', globalRole: 'MANAGER' },
    { id: 'u10', customId: 'HR901', name: 'Martha Kent', globalRole: 'HR' },
  ],
  projects: [
    {
      id: 'proj-alpha',
      name: 'Project Alpha - Core Engine',
      description: 'Modernizing the cluster core orchestration engines, reducing message distribution latencies, and enabling automated failover recovery sequences across multi-region edge nodes.',
      deadline: '2026-07-20'
    },
    {
      id: 'proj-beta',
      name: 'Project Beta - NextGen UI',
      description: 'Revamping public performance dashboards and implementing modular canvas grids powered by fine-tuned motion layouts and real-time refresh updates.',
      deadline: '2026-06-18' // VERY close to current local time of June 14, 2026 (4 days)
    },
    {
      id: 'proj-gamma',
      name: 'Project Gamma - Security Shield',
      description: 'Deploying end-to-end zero-trust network credentials, continuous audit monitors, and automated rate-limiting security walls across high-frequency API endpoints.',
      deadline: '2026-09-01'
    }
  ],
  memberships: [
    // Project Alpha
    { id: 'm1', userId: 'u2', projectId: 'proj-alpha', role: 'TEAM_LEADER', jobTitle: 'Lead DevOps Specialist' },
    { id: 'm2', userId: 'u1', projectId: 'proj-alpha', role: 'TEAM_LEADER', jobTitle: 'Principal Product Manager' },
    { id: 'm3', userId: 'u4', projectId: 'proj-alpha', role: 'TEAM_MEMBER', jobTitle: 'Senior Systems Architect' },
    { id: 'm4', userId: 'u5', projectId: 'proj-alpha', role: 'TEAM_MEMBER', jobTitle: 'Security Lead' },
    { id: 'm5', userId: 'u6', projectId: 'proj-alpha', role: 'SPECTATOR', jobTitle: 'External Engineering Auditor' },

    // Project Beta
    { id: 'm6', userId: 'u3', projectId: 'proj-beta', role: 'TEAM_LEADER', jobTitle: 'Design Lead' },
    { id: 'm7', userId: 'u1', projectId: 'proj-beta', role: 'TEAM_LEADER', jobTitle: 'Principal Product Manager' },
    { id: 'm8', userId: 'u7', projectId: 'proj-beta', role: 'TEAM_MEMBER', jobTitle: 'Frontend Architect' },
    { id: 'm9', userId: 'u8', projectId: 'proj-beta', role: 'TEAM_MEMBER', jobTitle: 'Senior UI Engineer' },
    { id: 'm10', userId: 'u4', projectId: 'proj-beta', role: 'SPECTATOR', jobTitle: 'Systems Consult' },

    // Project Gamma
    { id: 'm11', userId: 'u1', projectId: 'proj-gamma', role: 'TEAM_LEADER', jobTitle: 'Principal Product Manager' },
    { id: 'm12', userId: 'u5', projectId: 'proj-gamma', role: 'TEAM_MEMBER', jobTitle: 'Security Lead' },
  ],
  columns: [
    // Project Alpha
    { id: 'col-a1', name: 'To Do', position: 0, projectId: 'proj-alpha' },
    { id: 'col-a2', name: 'In Progress', position: 1, projectId: 'proj-alpha' },
    { id: 'col-a3', name: 'Review', position: 2, projectId: 'proj-alpha' },
    { id: 'col-a4', name: 'Done', position: 3, projectId: 'proj-alpha' },

    // Project Beta
    { id: 'col-b1', name: 'To Do', position: 0, projectId: 'proj-beta' },
    { id: 'col-b2', name: 'In Progress', position: 1, projectId: 'proj-beta' },
    { id: 'col-b3', name: 'Review', position: 2, projectId: 'proj-beta' },
    { id: 'col-b4', name: 'Done', position: 3, projectId: 'proj-beta' },

    // Project Gamma
    { id: 'col-g1', name: 'To Do', position: 0, projectId: 'proj-gamma' },
    { id: 'col-g2', name: 'In Progress', position: 1, projectId: 'proj-gamma' },
    { id: 'col-g3', name: 'Review', position: 2, projectId: 'proj-gamma' },
    { id: 'col-g4', name: 'Done', position: 3, projectId: 'proj-gamma' },
  ],
  tasks: [
    // Project Alpha
    { id: 't1-1', title: 'Audit virtual private network configurations', columnId: 'col-a2', assigneeIds: ['u5'], status: 'IN_PROGRESS', projectId: 'proj-alpha' },
    { id: 't1-2', title: 'Measure connection pool socket leaks', columnId: 'col-a1', assigneeIds: ['u4'], status: 'TO_DO', projectId: 'proj-alpha' },
    { id: 't1-3', title: 'Run isolated chaos crash testing in stage-3 region', columnId: 'col-a3', assigneeIds: ['u4', 'u5'], status: 'REVIEW', projectId: 'proj-alpha' },
    { id: 't1-4', title: 'Configure primary Datadog instrumentation metrics', columnId: 'col-a4', assigneeIds: ['u2'], status: 'DONE', projectId: 'proj-alpha' },
    { id: 't1-5', title: 'Verify TLS handshake performance stats', columnId: 'col-a1', assigneeIds: ['u4'], status: 'TO_DO', projectId: 'proj-alpha' },

    // Project Beta
    { id: 't2-1', title: 'Create tailored motion bezier values', columnId: 'col-b2', assigneeIds: ['u8'], status: 'IN_PROGRESS', projectId: 'proj-beta' },
    { id: 't2-2', title: 'Optimize layouts for high dynamic load curves', columnId: 'col-b3', assigneeIds: ['u7'], status: 'REVIEW', projectId: 'proj-beta' },
    { id: 't2-3', title: 'Write automated viewport capture regression tests', columnId: 'col-b1', assigneeIds: ['u7', 'u8'], status: 'TO_DO', projectId: 'proj-beta' },
    { id: 't2-4', title: 'Confirm AAA accessibility contrast alignments', columnId: 'col-b4', assigneeIds: ['u3'], status: 'DONE', projectId: 'proj-beta' },

    // Project Gamma
    { id: 't3-1', title: 'Implement rate limiter policies via Redis', columnId: 'col-g1', assigneeIds: ['u5'], status: 'TO_DO', projectId: 'proj-gamma' },
    { id: 't3-2', title: 'Set up zero-trust root certificate authorities', columnId: 'col-g2', assigneeIds: ['u5', 'u1'], status: 'IN_PROGRESS', projectId: 'proj-gamma' },
  ],
  reports: [
    // Project Alpha
    {
      id: 'rep-a1',
      title: 'Spring Architecture Review Status',
      content: 'The core committee officially signed off on the multi-tenant message latency mitigation map. Dynamic connection recycle speeds decreased handshake latencies by 35%. No regressions noted.',
      status: 'SENT',
      scheduledDate: '2026-06-10',
      projectId: 'proj-alpha'
    },
    {
      id: 'rep-a2',
      title: 'Multicast Core Reliability Briefing',
      content: 'Review of dynamic recovery loops across edge availability groups. Preparing deployment vectors and container readiness files to initiate live checks.',
      status: 'SCHEDULED',
      scheduledDate: '2026-06-25',
      projectId: 'proj-alpha'
    },

    // Project Beta
    {
      id: 'rep-b1',
      title: 'Design-to-Dev Token Freeze Complete',
      content: 'The styling guides and interactive motion behaviors are fully compiled into tailwind classes. Fluid scaling supports resolutions from compact cellular screens to ultra-wide desktop monitors.',
      status: 'SENT',
      scheduledDate: '2026-06-12',
      projectId: 'proj-beta'
    },
    {
      id: 'rep-b2',
      title: 'User Analytics Visual Dashboard Release',
      content: 'Scheduling final canvas component layouts. Features robust real-time updates and customizable reports that stakeholders can download directly.',
      status: 'SCHEDULED',
      scheduledDate: '2026-06-20',
      projectId: 'proj-beta'
    }
  ],
  messages: [
    // Project Alpha
    { id: 'msg-1', text: 'Telemetry has been hooked to the staging server. Ready for audit.', createdAt: '2026-06-13T09:15:00.000Z', projectId: 'proj-alpha', userId: 'u2', userName: 'Lucas Vance' },
    { id: 'msg-2', text: 'Awesome Lucas. I am launching the VPN sandbox check now.', createdAt: '2026-06-13T09:22:00.000Z', projectId: 'proj-alpha', userId: 'u5', userName: 'Sarah Connor' },

    // Project Beta
    { id: 'msg-3', text: 'Devon, do we have final approval for the canvas Bezier speeds?', createdAt: '2026-06-13T10:45:00.000Z', projectId: 'proj-beta', userId: 'u8', userName: 'Elio Perlman' },
    { id: 'msg-4', text: 'Yes! The smooth curve model is fully approved.', createdAt: '2026-06-13T11:02:00.000Z', projectId: 'proj-beta', userId: 'u3', userName: 'Devon Chen' }
  ],
  adminAccounts: [
    { id: 'adm-1', adminId: 'ADMIN1', password: 'admin', linkedUserId: 'u1' } // Patricia Miller (PM)
  ],
  systemCommands: [
    { id: 'sc-1', commandText: 'INIT_SYSTEM_PROTOCOL: All departments ensure checklist metrics are uploaded by 18:00.', timestamp: '2026-06-14T10:00:00.000Z', createdBy: 'Patricia Miller (MANAGER)' }
  ],
  firedEmployees: []
};

export class Database {
  private data: DBStore = initialData;

  constructor() {
    this.readFromDisk();
  }

  private readFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);

        // Auto-migrate any old roles to standard roles
        let migrated = false;
        if (this.data.users) {
          this.data.users = this.data.users.map(u => {
            const role = u.globalRole as any;
            if (role === 'PM' || role === 'Manager' || role === 'ADMIN' || role === 'MANAGER') {
              migrated = true;
              return { ...u, globalRole: 'MANAGER' };
            }
            if (role === 'LEADER') {
              migrated = true;
              return { ...u, globalRole: 'TEAM LEADER' };
            }
            if (role === 'DEVELOPER') {
              migrated = true;
              return { ...u, globalRole: 'SENIOR DEVELOPER' };
            }
            return u;
          });
        }

        // Ensure admin accounts are present if missing or empty
        if (!this.data.adminAccounts || this.data.adminAccounts.length === 0) {
          this.data.adminAccounts = [
            { id: 'adm-1', adminId: 'ADMIN1', password: 'admin', linkedUserId: 'u1' } // Patricia Miller (ADMIN)
          ];
          migrated = true;
        } else {
          // Auto-migrate: Purge any pre-existing non-manager / team leader admin portal accounts
          const originalLength = this.data.adminAccounts.length;
          this.data.adminAccounts = this.data.adminAccounts.filter(adm => {
            if (adm.linkedUserId === 'u1') return true; // Keep company admin Patricia Miller
            const u = this.data.users?.find(user => user.id === adm.linkedUserId);
            return u && u.globalRole === 'MANAGER'; // Keep other managers if any
          });
          if (this.data.adminAccounts.length !== originalLength) {
            migrated = true;
          }
        }

        // Ensure system commands are present if missing
        if (!this.data.systemCommands) {
          this.data.systemCommands = [
            { id: 'sc-1', commandText: 'INIT_SYSTEM_PROTOCOL: All departments ensure checklist metrics are uploaded by 18:00.', timestamp: '2026-06-14T10:00:00.000Z', createdBy: 'Patricia Miller (MANAGER)' }
          ];
          migrated = true;
        }

        if (migrated) {
          this.writeToDisk();
        }
      } else {
        this.writeToDisk();
      }
    } catch (e) {
      console.error('Error reading DB from disk, fallback to memory', e);
    }
  }

  private writeToDisk() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed writing DB to disk', e);
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserByCustomId(customId: string): User | undefined {
    return this.data.users.find(u => u.customId.toUpperCase() === customId.toUpperCase().trim());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public addUser(name: string, customId: string, globalRole: GlobalRole): User {
    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      customId: customId.trim().toUpperCase().substring(0, 5),
      name: name.trim(),
      globalRole
    };
    this.data.users.push(newUser);
    this.writeToDisk();
    return newUser;
  }

  public getProjects(): Project[] {
    return this.data.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects.find(p => p.id === id);
  }

  public createProject(name: string, description: string, deadline: string, leaderUserId: string, pmUserId: string): Project {
    const projId = 'proj-' + Math.random().toString(36).substr(2, 9);
    const newProj: Project = { id: projId, name, description, deadline };
    this.data.projects.push(newProj);

    // Create standard default columns
    const cols = ['To Do', 'In Progress', 'Review', 'Done'];
    cols.forEach((colName, index) => {
      this.data.columns.push({
        id: `col-${projId}-${index}`,
        name: colName,
        position: index,
        projectId: projId
      });
    });

    // Submitter is typically PM, leaderUserId is LEADER
    this.data.memberships.push({
      id: `m-${Math.random().toString(36).substr(2, 9)}`,
      userId: leaderUserId,
      projectId: projId,
      role: 'TEAM_LEADER',
      jobTitle: 'Assigned Project Leader'
    });

    if (pmUserId !== leaderUserId) {
      this.data.memberships.push({
        id: `m-${Math.random().toString(36).substr(2, 9)}`,
        userId: pmUserId,
        projectId: projId,
        role: 'TEAM_LEADER',
        jobTitle: 'Overseeing Product Manager'
      });
    }

    this.writeToDisk();
    return newProj;
  }

  public getProjectMemberships(projectId: string) {
    return this.data.memberships
      .filter(m => m.projectId === projectId)
      .map(m => {
        const user = this.data.users.find(u => u.id === m.userId);
        return {
          ...m,
          user: user || { id: m.userId, customId: 'UNKNOWN', name: 'Unknown Employee', globalRole: 'DEVELOPER' as const }
        };
      });
  }

  public addMembership(projectId: string, customId: string, role: 'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR', jobTitle: string): { success: boolean; error?: string; membership?: any } {
    const user = this.getUserByCustomId(customId);
    if (!user) {
      return { success: false, error: `Employee ID "${customId}" is not whitelisted in the company roster.` };
    }

    // Check pre-existing membership
    const existing = this.data.memberships.find(m => m.projectId === projectId && m.userId === user.id);
    if (existing) {
      // Update role
      existing.role = role;
      existing.jobTitle = jobTitle || existing.jobTitle;
      this.writeToDisk();
      return { success: true, membership: { ...existing, user } };
    }

    const newMem: ProjectMembership = {
      id: 'm-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      projectId,
      role,
      jobTitle: jobTitle || (role === 'SPECTATOR' ? 'Read-only Spectator' : user.globalRole.includes('DEVELOPER') ? 'Software Developer' : 'Team Participant')
    };

    this.data.memberships.push(newMem);
    this.writeToDisk();
    return { success: true, membership: { ...newMem, user } };
  }

  public updatePresenceStatus(projectId: string, userId: string, presenceStatus: 'WORKING' | 'OFF'): boolean {
    const mem = this.data.memberships.find(m => m.projectId === projectId && m.userId === userId);
    if (mem) {
      mem.presenceStatus = presenceStatus;
      this.writeToDisk();
      return true;
    }
    return false;
  }

  public updateMembershipRole(projectId: string, userId: string, role: 'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR'): boolean {
    const mem = this.data.memberships.find(m => m.projectId === projectId && m.userId === userId);
    if (mem) {
      mem.role = role;
      this.writeToDisk();
      return true;
    }
    return false;
  }

  public getColumns(projectId: string): Column[] {
    return this.data.columns.filter(c => c.projectId === projectId).sort((a,b) => a.position - b.position);
  }

  public getTasks(projectId: string): Task[] {
    return this.data.tasks.filter(t => t.projectId === projectId);
  }

  public addTask(projectId: string, title: string, columnId: string, assigneeIds: string[], addedBy?: string): Task {
    const newTask: Task = {
      id: 't-' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      columnId,
      assigneeIds,
      status: this.getStatusFromColumnName(columnId),
      projectId,
      addedBy
    };
    this.data.tasks.push(newTask);
    this.writeToDisk();
    return newTask;
  }

  private getStatusFromColumnName(columnId: string): 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' {
    const col = this.data.columns.find(c => c.id === columnId);
    if (!col) return 'TO_DO';
    const name = col.name.toLowerCase();
    if (name.includes('progress')) return 'IN_PROGRESS';
    if (name.includes('review') || name.includes('test')) return 'REVIEW';
    if (name.includes('done') || name.includes('complete')) return 'DONE';
    return 'TO_DO';
  }

  public updateTaskStatus(taskId: string, columnId: string, status: 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'): Task | undefined {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      task.columnId = columnId;
      task.status = status;
      this.writeToDisk();
    }
    return task;
  }

  public deleteTask(taskId: string): boolean {
    const lengthBefore = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
    if (this.data.tasks.length !== lengthBefore) {
      this.writeToDisk();
      return true;
    }
    return false;
  }

  public getReports(projectId: string): Report[] {
    return this.data.reports.filter(r => r.projectId === projectId);
  }

  public addReport(projectId: string, title: string, content: string, status: 'SENT' | 'SCHEDULED', scheduledDate: string): Report {
    const newReport: Report = {
      id: 'r-' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      content: content.trim(),
      status,
      scheduledDate,
      projectId
    };
    this.data.reports.push(newReport);
    this.writeToDisk();
    return newReport;
  }

  public getMessages(projectId: string): Message[] {
    return this.data.messages.filter(m => m.projectId === projectId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public addMessage(projectId: string, userId: string, text: string): Message | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;

    const newMessage: Message = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      projectId,
      userId,
      userName: user.name
    };
    this.data.messages.push(newMessage);
    this.writeToDisk();
    return newMessage;
  }

  public removeMembership(projectId: string, userId: string): boolean {
    const lengthBefore = this.data.memberships.length;
    this.data.memberships = this.data.memberships.filter(m => !(m.projectId === projectId && m.userId === userId));
    if (this.data.memberships.length !== lengthBefore) {
      this.writeToDisk();
      return true;
    }
    return false;
  }

  // Admin Portal specific procedures
  public getAdminAccounts(): AdminAccount[] {
    if (!this.data.adminAccounts) {
      this.data.adminAccounts = [];
    }
    return this.data.adminAccounts;
  }

  public getAdminAccountByAdminId(adminId: string): AdminAccount | undefined {
    const trimmedId = adminId.trim().toUpperCase();
    return this.getAdminAccounts().find(a => {
      if (a.adminId.trim().toUpperCase() === trimmedId) {
        return true;
      }
      // Also allow lookup by the linked user's company Custom ID!
      const user = this.getUserById(a.linkedUserId);
      return user && user.customId.trim().toUpperCase() === trimmedId;
    });
  }

  public addAdminAccount(adminId: string, password: string, linkedUserId: string): AdminAccount | null {
    // Linked user must exist
    const user = this.getUserById(linkedUserId);
    if (!user) {
      return null;
    }

    // Must be unique adminId
    const existing = this.getAdminAccountByAdminId(adminId);
    if (existing) {
      return null;
    }

    const newAdmin: AdminAccount = {
      id: 'adm-' + Math.random().toString(36).substr(2, 9),
      adminId: adminId.trim().toUpperCase(),
      password: password.trim(),
      linkedUserId
    };

    this.getAdminAccounts().push(newAdmin);
    this.writeToDisk();
    return newAdmin;
  }

  public getFiredEmployees(): { id: string, name: string, customId: string, globalRole: string, firedAt: string }[] {
    if (!this.data.firedEmployees) {
      this.data.firedEmployees = [];
    }
    return this.data.firedEmployees;
  }

  // Complete User Deletion from Whole System
  public removeUserCompletely(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    if (!this.data.firedEmployees) {
      this.data.firedEmployees = [];
    }
    if (!this.data.firedEmployees.some(fe => fe.id === userId)) {
      this.data.firedEmployees.push({
        id: user.id,
        name: user.name,
        customId: user.customId,
        globalRole: user.globalRole,
        firedAt: new Date().toISOString()
      });
    }

    // 1. Remove from Whitelisted Users
    this.data.users = this.data.users.filter(u => u.id !== userId);

    // 2. Remove all Project Memberships for this user
    this.data.memberships = this.data.memberships.filter(m => m.userId !== userId);

    // 3. Remove all Admin Accounts for this user
    this.data.adminAccounts = this.data.adminAccounts.filter(a => a.linkedUserId !== userId);

    // 4. Remove assignments inside tasks
    this.data.tasks = this.data.tasks.map(t => {
      if (t.assigneeIds.includes(userId)) {
        return {
          ...t,
          assigneeIds: t.assigneeIds.filter(id => id !== userId)
        };
      }
      return t;
    });

    this.writeToDisk();
    return true;
  }

  // Remove Admin Account (portal access only, keep user in whitelist)
  public removeAdminAccountOnly(accountId: string): boolean {
    const adminIndex = this.data.adminAccounts.findIndex(a => a.id === accountId);
    if (adminIndex === -1) return false;

    this.data.adminAccounts.splice(adminIndex, 1);
    this.writeToDisk();
    return true;
  }

  // Update Whitelisted Employee Global Role
  public updateUserRole(userId: string, newRole: GlobalRole): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    user.globalRole = newRole;
    this.writeToDisk();
    return true;
  }

  // System Commands
  public getSystemCommands(): SystemCommand[] {
    if (!this.data.systemCommands) {
      this.data.systemCommands = [];
    }
    return this.data.systemCommands;
  }

  public addSystemCommand(commandText: string, createdBy: string): SystemCommand {
    if (!this.data.systemCommands) {
      this.data.systemCommands = [];
    }
    const newCommand: SystemCommand = {
      id: 'sc-' + Math.random().toString(36).substr(2, 9),
      commandText: commandText.trim(),
      timestamp: new Date().toISOString(),
      createdBy
    };
    this.data.systemCommands.push(newCommand);
    this.writeToDisk();
    return newCommand;
  }

  public deleteSystemCommand(commandId: string): boolean {
    if (!this.data.systemCommands) return false;
    const lengthBefore = this.data.systemCommands.length;
    this.data.systemCommands = this.data.systemCommands.filter(c => c.id !== commandId);
    if (this.data.systemCommands.length !== lengthBefore) {
      this.writeToDisk();
      return true;
    }
    return false;
  }
}

export const dbInstance = new Database();
