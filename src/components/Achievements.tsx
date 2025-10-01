import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

export const Achievements = () => {
  const { data: achievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
  });

  if (achievements.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Conquistas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <Badge
              key={achievement.id}
              variant="secondary"
              className="text-sm py-2 px-3 animate-scale-in"
            >
              <span className="mr-2">{achievement.icon}</span>
              {achievement.title}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
