// CSR/handlers/handleCRUD.ts

import { AuditLog, Task, TaskStatus, UiError } from '../types/types';
import { mapHttpError } from '../utils/errorMapper';

export async function handleGetLogs(
	API_BASE: string,
	taskId: string,
	setError: (e: UiError | null) => void
): Promise<AuditLog[]> {
	const res = await fetch(`${API_BASE}/tasks/${taskId}/audit-logs`);

	if (!res.ok) {
		const body = await res.json().catch(() => undefined);
		setError(mapHttpError(res, body));
		return [];
	}

	return res.json();
}

export async function handleCreateTask(
	API_BASE: string,
	title: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
) {
	setError(null);

	const res = await fetch(`${API_BASE}/tasks`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title: title}),
	});

	if (!res.ok) {
		const body = await res.json().catch(() => undefined);
		setError(mapHttpError(res, body));
		return;
	}

	await res.json(); // Consume response
	await refreshTasks();
}
export async function handleCreateTestTask(
	API_BASE: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
) {
	handleCreateTask(
		API_BASE,
		'New Task',
		setError,
		refreshTasks,
	);
}
export async function handleGetTasks(API_BASE: string): Promise<Task[]> {
	const res = await fetch(`${API_BASE}/tasks`);
	const data = await res.json();
	return data;
}
export async function handleUpdate(
	ACTOR:string,
	API_BASE: string,
	activeTaskId: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
	manualNextStatus?: TaskStatus,
) {
	const tasks: Task[] = await handleGetTasks(API_BASE);
	const task = tasks.find((t) => t.id === activeTaskId);
	if (!task) return;

	const NEXT: Record<TaskStatus, TaskStatus | null> = {
		to_do: 'pending',
		pending: 'in_progress',
		in_progress: 'done',
		done: null,
	};

	const nextStatus = manualNextStatus || NEXT[task.status];
	if (!nextStatus) return;

	const res = await fetch(`${API_BASE}/tasks/${task.id}/status`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			status: nextStatus,
			actor: ACTOR,
		}),
	});

	if (!res.ok) {
		const body = await res.json().catch(() => undefined);
		setError(mapHttpError(res, body));
		return;
	}

	await refreshTasks();
}
export async function handleValidUpdate(
	ACTOR:string,
	API_BASE: string,
	activeTaskId: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
) {
	await handleUpdate(ACTOR,API_BASE, activeTaskId, setError, refreshTasks);
}
export async function handleInvalidUpdate(
	ACTOR:string,
	API_BASE: string,
	activeTaskId: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
) {
	await handleUpdate(ACTOR,API_BASE, activeTaskId, setError, refreshTasks, "done");
}
export async function handleDeleteTask(
	API_BASE: string,
	activeTaskId: string,
	setError: (e: UiError | null) => void,
	refreshTasks: () => Promise<void>,
) {
	const res = await fetch(`${API_BASE}/tasks/${activeTaskId}`, {
		method: 'DELETE',
	});

	if (!res.ok) {
		const body = await res.json().catch(() => undefined);
		setError(mapHttpError(res, body));
		return;
	}

	await refreshTasks();
}
