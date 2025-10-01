import { useState, useEffect } from "react";
import { Student, StudentFormData } from "@/types/student";

const STORAGE_KEY = "students-data";

const defaultStudents: Student[] = [
  {
    id: "1",
    name: "Ana Silva Santos",
    age: 20,
    course: "Engenharia de Software",
    status: "Ativo",
    enrollmentDate: "2024-03-15",
  },
  {
    id: "2",
    name: "Bruno Costa Lima",
    age: 22,
    course: "Ciência da Computação",
    status: "Ativo",
    enrollmentDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Carla Oliveira",
    age: 19,
    course: "Sistemas de Informação",
    status: "Inativo",
    enrollmentDate: "2023-08-20",
  },
  {
    id: "4",
    name: "Daniel Ferreira",
    age: 21,
    course: "Engenharia de Software",
    status: "Ativo",
    enrollmentDate: "2024-01-05",
  },
  {
    id: "5",
    name: "Elena Rodrigues",
    age: 23,
    course: "Análise e Desenvolvimento",
    status: "Ativo",
    enrollmentDate: "2023-09-12",
  },
];

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultStudents;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (data: StudentFormData) => {
    const newStudent: Student = {
      ...data,
      id: Date.now().toString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, data: StudentFormData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...data, id } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const getStudent = (id: string) => {
    return students.find((student) => student.id === id);
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
  };
};
