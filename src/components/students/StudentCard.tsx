import { format } from "date-fns";
import { Calendar, GraduationCap, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/types/student";

interface StudentCardProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentCard({ student, onView, onEdit, onDelete }: StudentCardProps) {
  return (
    <Card className="hover:shadow-medium transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{student.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {student.id}</p>
          </div>
          <Badge
            variant={student.status === "Ativo" ? "default" : "secondary"}
            className={
              student.status === "Ativo"
                ? "bg-success hover:bg-success/90 shrink-0"
                : "bg-muted shrink-0"
            }
          >
            {student.status}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{student.course}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{format(new Date(student.enrollmentDate), "dd/MM/yyyy")}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{student.age} anos</span>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(student)}
          className="flex-1 gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(student)}
          className="flex-1 gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(student)}
          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
