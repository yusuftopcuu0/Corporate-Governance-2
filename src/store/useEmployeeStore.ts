import { create } from "zustand";

export interface Employee {
  id: number;
  name: string;
  role: "calisan" | "yönetici";
  department: string;
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
    },
    { id: 2, name: "Eda", role: "calisan", department: "Frontend" },
    { id: 3, name: "Mehmet", role: "calisan", department: "Backend" },
    { id: 4, name: "Zeynep", role: "calisan", department: "Veri" },
    { id: 5, name: "Kübra", role: "calisan", department: "Full Stack" },
    { id: 6, name: "Mustafa", role: "calisan", department: "Full Stack" },
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
