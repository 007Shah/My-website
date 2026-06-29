export type GlobalRole = string;
export type MemberRole = 'TEAM_LEADER' | 'TEAM_MEMBER' | 'SPECTATOR';
export type ReportStatus = 'SENT' | 'SCHEDULED';
export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface User {
  id: string;
  customId: string; // 5-character limit/index
  name: string;
  globalRole: GlobalRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string; // ISO string or MM/DD/YYYY representation
}

export interface ProjectMembership {
  id: string;
  userId: string;
  projectId: string;
  role: MemberRole;
  jobTitle: string;
  presenceStatus?: 'WORKING' | 'OFF';
}

export interface Column {
  id: string;
  name: string;
  position: number;
  projectId: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  status: ReportStatus;
  scheduledDate: string; // DateTime
  projectId: string;
}

export interface Task {
  id: string;
  title: string;
  columnId: string;
  assigneeIds: string[]; // references User.id
  status: TaskStatus;
  projectId: string;
  addedBy?: string; // tracks creator name
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  projectId: string;
  userId: string;
  userName: string;
}

export interface AdminAccount {
  id: string;
  adminId: string;
  password: string;
  linkedUserId: string;
}

export interface SystemCommand {
  id: string;
  commandText: string;
  timestamp: string;
  createdBy: string;
}

// Full hydrated project info for UI
export interface CompleteProjectWorkspace {
  project: Project;
  memberships: (ProjectMembership & { user: User })[];
  columns: Column[];
  tasks: Task[];
  reports: Report[];
  messages: Message[];
}
