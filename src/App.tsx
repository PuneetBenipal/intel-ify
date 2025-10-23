import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import { AITutor } from "./pages/AITutor";
import { Quizzes } from "./pages/Quizzes";
import { Flashcards } from "./pages/Flashcards";
import { StudyPlanner } from "./pages/StudyPlanner";
import NotFound from "./pages/NotFound";
import { queryClient } from "./lib/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark min-h-screen bg-background">
          <TopNav />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study" element={<Index />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/progress" element={<Dashboard />} />
            <Route path="/profile" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
