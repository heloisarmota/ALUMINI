import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Pencil, Trash2, GraduationCap, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface StudentCardProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentCard({ student, onView, onEdit, onDelete }: StudentCardProps) {
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.photo_url} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{student.age} anos</span>
                </div>
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

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Curso:</span>
              <span className="font-medium">{student.course}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Matrícula:</span>
              <span className="font-medium">
                {format(new Date(student.enrollmentDate), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(student)}
          className="flex-1 gap-2 hover:bg-primary/10"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(student)}
          className="flex-1 gap-2 hover:bg-accent/10"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(student)}
          className="gap-2 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
