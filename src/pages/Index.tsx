import { useState, useMemo } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStudents } from "@/hooks/useStudents";
import { Student, StudentFormData } from "@/types/student";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentDetails } from "@/components/students/StudentDetails";
import { DeleteConfirmation } from "@/components/students/DeleteConfirmation";
import { SearchBar } from "@/components/students/SearchBar";
import { FilterBar } from "@/components/students/FilterBar";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentCard } from "@/components/students/StudentCard";

const Index = () => {
  const { toast } = useToast();
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const availableCourses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.course))).sort();
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      const matchesCourse = courseFilter === "all" || student.course === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "age":
          return a.age - b.age;
        case "age-desc":
          return b.age - a.age;
        case "date":
          return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
        case "date-desc":
          return new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchQuery, statusFilter, courseFilter, sortBy]);

  const handleAddStudent = () => {
    setFormMode("create");
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setFormMode("edit");
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: StudentFormData) => {
    if (formMode === "create") {
      addStudent(data);
      toast({
        title: "Aluno adicionado com sucesso!",
        description: `${data.name} foi cadastrado no sistema.`,
      });
    } else if (selectedStudent) {
      updateStudent(selectedStudent.id, data);
      toast({
        title: "Aluno atualizado com sucesso!",
        description: `As informações de ${data.name} foram atualizadas.`,
      });
    }
    setFormOpen(false);
    setSelectedStudent(null);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      toast({
        title: "Aluno excluído",
        description: `${selectedStudent.name} foi removido do sistema.`,
        variant: "destructive",
      });
      setDeleteOpen(false);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Gestão</h1>
                <p className="text-sm text-muted-foreground">
                  {students.length} {students.length === 1 ? "aluno" : "alunos"} cadastrados
                </p>
              </div>
            </div>
            <Button onClick={handleAddStudent} size="lg" className="gap-2 shadow-medium">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Adicionar Aluno</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              courseFilter={courseFilter}
              onCourseFilterChange={setCourseFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              courses={availableCourses}
            />
          </div>

          <div className="hidden md:block">
            <StudentTable
              students={filteredAndSortedStudents}
              onView={handleViewStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredAndSortedStudents.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum aluno encontrado
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tente ajustar os filtros ou adicione um novo aluno
                </p>
              </div>
            ) : (
              filteredAndSortedStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onView={handleViewStudent}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        mode={formMode}
      />

      <StudentDetails
        student={selectedStudent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <DeleteConfirmation
        student={selectedStudent}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
