import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Lock, 
  Send, 
  CheckCircle,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { User, CompleteProjectWorkspace } from '../types';
import { AnalyticsChart } from './AnalyticsChart';

interface ProjectWorkspaceViewProps {
  projectId: string;
  currentUser: User;
  onBackToDashboard: () => void;
}

export function ProjectWorkspaceView({ projectId, currentUser, onBackToDashboard }: ProjectWorkspaceViewProps) {
  const [workspace, setWorkspace] = useState<CompleteProjectWorkspace | null>(null);
  const [userProjectRole, setUserProjectRole] = useState<'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR' | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Security challenge gate states
  const [challengeRequired, setChallengeRequired] = useState(false);
  const [gateCode, setGateCode] = useState('');
  const [gateError, setGateError] = useState<string | null>(null);
  const [unlockedForSpectator, setUnlockedForSpectator] = useState(false);

  // Forms states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskColId, setTaskColId] = useState('');
  const [taskAssignees, setTaskAssignees] = useState<string[]>([]);

  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportStatus, setReportStatus] = useState<'SENT' | 'SCHEDULED'>('SENT');
  const [reportDate, setReportDate] = useState('');
  const [showAddReportForm, setShowAddReportForm] = useState(false);

  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR'>('TEAM_MEMBER');
  const [newMemberJobTitle, setNewMemberJobTitle] = useState('');
  const [memberSuccessText, setMemberSuccessText] = useState<string | null>(null);

  const [chatMessage, setChatMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Poll intervals to simulate Pusher real-time updates safely
  const pollingRef = useRef<any>(null);

  const loadWorkspace = async (suppliedGateCode?: string) => {
    try {
      const gCode = suppliedGateCode || gateCode || '';
      const url = `/api/project/${projectId}?userId=${currentUser.id}&gateCode=${encodeURIComponent(gCode)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (res.status === 403 && json.spectatorChallengeRequired) {
        setChallengeRequired(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(json.message || 'Access blocked. This is an isolated workspace.');
      }

      setChallengeRequired(false);
      setWorkspace(json.data);
      setUserProjectRole(json.role);
      setLoading(false);
    } catch (err: any) {
      alert(err.message || 'Fatal permissions validation error.');
      onBackToDashboard();
    }
  };

  useEffect(() => {
    // Initial fetch
    loadWorkspace();

    // Start 2-second polling loop to simulate real-time live synchronization (and Pusher updates)
    // and keep the UI instantly updated!
    pollingRef.current = setInterval(() => {
      syncWorkspace();
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [projectId]);

  // Silently reload in background for message / task changes
  const syncWorkspace = async () => {
    try {
      const gValue = gateCode || '';
      const url = `/api/project/${projectId}?userId=${currentUser.id}&gateCode=${encodeURIComponent(gValue)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setWorkspace(json.data);
        setUserProjectRole(json.role);
      }
    } catch (e) {
      // Ignore background errors
    }
  };

  // Track message count to prevent page jumping down when scrolling up
  const lastMsgCountRef = useRef(0);

  useEffect(() => {
    const msgCount = workspace?.messages?.length || 0;
    // Scroll only if loading for first time with messages or if a new message is received
    if (msgCount > lastMsgCountRef.current) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
    lastMsgCountRef.current = msgCount;
  }, [workspace?.messages]);

  const handleVerifyGateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gateCode.trim().length !== 5) {
      setGateError('Challenge ID must be exactly 5 custom characters.');
      return;
    }
    setGateError(null);
    try {
      const url = `/api/project/${projectId}?userId=${currentUser.id}&gateCode=${encodeURIComponent(gateCode.trim())}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json.allowed) {
        setGateError(json.message || 'Target challenge verification rejected.');
      } else {
        setChallengeRequired(false);
        setWorkspace(json.data);
        setUserProjectRole(json.role);
        setUnlockedForSpectator(true);
      }
    } catch (err) {
      setGateError('Verification transport timed out.');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId.trim() || newMemberId.trim().length !== 5) {
      alert('Ensure target Employee ID has exactly 5 custom characters.');
      return;
    }

    try {
      const res = await fetch(`/api/project/${projectId}/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requesterUserId: currentUser.id,
          customId: newMemberId.trim().toUpperCase(),
          role: newMemberRole,
          jobTitle: newMemberJobTitle.trim()
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Failed to authorize employee membership.');
      } else {
        setMemberSuccessText(`Enrolled: ${resJson.membership.user.name} (${resJson.membership.user.customId})`);
        setNewMemberId('');
        setNewMemberJobTitle('');
        syncWorkspace();
        setTimeout(() => setMemberSuccessText(null), 4000);
      }
    } catch (err) {
      console.error(err);
      alert('Internal connection state error.');
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (userProjectRole === 'SPECTATOR') return;
    if (memberUserId === currentUser.id) {
      alert("You cannot remove yourself from this project.");
      return;
    }
    if (!confirm('Are you authorized to remove this employee from the project team roster?')) return;

    try {
      const res = await fetch(`/api/project/${projectId}/member/${memberUserId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser.id
        }
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Failed to remove member.');
      } else {
        alert('Member successfully removed from project workspace.');
        syncWorkspace();
      }
    } catch (err) {
      console.error(err);
      alert('Network state error while removing team member.');
    }
  };

  const handleChangePresence = async (memberUserId: string, status: 'WORKING' | 'OFF') => {
    try {
      const res = await fetch(`/api/project/${projectId}/member/${memberUserId}/presence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ presenceStatus: status })
      });
      if (res.ok) {
        loadWorkspace();
      } else {
        const errorJson = await res.json();
        alert(errorJson.error || 'Failed to update presence status.');
      }
    } catch (err) {
      console.error('Failed to update presence status', err);
      alert('Network error while updating presence status');
    }
  };

  const handleUpdateAccessibility = async (memberUserId: string, role: 'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR') => {
    try {
      const res = await fetch(`/api/project/${projectId}/member/${memberUserId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUser.id
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        loadWorkspace();
      } else {
        const errorJson = await res.json();
        alert(errorJson.error || 'Failed to update accessibility status.');
      }
    } catch (err) {
      console.error('Failed to update member role', err);
      alert('Network error while updating accessibility level');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskColId) {
      return;
    }

    try {
      const res = await fetch(`/api/project/${projectId}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          title: taskTitle.trim(),
          columnId: taskColId,
          assigneeIds: taskAssignees
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Failed to create task card.');
      } else {
        setTaskTitle('');
        setTaskColId('');
        setTaskAssignees([]);
        syncWorkspace();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, targetColId: string) => {
    if (userProjectRole === 'SPECTATOR') return;

    // Resolve Status Name based on column target
    const colName = workspace?.columns.find(c => c.id === targetColId)?.name.toLowerCase() || '';
    let statusValue: 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' = 'TO_DO';
    if (colName.includes('progress')) statusValue = 'IN_PROGRESS';
    else if (colName.includes('review') || colName.includes('test')) statusValue = 'REVIEW';
    else if (colName.includes('done') || colName.includes('complete')) statusValue = 'DONE';

    try {
      const res = await fetch(`/api/project/${projectId}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          columnId: targetColId,
          status: statusValue
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error || 'Failed to mutate task column placement.');
      } else {
        syncWorkspace();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (userProjectRole === 'SPECTATOR') return;
    if (!confirm('Are you authorized to discard this task card?')) return;

    try {
      const res = await fetch(`/api/project/${projectId}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error ?? 'Failed to delete task.');
      } else {
        syncWorkspace();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || userProjectRole === 'SPECTATOR') return;

    const textToSend = chatMessage;
    // Clear instantly to give responsive feel
    setChatMessage('');

    try {
      const res = await fetch(`/api/project/${projectId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          text: textToSend
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        alert(errJson.error || 'Failed to send message.');
        setChatMessage(textToSend); // restore
      } else {
        syncWorkspace();
      }
    } catch (e) {
      console.error(e);
      setChatMessage(textToSend);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportContent.trim() || !reportDate) {
      alert('Ensure all update variables are populated.');
      return;
    }

    try {
      const res = await fetch(`/api/project/${projectId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          title: reportTitle.trim(),
          content: reportContent.trim(),
          status: reportStatus,
          scheduledDate: reportDate
        })
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        alert(resJson.error || 'Authorization invalid to log milestones.');
      } else {
        setReportTitle('');
        setReportContent('');
        setReportDate('');
        setShowAddReportForm(false);
        syncWorkspace();
      }
    } catch (err) {
      console.error(err);
      alert('Report server communication failed.');
    }
  };

  // Helper formatting days remaining metrics
  const getDeadlineMarkupAndBadge = (deadlineStr: string) => {
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)}d (${new Date(deadlineStr).toLocaleDateString()})`,
        style: 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse'
      };
    } else if (diffDays <= 7) {
      return {
        label: `Urgent: ${diffDays} days left! (${new Date(deadlineStr).toLocaleDateString()})`,
        style: 'bg-rose-500 text-white border-rose-600 font-black animate-pulse'
      };
    } else if (diffDays <= 30) {
      return {
        label: `${diffDays} days remaining (${new Date(deadlineStr).toLocaleDateString()})`,
        style: 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
      };
    } else {
      return {
        label: `On track: ${diffDays} days (${new Date(deadlineStr).toLocaleDateString()})`,
        style: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    }
  };

  // Challenge Gate Lock View for Spectator Access
  if (challengeRequired) {
    return (
      <div id="challenge-gate-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 text-center space-y-6">
          <div className="mx-auto inline-flex items-center justify-center p-4 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
            <Lock className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Security Gateway Gate</h2>
            <p className="text-xs text-slate-400">
              This sandbox is isolated. Corporate protocol grants you view credentials, but you must verify ownership of your unique account password key to unlock.
            </p>
          </div>

          <form onSubmit={handleVerifyGateCode} className="space-y-4 text-left">
            <div>
              <label htmlFor="gateCode" className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 text-center">
                Type Your Unique Whitelisted 5-Character ID
              </label>
              <input
                id="gateCode"
                name="gateCode"
                type="text"
                maxLength={5}
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value.toUpperCase().trim())}
                placeholder="e.g. DV003"
                className="w-full text-center bg-slate-800 border border-slate-700 text-slate-100 py-3 rounded-xl font-mono text-xl font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase placeholder:text-slate-600 focus:bg-slate-800/80"
              />
            </div>

            {gateError && (
              <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-xl text-xs flex items-start gap-1.5 leading-normal">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{gateError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              Unlock View-Only Spectator Mode
            </button>
          </form>

          <button
            onClick={onBackToDashboard}
            type="button"
            className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
          >
            ← Cancel and Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || !workspace) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest"></div>
          <span className="text-sm font-medium text-slate-500 font-mono">Accessing Project Node...</span>
        </div>
      </div>
    );
  }

  const { project, columns, tasks, reports, messages, memberships } = workspace;
  const deadlineMetric = getDeadlineMarkupAndBadge(project.deadline);

  // Check if current user can add members (Anyone can now)
  const isLeaderOrPM = true;
  const isSpectatorMode = false;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-16">
      {/* Workspace Top Header Bar (30% Secondary Dark) */}
      <header className="bg-slate-900 text-white border-b border-slate-850 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToDashboard}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-sage transition-colors cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <div className="text-[9px] text-sage font-bold uppercase tracking-widest font-mono">Project Workspace</div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight">{project.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[9px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border ${deadlineMetric.style}`}>
              {deadlineMetric.label}
            </span>

            {isSpectatorMode ? (
              <span className="flex items-center gap-1 bg-slate-800 text-amber-400 border-slate-700 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border">
                <Lock className="w-3 h-3" /> Read-Only
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-slate-800 text-sage-light border-slate-700 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border">
                <ShieldCheck className="w-3 h-3 text-sage" /> Active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP SECTION: Details and Analytics (60% Dominant Light Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details Overview Card: Tinted Cream Theme */}
          <div className="lg:col-span-2 bg-cream-light/40 border border-gold-light/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest shrink-0" />
                Project Goals & Requirements
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-6">
              <div className="text-xs">
                <span className="text-slate-400 block font-bold font-mono uppercase tracking-widest text-[9px]">Workspace Key</span>
                <strong className="text-slate-800 font-extrabold">{project.id}</strong>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block font-bold font-mono uppercase tracking-widest text-[9px]">User Session</span>
                <span className="inline-flex items-center gap-1 text-slate-700 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-forest" />
                  {currentUser.name} ({currentUser.customId})
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Chart: Sage Frame Theme */}
          <div className="lg:col-span-1 bg-white border border-sage-light/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Analytics & Health
              </h3>
              <div className="flex-1 min-h-[160px] flex items-center justify-center">
                <AnalyticsChart tasks={tasks} />
              </div>
            </div>
          </div>

        </div>

        {/* PROJECT CONTROLS PANEL (30% Secondary Dark) */}
        {isLeaderOrPM && (
          <section id="project-admin-exclusive-section" className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-white shadow-md space-y-6 text-left animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[9px] bg-gold/10 text-gold font-mono font-bold px-2.5 py-1 rounded-full border border-gold/20 uppercase tracking-wider">
                  🛠️ Workspace Controls
                </span>
                <h2 className="text-base font-bold tracking-tight mt-1.5 text-slate-100">Project Management & Team Setup</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Current User:</span>
                <span className="text-xs font-bold text-gold">
                  {currentUser.name} ({currentUser.globalRole})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              {/* Bullet-pointed Todo List Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase text-gold tracking-wider">Quick Task Creator</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Add new tasks to the project. They will appear on the Kanban board instantly.
                  </p>
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => {
                      setTaskTitle(e.target.value);
                      setTaskColId(columns[0]?.id || ''); // defaults to To Do column
                    }}
                    placeholder="Type a task name and press Enter..."
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-forest text-xs px-3 py-2 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <button
                    type="submit"
                    className="bg-forest hover:bg-forest-light text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Task
                  </button>
                </form>

                {/* Bulleted list of tasks */}
                <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 max-h-[220px] overflow-y-auto space-y-3">
                  {tasks.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-slate-300 space-y-2.5">
                      {tasks.map((task) => (
                        <li key={task.id} className="leading-relaxed border-b border-slate-850/40 pb-2 last:border-0 last:pb-0">
                          <span className="font-medium text-slate-100">{task.title}</span>
                          <span className="block text-[10px] text-sage font-mono mt-0.5">
                            — created by <strong className="text-sage-light">{task.addedBy || 'Central Admin'}</strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">No tasks added yet.</p>
                  )}
                </div>
              </div>

              {/* Member Access and Enrollment Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase text-gold tracking-wider">Add Team Members</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Add colleagues to this project workspace from the team directory.
                  </p>
                </div>

                <form onSubmit={handleAddMember} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Employee ID</label>
                      <input
                        type="text"
                        required
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value.toUpperCase().trim())}
                        placeholder="e.g. DV001"
                        className="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Access Level</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 text-xs px-2 py-2 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-forest"
                      >
                        <option value="TEAM_LEADER">Project Leader (Full Access)</option>
                        <option value="TEAM_MEMBER">Team Member (Add & Edit)</option>
                        <option value="SPECTATOR">Viewer (Read-Only)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      required
                      value={newMemberJobTitle}
                      onChange={(e) => setNewMemberJobTitle(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  {memberSuccessText && (
                    <div className="p-2 bg-slate-950/70 border border-forest rounded text-[10px] text-sage font-medium">
                      {memberSuccessText}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-forest hover:bg-forest-light text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Add Member to Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* INTERACTIVE KANBAN WORKBOARD */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-forest" />
              Milestone Kanban Board
            </h2>
            {isSpectatorMode && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Spectator Mode Active · Modifications Locked
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter(t => t.columnId === col.id);
              const isColTodo = col.name === 'To Do';

              // Determine column colors dynamically for visual distinctiveness
              let colBg = "bg-slate-50/85 border-slate-200";
              let colDotBg = "bg-slate-400";
              let colText = "text-slate-700";
              let colBadge = "bg-slate-200 text-slate-700";
              if (col.name.toLowerCase().includes('todo') || col.name.toLowerCase().includes('to do')) {
                colBg = "bg-rose-50/70 border-rose-200";
                colDotBg = "bg-rose-500 animate-pulse";
                colText = "text-rose-800";
                colBadge = "bg-rose-100 text-rose-800";
              } else if (col.name.toLowerCase().includes('progress')) {
                colBg = "bg-blue-50/70 border-blue-200";
                colDotBg = "bg-blue-500 animate-pulse";
                colText = "text-blue-800";
                colBadge = "bg-blue-100 text-blue-800";
              } else if (col.name.toLowerCase().includes('review') || col.name.toLowerCase().includes('test')) {
                colBg = "bg-amber-50/70 border-amber-200";
                colDotBg = "bg-amber-500 animate-pulse";
                colText = "text-amber-800";
                colBadge = "bg-amber-100 text-amber-800";
              } else if (col.name.toLowerCase().includes('done') || col.name.toLowerCase().includes('complete')) {
                colBg = "bg-emerald-50/70 border-emerald-200";
                colDotBg = "bg-emerald-500 animate-pulse";
                colText = "text-emerald-800";
                colBadge = "bg-emerald-100 text-emerald-800";
              }

              return (
                <div key={col.id} className={`${colBg} border rounded-xl p-4 flex flex-col min-h-[340px] shadow-sm`}>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2">
                    <h3 className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${colText}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${colDotBg}`} />
                      {col.name}
                    </h3>
                    <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${colBadge}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task list container */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[420px] pb-4">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-sm hover:shadow transition-all group relative"
                      >
                        <h4 className="text-xs font-semibold text-slate-800 leading-snug pr-4">
                          {task.title}
                        </h4>
                        {task.addedBy && (
                          <div className="text-[9px] text-forest font-medium font-sans mt-1.5 flex items-center gap-1">
                            <span>👤 added by:</span>
                            <strong className="text-forest-dark">{task.addedBy}</strong>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px]">
                          {/* Assignees */}
                          <div className="flex gap-1 items-center overflow-hidden max-w-[120px]">
                            {task.assigneeIds.length > 0 ? (
                              task.assigneeIds.map(aId => {
                                const matched = memberships.find(m => m.userId === aId)?.user;
                                return (
                                  <span
                                    key={aId}
                                    className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded font-mono truncate"
                                    title={matched ? matched.name : 'Unknown'}
                                  >
                                    {matched ? matched.customId : '??'}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </div>

                          {/* Trigger state changes for non-spectators */}
                          {!isSpectatorMode ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={col.id}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-[9px] rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                              >
                                {columns.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>

                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Discard Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="dashed-border py-8 text-center text-slate-400 text-xs italic bg-white/40 rounded-lg">
                        Empty column
                      </div>
                    )}
                  </div>

                  {/* Quick Task creation button inside To Do only */}
                  {isColTodo && !isSpectatorMode && (
                    <form onSubmit={handleAddTask} className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col gap-2">
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => {
                          setTaskTitle(e.target.value);
                          setTaskColId(col.id);
                        }}
                        placeholder="+ Add task milestone..."
                        className="w-full text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-forest"
                      />

                      {taskTitle.trim() && (
                        <div className="space-y-1.5 bg-white border border-slate-200 p-2 rounded">
                          <label className="block text-[8px] uppercase font-bold text-slate-400">Assign Member</label>
                          <div className="flex flex-wrap gap-1">
                            {memberships
                              .filter(m => m.role !== 'SPECTATOR')
                              .map(m => {
                                const active = taskAssignees.includes(m.userId);
                                return (
                                  <button
                                    key={m.userId}
                                    type="button"
                                    onClick={() => {
                                      if (active) {
                                        setTaskAssignees(taskAssignees.filter(id => id !== m.userId));
                                      } else {
                                        setTaskAssignees([...taskAssignees, m.userId]);
                                      }
                                    }}
                                    className={`text-[8px] px-1.5 py-0.5 rounded border transition-all ${
                                      active 
                                        ? 'bg-forest text-white border-forest-dark font-bold' 
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {m.user.name.split(' ')[0]} ({m.user.customId})
                                  </button>
                                );
                              })
                            }
                          </div>
                          
                          <button
                            type="submit"
                            className="w-full text-[9px] bg-forest text-white font-bold py-1 rounded"
                          >
                            Commit Task Card
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM SECTION GRID: Team, Chat, and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Team Roster: Beautiful Sage border theme (Section 1/3) */}
          <div className="lg:col-span-4 bg-white border border-sage rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                <Users className="w-4 h-4 text-forest" />
                Team Roster
              </h3>

              <div className="max-h-[480px] overflow-y-auto pr-1 space-y-2">
                {memberships.map((mem) => {
                  const presenceValue = mem.presenceStatus || 'WORKING';
                  return (
                    <div key={mem.id} className="py-3 px-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 hover:border-sage transition-all shadow-2xs">
                      <div className="flex items-start justify-between text-xs group">
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                            <span className="truncate">{mem.user.name}</span>
                            <span className="text-[9px] font-mono font-medium text-slate-400 shrink-0">({mem.user.customId})</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-tight truncate mt-0.5">{mem.jobTitle}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                            mem.role === 'TEAM_LEADER' ? 'bg-gold-light/40 text-gold-dark border-gold-light font-bold' :
                            mem.role === 'TEAM_MEMBER' ? 'bg-sage-light/30 text-forest border-sage-light font-bold' :
                            'bg-amber-50 text-amber-750 border-amber-200'
                          }`}>
                            {mem.role}
                          </span>
                          {isLeaderOrPM && mem.userId !== currentUser.id && (
                            <button
                              onClick={() => handleRemoveMember(mem.userId)}
                              type="button"
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-all shrink-0 cursor-pointer"
                              title="Remove from Workspace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Presence Status Radio Block - No Leave Option */}
                      <div className="bg-white border border-slate-200 p-2 rounded-xl space-y-2 shadow-3xs text-left">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-slate-400 uppercase font-bold">Status Indicator:</span>
                          {presenceValue === 'WORKING' && (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Working
                            </span>
                          )}
                          {presenceValue === 'OFF' && (
                            <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Away
                            </span>
                          )}
                        </div>

                        {/* Interactive Standard Radio Toggles */}
                        <div className="grid grid-cols-2 gap-1">
                          <label className={`flex flex-col items-center justify-center py-1 rounded-lg border text-center transition-all cursor-pointer relative select-none ${
                            presenceValue === 'WORKING'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold'
                              : 'bg-slate-50/50 border-slate-150 hover:bg-slate-100 text-slate-500'
                          }`}>
                            <input
                              type="radio"
                              name={`presence-${mem.id}`}
                              checked={presenceValue === 'WORKING'}
                              onChange={() => handleChangePresence(mem.userId, 'WORKING')}
                              className="sr-only"
                            />
                            <span className="text-[9px] leading-none">Working</span>
                          </label>

                          <label className={`flex flex-col items-center justify-center py-1 rounded-lg border text-center transition-all cursor-pointer relative select-none ${
                            presenceValue === 'OFF'
                              ? 'bg-amber-50 border-amber-500 text-amber-800 font-extrabold'
                              : 'bg-slate-50/50 border-slate-150 hover:bg-slate-100 text-slate-500'
                          }`}>
                            <input
                              type="radio"
                              name={`presence-${mem.id}`}
                              checked={presenceValue === 'OFF'}
                              onChange={() => handleChangePresence(mem.userId, 'OFF')}
                              className="sr-only"
                            />
                            <span className="text-[9px] leading-none">Away</span>
                          </label>
                        </div>
                      </div>

                      {/* Section Accessibility Indicator & Definition */}
                      <div className="bg-slate-100/60 p-2.5 rounded-xl border border-slate-200 text-left space-y-1.5">
                        <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Project Access Tier</div>
                        
                        <div className="flex items-center justify-between text-xs font-semibold">
                          {mem.role === 'TEAM_LEADER' && (
                            <span className="text-gold-dark font-bold">👑 Leader (Full Access)</span>
                          )}
                          {mem.role === 'TEAM_MEMBER' && (
                            <span className="text-forest">⚙️ Member (Add & Edit)</span>
                          )}
                          {mem.role === 'SPECTATOR' && (
                            <span className="text-amber-650">👁️ Viewer (Read-Only)</span>
                          )}
                        </div>

                        {/* Interactive definability of role inside project workspace */}
                        {isLeaderOrPM ? (
                          <div className="mt-1">
                            <select
                              value={mem.role}
                              onChange={(e) => handleUpdateAccessibility(mem.userId, e.target.value as any)}
                              className="w-full bg-white border border-slate-300 rounded-lg text-[10px] px-1.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-forest"
                            >
                              <option value="TEAM_LEADER">Project Leader (Full Access)</option>
                              <option value="TEAM_MEMBER">Team Member (Add & Edit)</option>
                              <option value="SPECTATOR">Viewer (Read-Only)</option>
                            </select>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Roster lock information */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs text-slate-500 leading-normal">
              <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1 text-xs">
                <Lock className="w-3.5 h-3.5 text-forest" />
                Access Guideline
              </div>
              <p className="text-[10px] text-slate-400">
                Project roles and permissions are defined inside this workspace. Central configurations can be configured anytime by the project leadership.
              </p>
            </div>
          </div>

          {/* TEAM CHAT FEED: Beautiful Forest border theme (Section 2/3) */}
          <div className="lg:col-span-4 bg-white border border-forest/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[520px]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono mb-1">
                <MessageSquare className="w-4 h-4 text-forest" />
                Team Discussion
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal mb-3">
                Ask questions, share updates, and coordinate with your teammates in real-time.
              </p>
            </div>

            {/* Message Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-y-auto space-y-3.5 max-h-[330px]"
            >
              {messages.map((m) => {
                const isMyMessage = m.userId === currentUser.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5 font-medium">
                      <span>{m.userName}</span>
                      <span>·</span>
                      <span className="font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isMyMessage 
                        ? 'bg-forest text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <div className="text-center text-slate-400 text-xs italic py-16">
                  No chat messages yet. Start the conversation!
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Send section */}
            <form onSubmit={handlePostMessage} className="mt-4 flex items-center gap-2">
              {isSpectatorMode ? (
                <div className="w-full bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10px] text-amber-800 text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Viewers cannot send chat messages.</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    required
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-forest focus:bg-white focus:border-forest transition-all font-medium text-slate-800"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-forest hover:bg-forest-light text-white rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          </div>

          {/* REPORTS LOG AREA: Beautiful Gold/Cream border theme (Section 3/3) */}
          <div className="lg:col-span-4 bg-white border border-gold rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[520px]">
            <div className="overflow-y-auto space-y-3 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4 text-gold-dark" />
                  Status Reports
                </h3>

                {!isSpectatorMode && !showAddReportForm && (
                  <button
                    onClick={() => setShowAddReportForm(true)}
                    className="text-[10px] text-gold-dark hover:text-white hover:bg-forest bg-gold-light/40 border border-gold-light rounded-lg px-2 py-1 font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Report
                  </button>
                )}
              </div>

              {!showAddReportForm ? (
                <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
                  {reports.map((rep) => (
                    <div 
                      key={rep.id} 
                      onClick={() => setSelectedReport(rep)}
                      className="bg-slate-50 border border-slate-100 hover:border-gold rounded-xl p-3.5 space-y-2 cursor-pointer transition-all hover:bg-cream-light/30 group shadow-2xs text-left"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-gold-dark line-clamp-1">{rep.title}</h4>
                        
                        {rep.status === 'SENT' ? (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border border-emerald-150 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0">
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-600 shrink-0" /> SENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0">
                            <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" /> SCHEDULED
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                        {rep.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-2">
                        <span className="text-[9px] text-gold-dark font-bold group-hover:underline">View report ↗</span>
                        <div className="text-[9px] text-slate-400 font-medium flex items-center gap-1 justify-end font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(rep.scheduledDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {reports.length === 0 && (
                    <div className="text-center text-slate-400 text-xs italic py-24">
                      No status reports logged yet.
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddReport} className="space-y-2 bg-slate-50 p-4 border border-slate-150 rounded-xl text-xs text-slate-800">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                    <span className="font-bold text-slate-700">New Report Log</span>
                    <button
                      type="button"
                      onClick={() => setShowAddReportForm(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label htmlFor="reportTitleField" className="block text-[8px] uppercase font-bold text-slate-500 mb-0.5">Report Title</label>
                    <input
                      id="reportTitleField"
                      type="text"
                      required
                      placeholder="e.g. Sprint Sign-off"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="reportBriefingArea" className="block text-[8px] uppercase font-bold text-slate-500 mb-0.5">Report Description</label>
                    <textarea
                      id="reportBriefingArea"
                      required
                      rows={3}
                      placeholder="Describe current achievements..."
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 resize-none focus:ring-1 focus:ring-forest focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="reportDateField" className="block text-[8px] uppercase font-bold text-slate-500 mb-0.5">Date</label>
                      <input
                        id="reportDateField"
                        type="date"
                        required
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-forest focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="reportStatusField" className="block text-[8px] uppercase font-bold text-slate-500 mb-0.5">Status</label>
                      <select
                        id="reportStatusField"
                        value={reportStatus}
                        onChange={(e) => setReportStatus(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded px-1 py-1 focus:ring-1 focus:ring-forest focus:outline-none"
                      >
                        <option value="SENT">SENT</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-forest hover:bg-forest-light text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Log Report
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Report Detailed Briefing Overlay Dialog Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedReport.status === 'SENT' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-250 animate-pulse' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {selectedReport.status}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2 tracking-tight">{selectedReport.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full border border-slate-100 hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
              {selectedReport.content}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Log Date: {new Date(selectedReport.scheduledDate).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="bg-forest hover:bg-forest-light text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Acknowledge Milestone Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
