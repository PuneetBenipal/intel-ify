import { Brain, BookOpen, Trophy, TrendingUp, Target, Zap } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Dashboard = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-12 px-4 rounded-3xl mx-4 mt-4 mb-6">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, Alex!</h2>
          <p className="text-lg text-primary-foreground/90 mb-6">
            You're on a 7-day streak 🔥
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Brain className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
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

      {/* Progress Overview */}
      <section className="px-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Today's Progress</h3>
            <span className="text-sm text-muted-foreground">3 of 5 tasks</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <ProgressRing progress={68} size={140} />
              <p className="mt-4 text-sm text-muted-foreground">Overall Completion</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Physics</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Chemistry</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Upcoming Tasks */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Upcoming Tasks</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            { subject: "Mathematics", topic: "Calculus Review", time: "10:00 AM", priority: "high" },
            { subject: "Physics", topic: "Newton's Laws", time: "2:00 PM", priority: "medium" },
            { subject: "Chemistry", topic: "Organic Compounds", time: "4:30 PM", priority: "low" },
          ].map((task, idx) => (
            <Card key={idx} className="p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold mb-1">{task.subject}</p>
                  <p className="text-sm text-muted-foreground">{task.topic}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium mb-1">{task.time}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
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

      {/* Quick Actions */}
      <section className="px-4 mb-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span>AI Study Plan</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Target className="w-8 h-8 text-secondary" />
            <span>Take Quiz</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <BookOpen className="w-8 h-8 text-success" />
            <span>Flashcards</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <TrendingUp className="w-8 h-8 text-warning" />
            <span>View Progress</span>
          </Button>
        </div>
      </section>
    </div>
  );
};
