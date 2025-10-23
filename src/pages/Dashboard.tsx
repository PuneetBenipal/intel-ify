import { Brain, BookOpen, Trophy, TrendingUp, Target, Zap, ArrowRight, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Dashboard = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden bg-gradient-primary py-16 px-6 rounded-3xl mx-4 mt-6 mb-6 card-shadow">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl -ml-24 -mb-24" />
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">
              Welcome back, Alex!
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-6 animate-fade-in">
              You're on a 7-day streak 🔥
            </p>
            <Button 
              size="lg" 
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30"
              data-testid="button-start-learning"
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-6">
          <StatCard
            title="Study Hours"
            value="24.5"
            icon={BookOpen}
            trend="+12%"
            color="primary"
          />
          <StatCard
            title="Quizzes Completed"
            value="156"
            icon={Target}
            trend="+8%"
            color="secondary"
          />
          <StatCard
            title="Mastery Score"
            value="87%"
            icon={Trophy}
            trend="+5%"
            color="success"
          />
          <StatCard
            title="Current Streak"
            value="7"
            icon={Zap}
            color="warning"
          />
        </section>

        <section className="px-4 mb-6">
          <Card className="p-6 card-shadow border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Today's Progress</h3>
              <span className="text-sm text-muted-foreground font-medium" data-testid="text-tasks-count">
                3 of 5 tasks
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center py-4">
                <ProgressRing progress={68} size={160} strokeWidth={12} />
                <p className="mt-4 text-sm text-muted-foreground font-medium">Overall Completion</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { subject: "Mathematics", progress: 85, color: "hsl(var(--chart-1))" },
                  { subject: "Physics", progress: 60, color: "hsl(var(--chart-2))" },
                  { subject: "Chemistry", progress: 45, color: "hsl(var(--chart-3))" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{item.subject}</span>
                      <span className="text-sm text-muted-foreground font-medium">{item.progress}%</span>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${item.progress}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                          boxShadow: `0 0 10px ${item.color}88`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Upcoming Tasks</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {[
              { subject: "Mathematics", topic: "Calculus Review", time: "10:00 AM", priority: "high", icon: BookOpen },
              { subject: "Physics", topic: "Newton's Laws", time: "2:00 PM", priority: "medium", icon: Target },
              { subject: "Chemistry", topic: "Organic Compounds", time: "4:30 PM", priority: "low", icon: Trophy },
            ].map((task, idx) => (
              <Card 
                key={idx} 
                className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 card-shadow border-border/50 group"
                data-testid={`card-task-${idx}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    task.priority === "high" ? "bg-destructive/10" :
                    task.priority === "medium" ? "bg-warning/10" : "bg-success/10"
                  }`}>
                    <task.icon className={`w-5 h-5 ${
                      task.priority === "high" ? "text-destructive" :
                      task.priority === "medium" ? "text-warning" : "text-success"
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {task.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.topic}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium mb-1">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {task.time}
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                        task.priority === "high"
                          ? "bg-destructive/10 text-destructive"
                          : task.priority === "medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 mb-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Brain, label: "AI Study Plan", color: "primary", gradient: "bg-gradient-primary" },
              { icon: Target, label: "Take Quiz", color: "secondary", gradient: "bg-gradient-accent" },
              { icon: BookOpen, label: "Flashcards", color: "success", gradient: "bg-gradient-accent" },
              { icon: TrendingUp, label: "View Progress", color: "warning", gradient: "bg-gradient-secondary" }
            ].map((action, idx) => (
              <Button 
                key={idx}
                variant="outline" 
                className="h-28 flex-col gap-3 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                data-testid={`button-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`p-3 rounded-2xl ${action.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
