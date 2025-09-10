import { create } from "zustand";

export interface Employee {
  id: number;
  name: string;
  role: "calisan" | "yönetici";
  department: string;
  projects: number;
  tasks: number;
}

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  removeEmployee: (id: number) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [
    {
      id: 1,
      name: "Yusuf",
      role: "yönetici",
      department: "Veri & Analiz",
      projects: 9,
      tasks: 2,
    },
    {
      id: 2,
      name: "Eda",
      role: "calisan",
      department: "Frontend",
      projects: 3,
      tasks: 4,
    },
    {
      id: 3,
      name: "Mehmet",
      role: "calisan",
      department: "Backend",
      projects: 6,
      tasks: 4,
    },
    {
      id: 4,
      name: "Zeynep",
      role: "calisan",
      department: "Veri",
      projects: 3,
      tasks: 5,
    },
    {
      id: 5,
      name: "Kübra",
      role: "calisan",
      department: "Full Stack",
      projects: 5,
      tasks: 7,
    },
    {
      id: 6,
      name: "Mustafa",
      role: "calisan",
      department: "Full Stack",
      projects: 3,
      tasks: 9,
    },
    {
      id: 7,
      name: "Enes",
      role: "calisan",
      department: "Mobile",
      projects: 4,
      tasks: 12,
    },
  ],
  addEmployee: (employee) =>
    set((state) => ({
      employees: [...state.employees, { id: Date.now(), ...employee }],
    })),

  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
}));
