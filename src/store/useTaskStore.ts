import { create } from "zustand";

export interface Task {
  id: number;
  title: string;
  assignedTo: string; // çalışanın adı
  status: "bekliyor" | "devam ediyor" | "tamamlandı";
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, status: Task["status"]) => void;
  removeTask: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    {
      id: 1,
      title: "Rapor Hazırlama",
      assignedTo: "Ayşe Demir",
      status: "bekliyor",
    },
    {
      id: 2,
      title: "Toplantı Planlama",
      assignedTo: "Mehmet Kaya",
      status: "devam ediyor",
    },
    {
      id: 3,
      title: "Sunum Hazırlama",
      assignedTo: "Ahmet Yılmaz",
      status: "tamamlandı",
    },
  ],
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { id: Date.now(), ...task }],
    })),
  updateTask: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
