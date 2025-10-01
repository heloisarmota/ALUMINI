import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, GraduationCap, User, Hash, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/types/student";

interface StudentDetailsProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetails({ student, open, onOpenChange }: StudentDetailsProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Detalhes do Aluno
          </DialogTitle>
          <DialogDescription>
            Informações completas do cadastro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.age} anos</p>
              </div>
            </div>
            <Badge
              variant={student.status === "Ativo" ? "default" : "secondary"}
              className={
                student.status === "Ativo"
                  ? "bg-success hover:bg-success/90"
                  : "bg-muted"
              }
            >
              {student.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">ID do Aluno</p>
                <p className="text-base font-mono">{student.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Curso</p>
                <p className="text-base">{student.course}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Data de Matrícula
                </p>
                <p className="text-base">
                  {format(new Date(student.enrollmentDate), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Situação da Matrícula
                </p>
                <p className="text-base">
                  {student.status === "Ativo" ? "Matriculado e ativo" : "Matrícula inativa"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
