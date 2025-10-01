export interface Student {
  id: string;
  name: string;
  age: number;
  course: string;
  status: "Ativo" | "Inativo";
  enrollmentDate: string;
}

export type StudentFormData = Omit<Student, "id">;
