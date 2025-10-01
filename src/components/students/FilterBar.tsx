import { Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  courseFilter: string;
  onCourseFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  courses: string[];
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  courseFilter,
  onCourseFilterChange,
  sortBy,
  onSortByChange,
  courses,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Status
            {statusFilter !== "all" && (
              <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                1
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={onStatusFilterChange}>
            <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Ativo">Ativo</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Inativo">Inativo</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Curso
            {courseFilter !== "all" && (
              <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                1
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filtrar por Curso</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={courseFilter} onValueChange={onCourseFilterChange}>
            <DropdownMenuRadioItem value="all">Todos os cursos</DropdownMenuRadioItem>
            {courses.map((course) => (
              <DropdownMenuRadioItem key={course} value={course}>
                {course}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Ordenar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortByChange}>
            <DropdownMenuRadioItem value="name">Nome (A-Z)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-desc">Nome (Z-A)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="age">Idade (menor)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="age-desc">Idade (maior)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">Data (mais recente)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date-desc">Data (mais antiga)</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
