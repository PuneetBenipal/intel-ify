import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, RotateCcw, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  mastered: boolean;
  reviewCount: number;
}

export const Flashcards = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    subject: "",
    topic: "",
    content: "",
  });

  const { data: flashcards = [] } = useQuery<Flashcard[]>({
    queryKey: selectedSubject ? [`/api/flashcards?subject=${selectedSubject}`] : ["/api/flashcards"],
  });

  const subjects = Array.from(new Set(flashcards.map((c) => c.subject)));

  const generateMutation = useMutation({
    mutationFn: async (data: typeof newFlashcard) => {
      return apiRequest("/api/flashcards/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
      toast({
        title: "Flashcards Generated!",
        description: `${data.length} flashcards created successfully.`,
      });
      setNewFlashcard({ subject: "", topic: "", content: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; mastered: boolean; reviewCount: number }) => {
      return apiRequest(`/api/flashcards/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ mastered: data.mastered, reviewCount: data.reviewCount }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
    },
  });

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleMastered = (mastered: boolean) => {
    const currentCard = flashcards[currentCardIndex];
    if (currentCard) {
      updateMutation.mutate({
        id: currentCard.id,
        mastered,
        reviewCount: currentCard.reviewCount + 1,
      });

      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      } else {
        setCurrentCardIndex(0);
        setShowAnswer(false);
        toast({
          title: "Review Complete!",
          description: "You've reviewed all flashcards.",
        });
      }
    }
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary" data-testid="button-create-flashcards">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Cards
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate AI Flashcards</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={newFlashcard.subject}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, subject: e.target.value })}
                    placeholder="e.g., Physics"
                    data-testid="input-flashcard-subject"
                  />
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input
                    value={newFlashcard.topic}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, topic: e.target.value })}
                    placeholder="e.g., Newton's Laws"
                    data-testid="input-flashcard-topic"
                  />
                </div>
                <div>
                  <Label>Content / Notes</Label>
                  <Textarea
                    value={newFlashcard.content}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, content: e.target.value })}
                    placeholder="Paste your notes or study material..."
                    rows={5}
                    data-testid="input-flashcard-content"
                  />
                </div>
                <Button
                  onClick={() => generateMutation.mutate(newFlashcard)}
                  disabled={!newFlashcard.subject || !newFlashcard.topic || !newFlashcard.content || generateMutation.isPending}
                  className="w-full bg-gradient-primary"
                  data-testid="button-generate-flashcards"
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Flashcards"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {subjects.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={!selectedSubject ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(undefined)}
              data-testid="button-filter-all"
            >
              All Subjects
            </Button>
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                data-testid={`button-filter-${subject.toLowerCase()}`}
              >
                {subject}
              </Button>
            ))}
          </div>
        )}

        {flashcards.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {flashcards.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {flashcards.filter((c) => c.mastered).length} mastered
              </p>
            </div>

            <div 
              className="perspective-1000"
              onClick={handleCardFlip}
              data-testid="flashcard-container"
            >
              <Card className="relative h-96 cursor-pointer transition-all duration-500 hover:scale-105 card-shadow">
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                  {!showAnswer ? (
                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-primary uppercase tracking-wide">
                        {currentCard?.subject}
                      </div>
                      <h2 className="text-2xl font-bold">
                        {currentCard?.front}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-8">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-secondary uppercase tracking-wide">
                        Answer
                      </div>
                      <p className="text-lg leading-relaxed">
                        {currentCard?.back}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {showAnswer && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleMastered(false)}
                  data-testid="button-not-mastered"
                >
                  <X className="w-4 h-4 mr-2" />
                  Need Review
                </Button>
                <Button
                  className="flex-1 bg-gradient-accent"
                  onClick={() => handleMastered(true)}
                  data-testid="button-mastered"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mastered
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCurrentCardIndex(0);
                setShowAnswer(false);
              }}
              data-testid="button-restart"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Flashcards Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered flashcards from your study materials!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
