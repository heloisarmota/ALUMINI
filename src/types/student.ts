export interface Student {
  id: string;
  user_id?: string;
  name: string;
  age: number;
  course: string;
  status: "Ativo" | "Inativo";
  enrollmentDate: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type StudentFormData = Omit<Student, "id" | "user_id" | "created_at" | "updated_at">;
