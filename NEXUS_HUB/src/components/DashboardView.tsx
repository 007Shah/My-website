import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  FolderGit2, 
  Plus, 
  ArrowRight, 
  Calendar, 
  UserPlus, 
  CheckCircle2, 
  UserSquare2, 
  LogOut,
  Info,
  Terminal,
  Trash2,
  LockKeyhole
} from 'lucide-react';
import { User, Project, SystemCommand } from '../types';

interface DashboardViewProps {
  currentUser: User;
  onLogout: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenAdminPortal: () => void;
  refreshKey?: number;
}

interface ProjectMetadata extends Project {
  memberCount: number;
  leaderName: string;
}

export function DashboardView({ currentUser, onLogout, onSelectProject, onOpenAdminPortal, refreshKey }: DashboardViewProps) {
  const [data, setData] = useState<{
    roster: User[];
    projects: ProjectMetadata[];
    totalActiveProjects: number;
    adminAccounts?: any[];
    systemCommands?: SystemCommand[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New whitelisted employee state
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<'Manager' | 'LEADER' | 'DEVELOPER'>('DEVELOPER');
  const [empSuccessText, setEmpSuccessText] = useState<string | null>(null);
  const [addingEmployee, setAddingEmployee] = useState(false);

  // New project sandbox builder state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectLeaderId, setProjectLeaderId] = useState('');
  const [projSuccessText, setProjSuccessText] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?userId=${currentUser.id}`);
      if (!res.ok) {
        throw new Error('Connection failed while querying global corporate directories.');
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setErrorMessage(json.error || 'Failed to fetch directory indexes.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fatal telemetry network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser.id, refreshKey]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpId.trim() || newEmpId.trim().length !== 5) {
      alert('Ensure Employee Name is populated and Employee ID is exactly 5 custom characters.');
      return;
    }

    try {
      setAddingEmployee(true);
      const res = await fetch('/api/auth/whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id
        },
        body: JSON.stringify({
          name: newEmpName.trim(),
          customId: newEmpId.trim().toUpperCase(),
          globalRole: newEmpRole
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Failed to submit whitelisting credentials.');
      } else {
        setEmpSuccessText(`Successfully whitelisted: ${resJson.user.name} (${resJson.user.customId})`);
        setNewEmpName('');
        setNewEmpId('');
        // Refresh
        fetchDashboardData();
        setTimeout(() => setEmpSuccessText(null), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Internal transmission server error.');
    } finally {
      setAddingEmployee(false);
    }
  };

  const handleFireEmployee = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the whole system?\nThis will delete their entire existence, clean their project assignments, and place them in the Fired Employees list.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/remove-employee-completely?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(`Successfully terminated & removed ${name} from the system.`);
        fetchDashboardData();
      } else {
        alert(json.error || 'Failed to remove employee.');
      }
    } catch (err) {
      alert('Failed to contact gateway.');
    }
  };

  const handleRemoveAdminAccountOnly = async (accountId: string) => {
    if (!window.confirm("Are you sure you want to revoke this employee's Admin Portal access? They will remain in the whitelisted roster.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/remove-admin-account?accountId=${accountId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      const json = await res.json();
      if (json.success) {
        alert("Admin portal access successfully revoked.");
        fetchDashboardData();
      } else {
        alert(json.error || "Failed to revoke admin portal access.");
      }
    } catch (e) {
      alert("Error communicating with servers.");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectDescription.trim() || !projectDeadline || !projectLeaderId) {
      alert('Please fill out all project domain creation parameters.');
      return;
    }

    try {
      setCreatingProject(true);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: projectName.trim(),
          description: projectDescription.trim(),
          deadline: projectDeadline,
          leaderUserId: projectLeaderId,
          pmUserId: currentUser.id
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Could not instantiate target project.');
      } else {
        setProjSuccessText(`Successfully launched project domain: "${resJson.project.name}"`);
        setProjectName('');
        setProjectDescription('');
        setProjectDeadline('');
        // Refresh
        fetchDashboardData();
        setTimeout(() => setProjSuccessText(null), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to transmit project creation parameters.');
    } finally {
      setCreatingProject(false);
    }
  };

  const getRoleColor = (role: string) => {
    return 'bg-forest/10 text-forest-dark border border-forest/15';
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest"></div>
          <span className="text-sm font-medium text-slate-500 font-mono">Connecting Workspace Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800">
      {/* Top Ribbon Navbar (30% Secondary Dark) */}
      <header className="bg-slate-900 text-white shadow-sm border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-forest p-2.5 rounded-xl text-white">
              <Building className="w-5 h-5 text-sage-light" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-100">Nexus Workspace Hub</h1>
              <p className="text-[9px] text-sage font-mono tracking-widest uppercase">Cooperative Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-300">Logged in as: <strong className="text-slate-100 font-bold">{currentUser.name}</strong></div>
              <div className="text-[9px] text-sage font-mono uppercase tracking-wider">{currentUser.globalRole}</div>
            </div>

            {currentUser.globalRole === 'MANAGER' && (
              <button
                onClick={onOpenAdminPortal}
                className="inline-flex items-center gap-1.5 bg-forest hover:bg-forest-light text-white text-xs font-bold py-2 px-3 sm:px-4 rounded-xl border border-forest-dark shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 active:scale-97 cursor-pointer"
              >
                🔒 Admin Portal
              </button>
            )}

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 hover:text-sage text-slate-300 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 active:scale-97 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-150 rounded-xl text-red-700 flex items-start gap-2 text-xs text-left">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Stunning Premium 2-Tone Welcome Banner (30% Secondary Dark) */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-md text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-forest/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl text-left">
            <span className="text-[9px] font-bold tracking-widest font-mono text-gold bg-gold/10 px-2.5 py-1 rounded-full uppercase border border-gold/20">
              Welcome Gateway
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-3 text-slate-100">
              Welcome to Your Nexus Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
              A collaborative, modern platform designed to keep your projects organized. Every team member has open access to start new projects, coordinate rosters, and keep track of development milestones in real-time.
            </p>
          </div>
        </div>

        {/* System Commands & Directives Section */}
        {data?.systemCommands && data.systemCommands.length > 0 && (
          <div className="mb-8 bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-md relative overflow-hidden text-left animate-fade-in">
            <div className="absolute inset-0 bg-radial-at-tr from-forest/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-xs tracking-wider uppercase text-gold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sage" />
                  📢 Global Workspace Announcements
                </h3>
                <span className="text-[9px] bg-slate-950/80 text-sage font-mono font-bold px-2.5 py-1 rounded-full border border-sage-dark/40">
                  {data.systemCommands.length} Active Directives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.systemCommands.map((cmd) => (
                  <div key={cmd.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2 flex flex-col justify-between hover:border-sage/30 transition-colors">
                    <p className="text-xs text-slate-100 leading-relaxed font-mono whitespace-pre-wrap">
                      &gt; {cmd.commandText}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-2 mt-2">
                      <span>Broadcasted by: <strong className="text-sage font-bold">{cmd.createdBy}</strong></span>
                      <span>{new Date(cmd.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Overview Performance Stats widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 animate-fade-in">
            <div className="p-3 bg-sage-light/30 text-forest rounded-xl">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Projects</div>
              <div className="text-2xl font-black font-mono text-slate-800">{data?.projects.length || 0}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 animate-fade-in">
            <div className="p-3 bg-sage-light/30 text-forest rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Team Directory</div>
              <div className="text-2xl font-black font-mono text-slate-800">{data?.roster.length || 0}</div>
            </div>
          </div>

          <div className="bg-cream-light border border-gold-light/60 rounded-2xl p-5 shadow-sm flex items-center gap-3 text-xs text-slate-700 animate-fade-in">
            <Info className="w-5 h-5 text-forest flex-shrink-0" />
            <p className="leading-relaxed">
              Every team member has open, secure access to coordinate together. Keep track of tasks, assign roles, and see live updates.
            </p>
          </div>
        </div>

        {/* Projects and Roster Section split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Active Projects Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-forest" />
                Active Projects
              </h2>
              <span className="text-xs bg-sage-light/30 text-forest font-bold px-3 py-1 rounded-full border border-sage-light">
                Total: {data?.projects.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.projects.map((proj) => {
                const isNearDeadline = () => {
                  const daysLeft = Math.round(
                    (new Date(proj.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysLeft < 7 && daysLeft >= 0;
                };

                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className="group bg-white border border-slate-200 hover:border-forest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-forest text-base leading-snug transition-colors line-clamp-1">
                          {proj.name}
                        </h3>
                        {isNearDeadline() && (
                          <span className="bg-red-50 text-red-600 border border-red-155 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2 mt-auto">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <UserSquare2 className="w-3.5 h-3.5 text-slate-400" />
                          Leader: <strong className="text-slate-700">{proj.leaderName}</strong>
                        </span>
                        <span className="font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-150">
                          {proj.memberCount} members
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-medium text-slate-500">
                          <Calendar className={`w-3.5 h-3.5 ${isNearDeadline() ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                          Deadline: {new Date(proj.deadline).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-forest font-semibold group-hover:translate-x-1 transition-transform">
                          Open Board <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Project Launcher Sandbox Panel: Now open to everyone (30% Secondary Dark) */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-white shadow-md space-y-4">
              <div>
                <h3 className="font-bold text-sm tracking-tight uppercase text-gold flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-gold" />
                  Start a New Project
                </h3>
                <p className="text-xs text-slate-400 leading-snug">
                  Fill out the fields below to instantly generate a new interactive project board with default stages.
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-3.5 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Website Redesign"
                      className="w-full bg-slate-850 border border-slate-750 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-forest placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Deadline Date</label>
                    <input
                      type="date"
                      required
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-750 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-forest text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Description</label>
                  <textarea
                    required
                    value={projectDescription}
                    rows={2}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the goals and scope of this project..."
                    className="w-full bg-slate-850 border border-slate-750 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-forest placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Leader</label>
                  <select
                    required
                    value={projectLeaderId}
                    onChange={(e) => setProjectLeaderId(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-750 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-forest text-slate-300"
                  >
                    <option value="">-- Select a team leader --</option>
                    {data?.roster
                      .map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.globalRole})</option>
                      ))
                    }
                  </select>
                </div>

                {projSuccessText && (
                  <div className="p-2.5 bg-emerald-950/50 border border-emerald-900 rounded-lg text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {projSuccessText}
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={creatingProject}
                    className="bg-forest hover:bg-forest-light text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Project Board
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Company Whitelist Roster directory */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-forest" />
              Company Roster
            </h2>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Employee Profile</span>
                <span>Role/ID</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {data?.roster.map((user) => {
                  const adminAcc = data?.adminAccounts?.find(a => a.linkedUserId === user.id);
                  const isManager = currentUser.globalRole === 'MANAGER';
                  const isSelf = user.id === currentUser.id;

                  return (
                    <div key={user.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs gap-3">
                      <div>
                        <div className="font-bold text-slate-800 flex flex-wrap items-center gap-1.5 text-sm">
                          <span>{user.name}</span>
                          {isSelf && (
                            <span className="text-[9px] bg-sage-light/30 text-forest font-bold px-1.5 py-0.5 rounded-full uppercase border border-sage-light">
                              Me
                            </span>
                          )}
                          {adminAcc && (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-gold-light/40 text-gold-dark font-mono font-bold px-1.5 py-0.5 rounded-full uppercase border border-gold-light">
                              <LockKeyhole className="w-2 h-2 text-gold-dark" /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: <strong className="text-forest font-bold">{user.customId}</strong> • {user.globalRole}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isManager && !isSelf && adminAcc && (
                          <button
                            onClick={() => handleRemoveAdminAccountOnly(adminAcc.id)}
                            title="Revoke Admin Portal Access"
                            className="p-1.5 bg-sage-light/20 hover:bg-sage-light border border-sage-light text-forest rounded transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                          >
                            <LockKeyhole className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isManager && !isSelf && (
                          <button
                            onClick={() => handleFireEmployee(user.id, user.name)}
                            title="Terminate Employee Completely"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-rose-600 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
