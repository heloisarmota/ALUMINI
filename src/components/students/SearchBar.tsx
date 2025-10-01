import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Student } from "@/types/student";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  students: Student[];
  onSelectStudent?: (student: Student) => void;
}

export function SearchBar({ value, onChange, students, onSelectStudent }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(value.toLowerCase()) ||
          student.course.toLowerCase().includes(value.toLowerCase()) ||
          student.id.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredStudents(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, students]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        placeholder="Buscar por nome, curso ou ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="pl-10 bg-background border-border focus:border-primary transition-colors"
      />
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
              <CommandGroup>
                {filteredStudents.map((student) => (
                  <CommandItem
                    key={student.id}
                    onSelect={() => {
                      onChange(student.name);
                      if (onSelectStudent) onSelectStudent(student);
                      setShowSuggestions(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-sm text-muted-foreground">{student.course}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
