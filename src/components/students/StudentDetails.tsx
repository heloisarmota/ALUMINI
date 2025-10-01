import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Calendar, GraduationCap, User } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface StudentDetailsProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentDetails({
  student,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: StudentDetailsProps) {
  if (!student) return null;

  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Detalhes do Aluno
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={student.photo_url} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{student.name}</h3>
              <Badge variant={student.status === "Ativo" ? "default" : "secondary"}>
                {student.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{student.age} anos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">{student.course}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Matrícula</p>
                <p className="font-medium">
                  {format(new Date(student.enrollmentDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              onClick={() => {
                onEdit(student);
                onOpenChange(false);
              }}
              className="flex-1 gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(student);
                onOpenChange(false);
              }}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
