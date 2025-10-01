import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet, FileText } from "lucide-react";
import { Student } from "@/types/student";
import { exportToExcel, exportToCSV, exportToPDF, importFromFile } from "@/utils/exportUtils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";

interface ExportImportButtonsProps {
  students: Student[];
  onImport: (students: Partial<Student>[]) => void;
}

export const ExportImportButtons = ({ students, onImport }: ExportImportButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    try {
      if (format === 'excel') exportToExcel(students);
      if (format === 'csv') exportToCSV(students);
      if (format === 'pdf') exportToPDF(students);
      
      toast({
        title: "Exportado com sucesso!",
        description: `Arquivo ${format.toUpperCase()} gerado.`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedStudents = await importFromFile(file);
      onImport(importedStudents);
      
      toast({
        title: "Importado com sucesso!",
        description: `${importedStudents.length} alunos foram importados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível ler o arquivo.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileText className="mr-2 h-4 w-4" />
            CSV (.csv)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF (.pdf)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
