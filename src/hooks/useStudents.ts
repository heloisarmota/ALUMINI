import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Student, StudentFormData } from "@/types/student";
import { toast } from "@/hooks/use-toast";

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(student => ({
        ...student,
        enrollmentDate: student.enrollment_date,
        photo_url: student.photo_url,
      })) as Student[];
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData & { photo?: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let photo_url = null;

      if (data.photo) {
        const fileExt = data.photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('student-photos')
          .upload(fileName, data.photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('student-photos')
          .getPublicUrl(fileName);

        photo_url = urlData.publicUrl;
      }

      const { data: newStudent, error } = await supabase
        .from("students")
        .insert({
          user_id: user.id,
          name: data.name,
          age: data.age,
          course: data.course,
          status: data.status,
          enrollment_date: data.enrollmentDate,
          photo_url,
        })
        .select()
        .single();

      if (error) throw error;

      // Check for achievements
      await checkAchievements(user.id);

      return newStudent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast({
        title: "Aluno adicionado!",
        description: "O aluno foi cadastrado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentFormData & { photo?: File } }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let photo_url = data.photo_url;

      if (data.photo) {
        const fileExt = data.photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('student-photos')
          .upload(fileName, data.photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('student-photos')
          .getPublicUrl(fileName);

        photo_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("students")
        .update({
          name: data.name,
          age: data.age,
          course: data.course,
          status: data.status,
          enrollment_date: data.enrollmentDate,
          photo_url,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Aluno atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Aluno removido!",
        description: "O aluno foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir aluno",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addStudent = (data: StudentFormData & { photo?: File }) => {
    return addStudentMutation.mutateAsync(data);
  };

  const updateStudent = (id: string, data: StudentFormData & { photo?: File }) => {
    return updateStudentMutation.mutateAsync({ id, data });
  };

  const deleteStudent = (id: string) => {
    return deleteStudentMutation.mutateAsync(id);
  };

  const getStudent = (id: string) => {
    return students.find((student) => student.id === id);
  };

  return {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
  };
};

async function checkAchievements(userId: string) {
  const { data: students } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", userId);

  const count = students?.length || 0;

  const achievements = [];
  if (count >= 1) achievements.push({ type: "first_student", title: "Primeiro Aluno!", description: "Você cadastrou seu primeiro aluno", icon: "🎉" });
  if (count >= 10) achievements.push({ type: "ten_students", title: "10 Alunos!", description: "Você já tem 10 alunos cadastrados", icon: "🏆" });
  if (count >= 50) achievements.push({ type: "fifty_students", title: "50 Alunos!", description: "Meio século de alunos!", icon: "🌟" });
  if (count >= 100) achievements.push({ type: "hundred_students", title: "100 Alunos!", description: "Você alcançou 100 alunos cadastrados!", icon: "💯" });

  for (const achievement of achievements) {
    await supabase
      .from("achievements")
      .upsert({
        user_id: userId,
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
      }, { onConflict: "user_id,type" });
  }
}
