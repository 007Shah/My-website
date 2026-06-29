import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Plus, 
  ArrowLeft, 
  Lock, 
  Users, 
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  UserCog,
  HelpCircle,
  Trash2,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { User, Project, AdminAccount, GlobalRole, SystemCommand } from '../types';

interface AdminPortalProps {
  currentUser: User;
  onClose: () => void;
  onRefreshData?: () => void;
}

interface HydratedAdmin extends AdminAccount {
  user: {
    name: string;
    customId: string;
    globalRole: string;
  };
}

export function AdminPortal({ currentUser, onClose, onRefreshData }: AdminPortalProps) {
  // Login phase vs Panel phase
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(currentUser.globalRole === 'MANAGER');
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Session data
  const [sessionAdmin, setSessionAdmin] = useState<{ id: string; adminId: string; linkedUserId: string } | null>(
    currentUser.globalRole === 'MANAGER' ? { id: 'adm-manager', adminId: currentUser.customId, linkedUserId: currentUser.id } : null
  );

  // Lists retrieved from endpoints
  const [whitelistedUsers, setWhitelistedUsers] = useState<User[]>([]);
  const [adminAccountsList, setAdminAccountsList] = useState<HydratedAdmin[]>([]);
  const [unassignedLeaders, setUnassignedLeaders] = useState<User[]>([]);
  const [systemCommandsList, setSystemCommandsList] = useState<SystemCommand[]>([]);

  // Active tab state inside the Admin Panel
  // 'whitelist' | 'change-roles' | 'add-admins' | 'system-commands' | 'fired-employees'
  const [activeTab, setActiveTab] = useState<'whitelist' | 'change-roles' | 'add-admins' | 'system-commands' | 'fired-employees'>('whitelist');

  // Tab 1.5/5 states: Custom roles and Fired Employees
  const [useCustomRole, setUseCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [firedEmployees, setFiredEmployees] = useState<{ id: string, name: string, customId: string, globalRole: string, firedAt: string }[]>([]);

  // Forms state
  // Tab 1: Whitelist/Hire new employee
  const [empName, setEmpName] = useState('');
  const [empId, setEmpId] = useState('');
  const [empRole, setEmpRole] = useState<GlobalRole>('SENIOR DEVELOPER');
  const [empSuccess, setEmpSuccess] = useState<string | null>(null);
  const [empError, setEmpError] = useState<string | null>(null);

  // Tab 3: Promote Admin (Grant Portal Access)
  const [promoUserId, setPromoUserId] = useState('');
  const [promoAdminId, setPromoAdminId] = useState('');
  const [promoPassword, setPromoPassword] = useState('');
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Tab 4: Write Command
  const [newCommandText, setNewCommandText] = useState('');
  const [commandSuccess, setCommandSuccess] = useState<string | null>(null);
  const [commandError, setCommandError] = useState<string | null>(null);

  const [loadingLists, setLoadingLists] = useState(false);

  // Bootstrapping
  const fetchPortalData = async () => {
    try {
      setLoadingLists(true);
      
      // Get dashboard data to retrieve users and system commands list
      const dashRes = await fetch(`/api/dashboard?userId=${currentUser.id}`);
      if (dashRes.ok) {
        const dashJson = await dashRes.json();
        if (dashJson.success) {
          setWhitelistedUsers(dashJson.roster || []);
          setSystemCommandsList(dashJson.systemCommands || []);
        }
      }

      // Read admin accounts
      const adminsRes = await fetch('/api/admin/accounts', {
        headers: {
          'x-user-id': currentUser.id
        }
      });
      if (adminsRes.ok) {
        const adminsJson = await adminsRes.json();
        if (adminsJson.success) {
          setAdminAccountsList(adminsJson.accounts || []);
        }
      }

      // Read PM/LEADERs/Personnel with no admin profile yet
      const unassignedRes = await fetch('/api/admin/unassigned-leaders', {
        headers: {
          'x-user-id': currentUser.id
        }
      });
      if (unassignedRes.ok) {
        const unassignedJson = await unassignedRes.json();
        if (unassignedJson.success) {
          setUnassignedLeaders(unassignedJson.leaders || []);
        }
      }

      // Read Fired Employees
      const firedRes = await fetch('/api/admin/fired-employees', {
        headers: {
          'x-user-id': currentUser.id
        }
      });
      if (firedRes.ok) {
        const firedJson = await firedRes.json();
        if (firedJson && firedJson.success) {
          setFiredEmployees(firedJson.list || []);
        }
      }

    } catch (e) {
      console.error('Failed querying portal directories', e);
    } finally {
      setLoadingLists(false);
    }
  };

  // Automatically fetch portal data on mount if already authenticated as MANAGER
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchPortalData();
    }
  }, [isAdminLoggedIn]);

  // Login handler
  const handleAdminGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminIdInput.trim() || !passwordInput.trim()) {
      setLoginError('Complete ID and password elements to proceed.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminIdInput.trim().toUpperCase(),
          password: passwordInput.trim()
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setLoginError(json.error || 'Authentication denied. Access credentials invalid.');
      } else {
        setIsAdminLoggedIn(true);
        setSessionAdmin(json.admin);
        fetchPortalData();
      }
    } catch (err) {
      setLoginError('Gateway connectivity error.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Whitelisting Form Handler (Tab 1)
  const handleWhitelistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmpSuccess(null);
    setEmpError(null);

    if (!empName.trim() || empId.trim().length !== 5) {
      setEmpError('Name cannot be blank and Custom ID must reside exactly in a 5-char alphanumeric block.');
      return;
    }

    const finalRole = useCustomRole ? customRoleInput.trim() : empRole;
    if (!finalRole) {
      setEmpError('Role cannot be blank.');
      return;
    }

    try {
      const res = await fetch('/api/auth/whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id
        },
        body: JSON.stringify({
          name: empName.trim(),
          customId: empId.trim().toUpperCase(),
          globalRole: finalRole
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setEmpError(json.error || 'Registration failed.');
      } else {
        setEmpSuccess(`Whitelisted & hired employee successfully: ${json.user.name} (${json.user.customId})`);
        setEmpName('');
        setEmpId('');
        setCustomRoleInput('');
        setUseCustomRole(false);
        fetchPortalData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      setEmpError('Transitional network socket failure.');
    }
  };

  // Terminate & Purge Employee Handler
  const handleFireEmployee = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the whole system?\nThis will delete their entire existence, clean their project assignments, and place them in the Fired Employees list.`)) {
      return;
    }

    setEmpSuccess(null);
    setEmpError(null);

    try {
      const res = await fetch(`/api/admin/remove-employee-completely?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ userId })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setEmpSuccess(`Successfully terminated & removed ${name} from the system.`);
        fetchPortalData();
        if (onRefreshData) onRefreshData();
      } else {
        setEmpError(json.error || 'Failed to remove employee.');
      }
    } catch (err) {
      setEmpError('Failed to contact gateway.');
    }
  };

  // Update Whitelisted Employee Global Role (Tab 2)
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setEmpSuccess(null);
    setEmpError(null);
    try {
      const res = await fetch('/api/admin/update-employee-role', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ userId, globalRole: newRole })
      });
      const json = await res.json();
      if (json.success) {
        setEmpSuccess(`Employee role successfully updated to ${newRole}.`);
        fetchPortalData();
        if (onRefreshData) onRefreshData();
      } else {
        setEmpError(json.error || "Failed to update employee role.");
      }
    } catch (e) {
      setEmpError("Error transmitting role change.");
    }
  };

  // Promote Admin Form Handler (Tab 3)
  const handlePromoteAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoSuccess(null);
    setPromoError(null);

    if (!promoUserId || !promoAdminId.trim() || !promoPassword.trim()) {
      setPromoError('Fill out all access coordinates completely.');
      return;
    }

    try {
      const res = await fetch('/api/admin/register-admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          adminId: promoAdminId.trim().toUpperCase(),
          password: promoPassword.trim(),
          linkedUserId: promoUserId
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setPromoError(json.error || 'Failed to deploy administration status.');
      } else {
        setPromoSuccess(`Admin portal access successfully granted to candidate with Admin ID "${promoAdminId.toUpperCase()}"!`);
        setPromoAdminId('');
        setPromoPassword('');
        setPromoUserId('');
        fetchPortalData();
      }
    } catch (err) {
      setPromoError('Could not contact network router.');
    }
  };

  // Revoke Admin Access (Tab 3)
  const handleRemoveAdminAccountOnly = async (accountId: string) => {
    if (!window.confirm("Are you sure you want to revoke this employee's Admin Portal access? They will remain in the whitelisted roster.")) return;
    setPromoSuccess(null);
    setPromoError(null);
    setEmpSuccess(null);
    setEmpError(null);
    try {
      const res = await fetch(`/api/admin/remove-admin-account?accountId=${accountId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      const json = await res.json();
      if (json.success) {
        setPromoSuccess("Admin portal access successfully revoked.");
        setEmpSuccess("Admin portal access successfully revoked.");
        fetchPortalData();
      } else {
        setPromoError(json.error || "Failed to revoke admin portal access.");
        setEmpError(json.error || "Failed to revoke admin portal access.");
      }
    } catch (e) {
      setPromoError("Error communicating with servers.");
      setEmpError("Error communicating with servers.");
    }
  };

  // Write Command Form Handler (Tab 4)
  const handlePublishCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommandSuccess(null);
    setCommandError(null);

    if (!newCommandText.trim()) {
      setCommandError('Command text cannot be blank.');
      return;
    }

    try {
      const res = await fetch('/api/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id
        },
        body: JSON.stringify({ commandText: newCommandText.trim() })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setCommandError(json.error || 'Failed to publish command.');
      } else {
        setCommandSuccess('System command successfully broadcasted to home page!');
        setNewCommandText('');
        fetchPortalData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      setCommandError('Failed to publish command due to connection failure.');
    }
  };

  const handleDeleteCommand = async (commandId: string) => {
    setCommandSuccess(null);
    setCommandError(null);

    try {
      const res = await fetch(`/api/commands/${commandId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': currentUser.id
        }
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setCommandError(json.error || 'Failed to delete command.');
      } else {
        setCommandSuccess('System command successfully deleted.');
        fetchPortalData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      setCommandError('Failed to contact server to delete command.');
    }
  };

  // Gates authentication view
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex justify-center items-center p-4 z-50 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-forest/20 to-slate-950 opacity-90" />
        <div className="absolute inset-0 bg-radial-at-tr from-forest/15 via-transparent to-transparent animate-pulse" />
        
        {/* Exit Button */}
        <div className="absolute top-6 left-6 z-55">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-750 hover:border-forest transition-all duration-200 active:scale-95 shadow-lg cursor-pointer text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>← Exit Setup</span>
          </button>
        </div>
        
        <div className="relative w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-8 text-center border-b border-slate-800">
            <div className="inline-flex items-center justify-center bg-forest/10 text-sage p-4 rounded-2xl mb-4 border border-forest/20 shadow-inner">
              <Lock className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">System Administration Gate</h2>
            <p className="text-[11px] text-sage font-mono tracking-widest mt-1 uppercase">RESTRICTED ACCORDING TO ROSTER PRIVILEGES</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleAdminGateLogin} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Administrative ID or standard employee ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM100 or ADMIN1"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value.toUpperCase().trim())}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-4 py-3 text-sm text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Administrative Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-4 py-3 text-sm text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2 mt-2 text-left">
                <span className="text-[9px] uppercase tracking-wider text-rose-450 font-black font-mono block">🛡️ SYSTEM AUTHORIZED ADMIN CODES</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Log in directly with your standard <strong>Employee ID</strong> (e.g. <strong>PM100</strong>) or the default Admin credentials below:
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminIdInput('PM100');
                      setPasswordInput('admin');
                    }}
                    className="w-full p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition-all active:scale-97 cursor-pointer group"
                  >
                    <div className="text-[10px] font-bold text-slate-200 group-hover:text-rose-400">Patricia Miller (Company Admin / Manager)</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">ID: <strong>PM100</strong></div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">Password: <strong>admin</strong></div>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 bg-rose-950/40 border border-rose-900 rounded-xl p-3 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs py-3 px-4 rounded-xl transition duration-250 cursor-pointer active:scale-97 flex items-center justify-center gap-1.5 border border-slate-750"
                >
                  <ArrowLeft className="w-4 h-4 text-rose-500" /> ← Back
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 bg-forest hover:bg-forest-light text-white font-bold text-xs py-3 px-4 rounded-xl transition duration-250 cursor-pointer active:scale-97 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Gate
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-950/80 border-t border-slate-800 p-4 text-center">
            <p className="text-[10px] text-slate-500 leading-normal font-sans">
              Credentials: <strong>PM100</strong> (password: <strong>admin</strong>)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Admin Console
  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 flex flex-col z-50 overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-forest/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative bg-slate-900 border-b border-slate-850 px-6 h-18 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-forest/10 border border-forest/30 p-2.5 rounded-xl text-sage shadow-inner">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5 select-none">
              Nexus Corporate Admin Command Room
              <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">ACTIVE SECURE CHANNEL</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Access Node: {sessionAdmin?.adminId} • Authorized Session</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPortalData}
            title="Refresh Data"
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl border border-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="bg-forest hover:bg-forest-light text-white font-black text-xs py-2.5 px-4 rounded-xl border border-forest-dark transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> ← Exit Setup
          </button>
        </div>
      </header>

      {/* Main split workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-850 p-5 shrink-0 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono select-none">AUTHORIZED ACTION PANELS</p>
              <nav className="mt-3 space-y-1.5">
                
                {/* Tab 1: Hire Employees */}
                <button
                  onClick={() => {
                    setActiveTab('whitelist');
                    setEmpSuccess(null);
                    setEmpError(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    activeTab === 'whitelist' 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 font-black' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Hire New Employees
                  </span>
                  <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded font-mono font-bold text-slate-500">TAB 1</span>
                </button>

                {/* Tab 2: Change Roles */}
                <button
                  onClick={() => {
                    setActiveTab('change-roles');
                    setEmpSuccess(null);
                    setEmpError(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    activeTab === 'change-roles' 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 font-black' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Change Their Roles
                  </span>
                  <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded font-mono font-bold text-slate-500">TAB 2</span>
                </button>

                {/* Tab 3: Grant Access */}
                <button
                  onClick={() => {
                    setActiveTab('add-admins');
                    setPromoSuccess(null);
                    setPromoError(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    activeTab === 'add-admins' 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 font-black' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    Grant Portal Access
                  </span>
                  <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded font-mono font-bold text-slate-500">TAB 3</span>
                </button>

                {/* Tab 4: Write Commands */}
                <button
                  onClick={() => {
                    setActiveTab('system-commands');
                    setCommandSuccess(null);
                    setCommandError(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    activeTab === 'system-commands' 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 font-black' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Write Commands
                  </span>
                  <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded font-mono font-bold text-slate-500">TAB 4</span>
                </button>

                {/* Tab 5: Fired Employees */}
                <button
                  onClick={() => {
                    setActiveTab('fired-employees');
                    setEmpSuccess(null);
                    setEmpError(null);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
                    activeTab === 'fired-employees' 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 font-black' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Fired Employees
                  </span>
                  <span className="text-[9px] bg-slate-950/60 px-1.5 py-0.2 rounded font-mono font-bold text-slate-500">TAB 5</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-850 p-4.5 rounded-2xl text-[10px] text-slate-500 leading-relaxed font-sans">
            <HelpCircle className="w-3.5 h-3.5 text-sage mb-1.5" />
            <span>
              You are using the customized Admin Command Room. Only requested tools are enabled. All unrequested panels have been purged.
            </span>
          </div>
        </aside>

        {/* Content Console Panel */}
        <main className="flex-1 bg-slate-950 p-8 overflow-y-auto w-full relative">
          {loadingLists && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex justify-center items-center z-40">
              <div className="flex flex-col items-center gap-1.5">
                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest" />
                <span className="text-xs text-slate-400 font-mono">Synchronizing directories...</span>
              </div>
            </div>
          )}

          {/* Tab Content 1: Hire Employees */}
          {activeTab === 'whitelist' && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sage" /> Hire New Employees
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enroll new personnel into the corporate roster. Only the company admin (Manager) is authorized to hire new employees.
                </p>
              </div>

              {currentUser.globalRole !== 'MANAGER' ? (
                <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                  <Lock className="w-10 h-10 text-rose-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-200">Exclusive MANAGER (Company Admin) Privilege</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    You are logged in with role <strong>{currentUser.globalRole}</strong>. Only the corporate <strong>MANAGER</strong> is authorized to hire and whitelist new personnel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form left */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative mt-2">
                    <h3 className="text-xs font-black uppercase text-gold mb-4 tracking-wider">Hiring Registration</h3>
                    
                    <form onSubmit={handleWhitelistSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={empName}
                          onChange={(e) => setEmpName(e.target.value)}
                          placeholder="e.g. Roy Batty"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-3 py-2 text-slate-200 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">5-Char Employee ID</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value.toUpperCase().trim())}
                            placeholder="e.g. RY201"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-3 py-2 text-slate-200 font-mono font-bold text-center uppercase focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="block text-[9px] uppercase font-bold text-slate-400">Global Core Role</label>
                            <button
                              type="button"
                              onClick={() => {
                                setUseCustomRole(!useCustomRole);
                                if (!useCustomRole) setCustomRoleInput('');
                              }}
                              className="text-[9px] text-sage hover:text-sage-light font-bold underline cursor-pointer"
                            >
                              {useCustomRole ? "Pick Preset" : "Write Custom"}
                            </button>
                          </div>
                          {useCustomRole ? (
                            <input
                              type="text"
                              required
                              value={customRoleInput}
                              onChange={(e) => setCustomRoleInput(e.target.value)}
                              placeholder="e.g. Principal Architect"
                              className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none transition-colors"
                            />
                          ) : (
                            <select
                              value={empRole}
                              onChange={(e) => setEmpRole(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-2 py-1.5 text-slate-300 focus:outline-none transition-colors font-sans text-xs cursor-pointer"
                            >
                              <option value="MANAGER">MANAGER</option>
                              <option value="TEAM LEADER">TEAM LEADER</option>
                              <option value="HR">HR</option>
                              <option value="ML ENGINEER">ML ENGINEER</option>
                              <option value="SENIOR DEVELOPER">SENIOR DEVELOPER</option>
                              <option value="JUNIOR DEVELOPER">JUNIOR DEVELOPER</option>
                              <option value="SENIOR DESIGNER">SENIOR DESIGNER</option>
                              <option value="JUNIOR DESIGNER">JUNIOR DESIGNER</option>
                              <option value="INTERNEE">INTERNEE</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {empSuccess && (
                        <div className="p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-emerald-400 flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{empSuccess}</span>
                        </div>
                      )}

                      {empError && (
                        <div className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-400 flex items-start gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{empError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-forest hover:bg-forest-light text-white font-extrabold text-xs py-3 px-4 rounded-xl transition duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-97 flex items-center justify-center gap-1.5 shadow-md hover:shadow-forest/10"
                      >
                        <Plus className="w-4 h-4" /> Enroll & Hire Employee
                      </button>
                    </form>
                  </div>

                  {/* Registry info right */}
                  <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col mt-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-wider select-none flex justify-between items-center font-mono">
                      <span>Whitelisted Employee Roster</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{whitelistedUsers.length} listed</span>
                    </h3>

                    {empSuccess && (
                      <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-emerald-400 flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{empSuccess}</span>
                      </div>
                    )}

                    {empError && (
                      <div className="mb-4 p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-400 flex items-start gap-1.5 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{empError}</span>
                      </div>
                    )}

                    <div className="divide-y divide-slate-850 overflow-y-auto max-h-[380px] pr-1 font-sans">
                      {whitelistedUsers.map((user) => {
                        const adminAcc = adminAccountsList.find(a => a.linkedUserId === user.id);
                        return (
                          <div key={user.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="font-bold text-slate-100 flex items-center gap-2">
                                <span>{user.name}</span>
                                {adminAcc && (
                                  <span className="inline-flex items-center gap-1 text-[8px] tracking-wide bg-forest/15 text-sage-light border border-forest/20 px-1.5 py-0.2 rounded font-mono uppercase font-black">
                                    <LockKeyhole className="w-2.5 h-2.5 text-sage" /> Admin ({adminAcc.adminId})
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">ID: <strong className="text-sage font-mono">{user.customId}</strong> • {user.globalRole}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-forest/10 text-sage border border-forest/25 px-2 py-0.5 rounded font-mono uppercase font-black">
                                {user.globalRole}
                              </span>
                              {adminAcc && user.id !== currentUser.id && (
                                <button
                                  onClick={() => handleRemoveAdminAccountOnly(adminAcc.id)}
                                  title="Revoke Admin Portal Access Only"
                                  className="p-1.5 bg-forest/10 hover:bg-forest/20 border border-forest/30 rounded text-sage hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                  <LockKeyhole className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {user.id !== currentUser.id && (
                                <button
                                  onClick={() => handleFireEmployee(user.id, user.name)}
                                  title="Terminate and remove from whole system"
                                  className="p-1.5 bg-rose-950/50 hover:bg-rose-900 border border-rose-900/50 rounded text-rose-400 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Change Roles */}
          {activeTab === 'change-roles' && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-sage" /> Change Employee Roles
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamically modify whitelisted employees' global core roles. This updates system-wide authorization permissions instantly.
                </p>
              </div>

              {currentUser.globalRole !== 'MANAGER' ? (
                <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                  <Lock className="w-10 h-10 text-rose-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-200">Exclusive MANAGER Privilege</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    You are logged in with role <strong>{currentUser.globalRole}</strong>. Only the corporate <strong>MANAGER</strong> is authorized to edit employee role permissions.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl mt-2 max-w-3xl">
                  <h3 className="text-xs font-black uppercase text-gold mb-4 tracking-wider select-none flex justify-between items-center font-mono">
                    <span>Change Assigned Roster Roles</span>
                    <span className="text-[10px] bg-slate-850 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{whitelistedUsers.length} Employees</span>
                  </h3>

                  {empSuccess && (
                    <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-emerald-400 flex items-start gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{empSuccess}</span>
                    </div>
                  )}

                  {empError && (
                    <div className="mb-4 p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-400 flex items-start gap-1.5 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{empError}</span>
                    </div>
                  )}

                  <div className="divide-y divide-slate-850 overflow-y-auto max-h-[420px] pr-1">
                    {whitelistedUsers.map((user) => (
                      <div key={user.id} className="py-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-100">{user.name}</div>
                          <span className="text-[10px] text-slate-400">Custom ID: <strong className="text-slate-300 font-mono">{user.customId}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">Assign Role:</span>
                          <select
                            value={user.globalRole}
                            disabled={user.id === currentUser.id} // Cannot demote themselves
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg font-bold px-2.5 py-1.5 focus:outline-none focus:border-forest text-slate-200 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="MANAGER">MANAGER</option>
                            <option value="TEAM LEADER">TEAM LEADER</option>
                            <option value="HR">HR</option>
                            <option value="ML ENGINEER">ML ENGINEER</option>
                            <option value="SENIOR DEVELOPER">SENIOR DEVELOPER</option>
                            <option value="JUNIOR DEVELOPER">JUNIOR DEVELOPER</option>
                            <option value="SENIOR DESIGNER">SENIOR DESIGNER</option>
                            <option value="JUNIOR DESIGNER">JUNIOR DESIGNER</option>
                            <option value="INTERNEE">INTERNEE</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Grant Access */}
          {activeTab === 'add-admins' && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-sage" /> Grant Portal Access
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authorize any whitelisted employee with custom login credentials, granting them full access to enter this Admin Command Room.
                </p>
              </div>

              {currentUser.globalRole !== 'MANAGER' ? (
                <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                  <Lock className="w-10 h-10 text-rose-500 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-200">Exclusive MANAGER Privilege</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    You are logged in with role <strong>{currentUser.globalRole}</strong>. Only the corporate <strong>MANAGER</strong> is authorized to grant Admin Portal access.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Promo Form */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative mt-2 text-xs">
                    <h3 className="text-xs font-black uppercase text-gold mb-4 tracking-wider">Grant Access Form</h3>

                    <form onSubmit={handlePromoteAdminSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">1. Select Any Whitelisted Employee</label>
                        <select
                          required
                          value={promoUserId}
                          onChange={(e) => setPromoUserId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-3 py-2 text-slate-300 focus:outline-none transition-colors"
                        >
                          <option value="">-- Choose whitelisted employee --</option>
                          {unassignedLeaders.map((u) => (
                            <option key={u.id} value={u.id}>{u.name} ({u.customId} - {u.globalRole})</option>
                          ))}
                        </select>
                        {unassignedLeaders.length === 0 && (
                          <p className="text-[10px] text-slate-500 mt-1">No other unassigned whitelisted employees found.</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">2. Unique Admin ID</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ADMIN_ROY"
                          value={promoAdminId}
                          onChange={(e) => setPromoAdminId(e.target.value.toUpperCase().trim())}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-4 py-2 text-slate-200 font-mono tracking-widest uppercase focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">3. Admin Security Password</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. secretPass"
                          value={promoPassword}
                          onChange={(e) => setPromoPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-4 py-2 text-slate-200 font-mono focus:outline-none transition-colors"
                        />
                      </div>

                      {promoSuccess && (
                        <div className="p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-emerald-400 flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{promoSuccess}</span>
                        </div>
                      )}

                      {promoError && (
                        <div className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-400 flex items-start gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{promoError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={unassignedLeaders.length === 0}
                        className="w-full bg-forest hover:bg-forest-light text-white font-extrabold text-xs py-3 px-4 rounded-xl transition duration-200 cursor-pointer disabled:opacity-40 hover:-translate-y-0.5 active:scale-97 flex items-center justify-center gap-1.5 shadow-md hover:shadow-forest/10"
                      >
                        <ShieldCheck className="w-4 h-4" /> Grant Access Privileges
                      </button>
                    </form>
                  </div>

                  {/* Active Admins list */}
                  <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col mt-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-wider select-none flex justify-between items-center font-mono">
                      <span>Authorized Admin Directory</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{adminAccountsList.length} Admins</span>
                    </h3>

                    <div className="divide-y divide-slate-850 overflow-y-auto max-h-[380px] pr-1 font-sans">
                      {adminAccountsList.map((adm) => (
                        <div key={adm.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-100">{adm.user?.name || 'Administrator'}</div>
                            <span className="text-[10px] text-slate-400">Admin ID: <strong className="text-slate-200 font-mono">{adm.adminId}</strong> • {adm.user?.globalRole}</span>
                          </div>
                          {adm.linkedUserId !== currentUser.id && (
                            <button
                              onClick={() => handleRemoveAdminAccountOnly(adm.id)}
                              className="bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 hover:border-rose-500 text-rose-400 hover:text-white px-2 py-1 rounded text-[10px] font-black cursor-pointer transition-colors"
                            >
                              Revoke Access
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 4: Write Commands */}
          {activeTab === 'system-commands' && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-sage" /> Write System Commands
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Publish system commands, broadcasts, and announcements that appear on the main employee dashboard home page.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form left */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative mt-2 text-xs">
                  <h3 className="text-xs font-black uppercase text-gold mb-4 tracking-wider">Publish New Command</h3>

                  <form onSubmit={handlePublishCommand} className="space-y-4">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Command Directive Text</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="e.g. NOTICE: Deployment phase beta has commenced. Please lock all codebases."
                        value={newCommandText}
                        onChange={(e) => setNewCommandText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-forest rounded-xl px-3 py-2 text-slate-200 focus:outline-none transition-colors font-mono text-xs"
                      />
                    </div>

                    {commandSuccess && (
                      <div className="p-3 bg-emerald-950/50 border border-emerald-900/60 rounded-xl text-emerald-400 flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{commandSuccess}</span>
                      </div>
                    )}

                    {commandError && (
                      <div className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl text-rose-400 flex items-start gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{commandError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-forest hover:bg-forest-light text-white font-extrabold text-xs py-3 px-4 rounded-xl transition duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-97 flex items-center justify-center gap-1.5 shadow-md hover:shadow-forest/10"
                    >
                      <Terminal className="w-4 h-4" /> Broadcast Command
                    </button>
                  </form>
                </div>

                {/* List right */}
                <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col mt-2">
                  <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-wider select-none flex justify-between items-center font-mono">
                    <span>Active Home Page Commands</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{systemCommandsList.length} active</span>
                  </h3>

                  <div className="divide-y divide-slate-850 overflow-y-auto max-h-[380px] pr-1 font-sans">
                    {systemCommandsList.length > 0 ? (
                      systemCommandsList.map((cmd) => (
                        <div key={cmd.id} className="py-3 flex flex-col justify-between gap-2 text-xs">
                          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 font-mono text-[11px] text-slate-100 whitespace-pre-wrap">
                            {cmd.commandText}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                            <span>by {cmd.createdBy} • {new Date(cmd.timestamp).toLocaleDateString()}</span>
                            <button
                              onClick={() => handleDeleteCommand(cmd.id)}
                              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                              title="Delete broadcast"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-8">No commands broadcasted yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 5: Fired Employees */}
          {activeTab === 'fired-employees' && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-500" /> Fired Employees Registry
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  View historically terminated and removed personnel from the entire corporate system.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl relative mt-2 text-xs">
                <h3 className="text-xs font-black uppercase text-rose-500 mb-4 tracking-wider select-none flex justify-between items-center font-mono">
                  <span>Terminated Personnel Log</span>
                  <span className="text-[10px] bg-slate-950 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{firedEmployees.length} registered</span>
                </h3>

                <div className="divide-y divide-slate-850 overflow-y-auto max-h-[480px] pr-1 font-sans">
                  {firedEmployees.length > 0 ? (
                    firedEmployees.map((emp) => (
                      <div key={emp.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-2">
                            <span>{emp.name}</span>
                            <span className="text-[9px] bg-rose-950/50 text-rose-400 border border-rose-900/40 px-1.5 py-0.2 rounded uppercase font-mono">
                              {emp.globalRole}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            Former ID: <strong className="text-slate-300">{emp.customId}</strong> • Log ID: {emp.id}
                          </p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/30 px-2 py-0.5 rounded">
                            TERMINATED
                          </span>
                          <p className="text-[9px] text-slate-500 mt-1">
                            {emp.firedAt ? new Date(emp.firedAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Trash2 className="w-8 h-8 mx-auto mb-2.5 text-slate-700 opacity-60" />
                      <p className="italic text-xs font-mono">No termination records found in core directory.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
