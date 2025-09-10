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
    {
      id: 4,
      title: "Proje Planlama",
      assignedTo: "Zeynep Şahin",
      status: "bekliyor",
    },
    {
      id: 5,
      title: "Teknik Geliştirme",
      assignedTo: "Ayşe Demir",
      status: "devam ediyor",
    },
    {
      id: 6,
      title: "Sistem Yedekleme",
      assignedTo: "Mehmet Kaya",
      status: "tamamlandı",
    },
    {
      id: 7,
      title: "Kurumsal Web Sitesi",
      assignedTo: "Ahmet Yılmaz",
      status: "bekliyor",
    },
    {
      id: 8,
      title: "Kurumsal Raporlama",
      assignedTo: "Zeynep Şahin",
      status: "devam ediyor",
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
