import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Plus, CheckCircle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  subject: string;
  startDate: string;
  endDate: string;
  dailyTasks: DailyTask[];
  status: 'active' | 'completed' | 'paused';
}

interface DailyTask {
  id: string;
  date: Date;
  topic: string;
  duration: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const StudyPlanner = () => {
  const { toast } = useToast();
  const [newPlan, setNewPlan] = useState({
    subject: "",
    topics: "",
    daysAvailable: 7,
    hoursPerDay: 2,
  });

  const { data: plans = [] } = useQuery<StudyPlan[]>({
    queryKey: ["/api/study-plans"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: typeof newPlan) => {
      return apiRequest("/api/study-plans/generate", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          topics: data.topics.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-plans"] });
      toast({
        title: "Study Plan Generated!",
        description: `Your ${data.subject} study plan is ready.`,
      });
      setNewPlan({ subject: "", topics: "", daysAvailable: 7, hoursPerDay: 2 });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activePlans = plans.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Study Planner</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary" data-testid="button-create-plan">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate AI Study Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={newPlan.subject}
                    onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                    placeholder="e.g., Advanced Calculus"
                    data-testid="input-plan-subject"
                  />
                </div>
                <div>
                  <Label>Topics (comma-separated)</Label>
                  <Textarea
                    value={newPlan.topics}
                    onChange={(e) => setNewPlan({ ...newPlan, topics: e.target.value })}
                    placeholder="e.g., Limits, Derivatives, Integrals"
                    rows={3}
                    data-testid="input-plan-topics"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Days Available</Label>
                    <Input
                      type="number"
                      value={newPlan.daysAvailable}
                      onChange={(e) => setNewPlan({ ...newPlan, daysAvailable: parseInt(e.target.value) })}
                      min={1}
                      max={30}
                      data-testid="input-plan-days"
                    />
                  </div>
                  <div>
                    <Label>Hours per Day</Label>
                    <Input
                      type="number"
                      value={newPlan.hoursPerDay}
                      onChange={(e) => setNewPlan({ ...newPlan, hoursPerDay: parseInt(e.target.value) })}
                      min={1}
                      max={8}
                      step={0.5}
                      data-testid="input-plan-hours"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => generateMutation.mutate(newPlan)}
                  disabled={!newPlan.subject || !newPlan.topics || generateMutation.isPending}
                  className="w-full bg-gradient-primary"
                  data-testid="button-generate-plan"
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Study Plan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {activePlans.length > 0 ? (
          <div className="space-y-6">
            {activePlans.map((plan) => (
              <Card key={plan.id} className="p-6 card-shadow" data-testid={`card-plan-${plan.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{plan.title}</h2>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(plan.startDate), "MMM d")} - {format(new Date(plan.endDate), "MMM d")}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {plan.subject}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.dailyTasks && plan.dailyTasks.length > 0 ? (
                    plan.dailyTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          task.priority === 'high' ? 'bg-destructive/10' :
                          task.priority === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                        }`}>
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <Clock className={`w-5 h-5 ${
                              task.priority === 'high' ? 'text-destructive' :
                              task.priority === 'medium' ? 'text-warning' : 'text-success'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{task.topic}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.duration} minutes • {format(new Date(task.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
                          task.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                          task.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      AI-generated tasks will appear here once the plan is created
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Active Plans</h3>
            <p className="text-muted-foreground mb-4">
              Create an AI-powered study plan to stay organized!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
