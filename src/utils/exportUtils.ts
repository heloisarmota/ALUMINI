import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '@/types/student';

export const exportToExcel = (students: Student[], filename = 'alunos.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(s => ({
      Nome: s.name,
      Idade: s.age,
      Curso: s.course,
      Status: s.status,
      'Data de Matrícula': s.enrollmentDate,
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');
  XLSX.writeFile(workbook, filename);
};

export const exportToCSV = (students: Student[], filename = 'alunos.csv') => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(s => ({
      Nome: s.name,
      Idade: s.age,
      Curso: s.course,
      Status: s.status,
      'Data de Matrícula': s.enrollmentDate,
    }))
  );
  
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportToPDF = (students: Student[], filename = 'alunos.pdf') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Lista de Alunos', 14, 20);
  
  autoTable(doc, {
    startY: 30,
    head: [['Nome', 'Idade', 'Curso', 'Status', 'Data de Matrícula']],
    body: students.map(s => [
      s.name,
      s.age.toString(),
      s.course,
      s.status,
      s.enrollmentDate,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [99, 102, 241] },
  });
  
  doc.save(filename);
};

export const importFromFile = async (file: File): Promise<Partial<Student>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const students = jsonData.map((row: any) => ({
          name: row.Nome || row.name || '',
          age: parseInt(row.Idade || row.age) || 0,
          course: row.Curso || row.course || '',
          status: (row.Status || row.status || 'Ativo') as 'Ativo' | 'Inativo',
          enrollmentDate: row['Data de Matrícula'] || row.enrollmentDate || new Date().toISOString().split('T')[0],
        }));
        
        resolve(students);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};
