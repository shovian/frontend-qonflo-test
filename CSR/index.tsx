'use client';

import { useEffect, useState } from 'react';
import { AuditLog, Task, TaskStatus, UiError } from './types/types';
import {
	handleValidUpdate,
	handleDeleteTask,
	handleCreateTask,
	handleUpdate,
	handleGetTasks,
	handleGetLogs,
} from './handlers/handleCRUD';

const ALL_STATUSES: TaskStatus[] = ['to_do', 'pending', 'in_progress', 'done'];
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

const ACTOR = 'john.doe';
export default function CSR() {
	const [actor,setActor] = useState(ACTOR);
	const [activeLogTaskId, setActiveLogTaskId] = useState<string | null>(null);
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [error, setError] = useState<UiError | null>(null);
	const [newTitle, setNewTitle] = useState('');

	async function refreshTasks() {
		const data = await handleGetTasks(API_BASE);
		setTasks(data);
	}

	useEffect(() => {
		(async () => {
			await refreshTasks();
		})();
	}, []);

	return (
		<div className="flex flex-col space-y-4">
			<p>Please enter your name:</p>
			<input
				type="text"
				value={actor}
				onChange={(e) => setActor(e.target.value)}
				placeholder="Actor"
				className="border rounded p-2"
			/>
			{/* Error Banner */}
			{error && (
				<div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
					{error.message}
				</div>
			)}

			{/* Create Task */}
			<p>Create task here</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setError(null);

					if (!newTitle.trim()) return;

					handleCreateTask(API_BASE, newTitle.trim(), setError, refreshTasks);

					setNewTitle('');
				}}
				className="flex gap-2 items-center"
			>
				<input
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					placeholder="Task title"
					className="border rounded p-2"
				/>
				<button type="submit" className="bg-amber-200 px-3 py-2 rounded">
					Add
				</button>
			</form>

			{/* Task List */}
			<div>
				<h2 className="font-semibold mb-2">Tasks</h2>
				<ul className="space-y-2">
					{tasks.map((t) => (
						<li key={t.id} className="flex items-center gap-2">
							<span className="min-w-50">
								{t.title} — <strong>{t.status}</strong>
							</span>

							{/* Status Change */}
							{t.status !== 'done' && (
								<select
									defaultValue="no_action"
									onChange={(e) => {
										const value = e.currentTarget.value;
										if (value === 'no_action') return;

										setError(null);

										handleUpdate(
											actor,
											API_BASE,
											t.id,
											setError,
											refreshTasks,
											value as TaskStatus,
										);
									}}
									className="border rounded p-1"
								>
									<option value="no_action" disabled>
										Change status
									</option>

									{ALL_STATUSES.filter((status) => status !== t.status).map(
										(status) => (
											<option key={status} value={status}>
												{status.replace('_', ' ')}
											</option>
										),
									)}
								</select>
							)}

							{/* Valid Next-Step Button */}
							{t.status !== 'done' && (
								<button
									className="bg-amber-200 px-2 py-1 rounded"
									onClick={() => {
										setError(null);
										handleValidUpdate(
											actor,
											API_BASE,
											t.id,
											setError,
											refreshTasks,
										);
									}}
								>
									➡️
								</button>
							)}

							{/* Delete */}
							<button
								className="bg-amber-200 px-2 py-1 rounded"
								onClick={() => {
									setError(null);
									handleDeleteTask(API_BASE, t.id, setError, refreshTasks);
								}}
							>
								🗑
							</button>
							<button
								className="bg-amber-200 px-2 py-1 rounded"
								onClick={async () => {
									setError(null);

									const data = await handleGetLogs(API_BASE, t.id, setError);

									setActiveLogTaskId(t.id);
									setLogs(data);
								}}
							>
								Logs
							</button>
						</li>
					))}
				</ul>

				<div className="mt-4 border rounded p-3 bg-gray-50">
					<h3 className="font-semibold mb-2">Audit Log</h3>

					{activeLogTaskId ? (
						logs.length === 0 ? (
							<p className="text-sm text-gray-500">
								No status changes recorded.
							</p>
						) : (
							<ul className="space-y-1 text-sm">
								{logs.map((log) => (
									<li key={log.id}>
										<strong>{log.actor}</strong> changed status from{' '}
										<em>{log.fromStatus}</em> → <em>{log.toStatus}</em>{' '}
										<span className="text-gray-500">
											at {new Date(log.timestamp).toLocaleString()}
										</span>
									</li>
								))}
							</ul>
						)
					) : (
						<p className="text-sm text-gray-500">No logs selected yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
