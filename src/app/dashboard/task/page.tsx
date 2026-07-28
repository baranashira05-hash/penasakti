"use client";

import { ClipboardList, Plus, Clock, User, CheckCircle, Circle, AlertCircle } from "lucide-react";

const TASKS = [
  { id: "1", title: "Liputan Peluncuran Satelit Nusantara-3", assignee: "Ahmad Fauzi", deadline: "29 Jul 2026", priority: "HIGH", status: "IN_PROGRESS" },
  { id: "2", title: "Wawancara Menteri Keuangan", assignee: "Siti Rahayu", deadline: "30 Jul 2026", priority: "HIGH", status: "TODO" },
  { id: "3", title: "Review artikel investor Apple", assignee: "Editor Desk", deadline: "28 Jul 2026", priority: "MEDIUM", status: "IN_PROGRESS" },
  { id: "4", title: "Foto dokumentasi event startup", assignee: "Eko Prabowo", deadline: "31 Jul 2026", priority: "LOW", status: "TODO" },
  { id: "5", title: "Update infografis APBN 2026", assignee: "Design Team", deadline: "28 Jul 2026", priority: "MEDIUM", status: "DONE" },
  { id: "6", title: "Investigasi korupsi dana desa", assignee: "Tim Investigasi", deadline: "5 Aug 2026", priority: "HIGH", status: "IN_PROGRESS" },
];

const PRIORITY_MAP: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STATUS_MAP: Record<string, { label: string; icon: typeof Circle; cls: string }> = {
  TODO: { label: "To Do", icon: Circle, cls: "text-gray-400" },
  IN_PROGRESS: { label: "In Progress", icon: Clock, cls: "text-blue-500" },
  DONE: { label: "Selesai", icon: CheckCircle, cls: "text-emerald-500" },
};

export default function TaskPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" /> Task Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola tugas dan assignment wartawan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Buat Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "To Do", count: 2, color: "gray" },
          { label: "In Progress", count: 3, color: "blue" },
          { label: "Done", count: 1, color: "emerald" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.count}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {TASKS.map(task => {
          const statusConf = STATUS_MAP[task.status];
          const StatusIcon = statusConf.icon;
          return (
            <div key={task.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${statusConf.cls}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1"><User className="w-3 h-3" />{task.assignee}</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{task.deadline}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${PRIORITY_MAP[task.priority]}`}>{task.priority}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
