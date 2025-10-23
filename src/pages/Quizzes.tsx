import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Play, CheckCircle, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  completed: boolean;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
}

export const Quizzes = () => {
  const { toast } = useToast();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    subject: "",
    content: "",
    numberOfQuestions: 10,
  });

  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: typeof newQuiz) => {
      return apiRequest("/api/quizzes/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      toast({
        title: "Quiz Generated!",
        description: `${data.questions.length} questions created successfully.`,
      });
      setNewQuiz({ title: "", subject: "", content: "", numberOfQuestions: 10 });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Quiz> }) => {
      return apiRequest(`/api/quizzes/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (activeQuiz && selectedAnswer !== null) {
      const updatedQuestions = [...activeQuiz.questions];
      updatedQuestions[currentQuestionIndex].userAnswer = selectedAnswer;

      if (currentQuestionIndex < activeQuiz.questions.length - 1) {
        setActiveQuiz({ ...activeQuiz, questions: updatedQuestions });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz complete
        const score = updatedQuestions.filter(
          (q) => q.userAnswer === q.correctAnswer
        ).length;
        const percentage = Math.round((score / updatedQuestions.length) * 100);

        updateQuizMutation.mutate({
          id: activeQuiz.id,
          updates: {
            completed: true,
            score: percentage,
            questions: updatedQuestions,
          },
        });

        setActiveQuiz({ ...activeQuiz, questions: updatedQuestions, score: percentage });
        setShowResults(true);
      }
    }
  };

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary" data-testid="button-create-quiz">
                <Plus className="w-4 h-4 mr-2" />
                Generate Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate AI Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Quiz Title</Label>
                  <Input
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="e.g., Calculus Chapter 3 Review"
                    data-testid="input-quiz-title"
                  />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={newQuiz.subject}
                    onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    data-testid="input-quiz-subject"
                  />
                </div>
                <div>
                  <Label>Content / Topics (Optional)</Label>
                  <Textarea
                    value={newQuiz.content}
                    onChange={(e) => setNewQuiz({ ...newQuiz, content: e.target.value })}
                    placeholder="Paste notes or describe topics to cover..."
                    rows={4}
                    data-testid="input-quiz-content"
                  />
                </div>
                <div>
                  <Label>Number of Questions</Label>
                  <Input
                    type="number"
                    value={newQuiz.numberOfQuestions}
                    onChange={(e) => setNewQuiz({ ...newQuiz, numberOfQuestions: parseInt(e.target.value) })}
                    min={5}
                    max={20}
                    data-testid="input-quiz-questions"
                  />
                </div>
                <Button
                  onClick={() => generateMutation.mutate(newQuiz)}
                  disabled={!newQuiz.title || !newQuiz.subject || generateMutation.isPending}
                  className="w-full bg-gradient-primary"
                  data-testid="button-generate-quiz"
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Quiz"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {activeQuiz && !showResults ? (
          <Card className="p-6 card-shadow">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">{activeQuiz.title}</h2>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
              </div>
              <Progress
                value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}
                className="h-2"
              />
            </div>

            {currentQuestion && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedAnswer === index
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`button-option-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index ? "border-primary bg-primary text-white" : "border-muted"
                          }`}
                        >
                          {selectedAnswer === index && "✓"}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveQuiz(null)}
                    data-testid="button-exit-quiz"
                  >
                    Exit Quiz
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="flex-1 bg-gradient-primary"
                    data-testid="button-next-question"
                  >
                    {currentQuestionIndex < activeQuiz.questions.length - 1 ? "Next" : "Finish"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ) : activeQuiz && showResults ? (
          <Card className="p-8 text-center card-shadow">
            <div className="mb-6">
              <Award className="w-20 h-20 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-5xl font-bold text-gradient mb-2">{activeQuiz.score}%</p>
              <p className="text-muted-foreground">
                {activeQuiz.questions.filter((q) => q.userAnswer === q.correctAnswer).length} out of{" "}
                {activeQuiz.questions.length} correct
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {activeQuiz.questions.map((question, qIdx) => (
                <Card key={qIdx} className="p-4 text-left">
                  <div className="flex items-start gap-3">
                    {question.userAnswer === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-success mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Your answer: {question.options[question.userAnswer || 0]}
                      </p>
                      {question.userAnswer !== question.correctAnswer && (
                        <p className="text-sm text-success">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-2">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button onClick={() => setActiveQuiz(null)} className="bg-gradient-primary">
              Back to Quizzes
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6 hover:shadow-lg transition-all card-shadow" data-testid={`card-quiz-${quiz.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{quiz.subject}</p>
                  </div>
                  {quiz.completed && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">{quiz.score}%</div>
                      <CheckCircle className="w-4 h-4 text-success inline-block" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{quiz.questions.length} questions</span>
                  {quiz.completed && <span className="text-success font-medium">Completed</span>}
                </div>

                <Button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full bg-gradient-primary"
                  data-testid={`button-start-quiz-${quiz.id}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                </Button>
              </Card>
            ))}

            {quizzes.length === 0 && (
              <Card className="p-12 text-center col-span-2">
                <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Quizzes Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first AI-powered quiz to get started!
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
