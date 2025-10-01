import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({ students, onView, onEdit, onDelete }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum aluno encontrado
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tente ajustar os filtros ou adicione um novo aluno
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Aluno</TableHead>
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Idade</TableHead>
            <TableHead className="font-semibold">Curso</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Data de Matrícula</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const initials = student.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            
            return (
              <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.photo_url} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{student.id}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell className="max-w-[200px] truncate">{student.course}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {format(new Date(student.enrollmentDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(student)}
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Visualizar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(student)}
                      className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(student)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
