import { create } from "zustand";

export interface Employee {
  id: number;
  name: string;
  role: "employee" | "manager";
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
      role: "manager",
      department: "Veri & Analiz",
    },
    { id: 2, name: "Eda", role: "employee", department: "Frontend" },
    { id: 3, name: "Mehmet", role: "employee", department: "Backend" },
    { id: 4, name: "Zeynep", role: "employee", department: "Veri" },
    { id: 5, name: "Kübra", role: "employee", department: "Full Stack" },
    { id: 6, name: "Mustafa", role: "employee", department: "Full Stack" },
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
