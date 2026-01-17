// CSR/types/task.ts

export type TaskStatus = 'to_do' | 'pending' | 'in_progress' | 'done';

export type Task = {
	id: string;
	title: string;
	status: TaskStatus;
};
export type UiError =
  | { type: "validation"; message: string }
  | { type: "not_found"; message: string }
  | { type: "network"; message: string }
  | { type: "unknown"; message: string };


export type AuditLog = {
	id: string;
	taskId: string;
	actor: string;
	fromStatus: TaskStatus;
	toStatus: TaskStatus;
	timestamp: string;
};

