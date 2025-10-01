import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, LayoutDashboard, List } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentDetails } from "@/components/students/StudentDetails";
import { DeleteConfirmation } from "@/components/students/DeleteConfirmation";
import { SearchBar } from "@/components/students/SearchBar";
import { FilterBar } from "@/components/students/FilterBar";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentCard } from "@/components/students/StudentCard";
import { Dashboard } from "@/components/Dashboard";
import { ExportImportButtons } from "@/components/ExportImportButtons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Achievements } from "@/components/Achievements";
import { Student, StudentFormData } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { students, addStudent, updateStudent, deleteStudent, getStudent, isLoading } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "age" | "enrollmentDate">("name");
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeTab, setActiveTab] = useState<"dashboard" | "list">("dashboard");

  const availableCourses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.course))).sort();
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        selectedFilters.length === 0 ||
        selectedFilters.includes(student.status) ||
        selectedFilters.includes(student.course);

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "enrollmentDate")
        return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
      return 0;
    });

    return filtered;
  }, [students, searchQuery, selectedFilters, sortBy]);

  const handleFormSubmit = async (data: StudentFormData & { photo?: File }) => {
    try {
      if (formMode === "create") {
        await addStudent(data);
      } else if (selectedStudent) {
        await updateStudent(selectedStudent.id, data);
      }
      setFormOpen(false);
    } catch (error) {}
  };

  const handleImport = async (importedStudents: Partial<Student>[]) => {
    for (const student of importedStudents) {
      if (student.name && student.age && student.course && student.status && student.enrollmentDate) {
        await addStudent(student as StudentFormData);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sistema de Gerenciamento de Alunos
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus alunos de forma eficiente e moderna
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Achievements />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                Lista de Alunos
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <ExportImportButtons students={students} onImport={handleImport} />
              <Button onClick={() => { setSelectedStudent(null); setFormMode("create"); setFormOpen(true); }} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Aluno
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard">
            <Dashboard students={students} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                students={students}
                onSelectStudent={(s) => { setSelectedStudent(s); setDetailsOpen(true); }}
              />
              <FilterBar
                courses={availableCourses}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            <div className="hidden md:block">
              <StudentTable
                students={filteredAndSortedStudents}
                onView={(s) => { setSelectedStudent(s); setDetailsOpen(true); }}
                onEdit={(s) => { setSelectedStudent(s); setFormMode("edit"); setFormOpen(true); }}
                onDelete={(s) => { setSelectedStudent(s); setDeleteOpen(true); }}
              />
            </div>

            <div className="md:hidden grid gap-4">
              {filteredAndSortedStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onView={(s) => { setSelectedStudent(s); setDetailsOpen(true); }}
                  onEdit={(s) => { setSelectedStudent(s); setFormMode("edit"); setFormOpen(true); }}
                  onDelete={(s) => { setSelectedStudent(s); setDeleteOpen(true); }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        mode={formMode}
      />

      <StudentDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        student={selectedStudent}
        onEdit={(s) => { setSelectedStudent(s); setFormMode("edit"); setFormOpen(true); setDetailsOpen(false); }}
        onDelete={(s) => { setSelectedStudent(s); setDeleteOpen(true); setDetailsOpen(false); }}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        studentName={selectedStudent?.name || ""}
        onConfirm={async () => {
          if (selectedStudent) {
            await deleteStudent(selectedStudent.id);
            setDeleteOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Index;
