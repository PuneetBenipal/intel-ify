import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <img 
          src={heroImage} 
          alt="AI Study Platform" 
          className="w-full h-[400px] object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
              Ultimate AI Study Tool
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-8">
              Transform your learning with AI-powered study plans, quizzes, and personalized tutoring
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Supercharge Your Learning
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Study Plans</h3>
              <p className="text-muted-foreground">
                Personalized learning schedules that adapt to your progress and goals
              </p>
            </Card>

            <Card className="p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Quizzes</h3>
              <p className="text-muted-foreground">
                AI-generated quizzes and flashcards from your study materials
              </p>
            </Card>

            <Card className="p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Content Upload</h3>
              <p className="text-muted-foreground">
                Upload PDFs, images, and notes for instant AI summarization
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li>✓ 5 AI queries/day</li>
                <li>✓ Basic study plans</li>
                <li>✓ 10 flashcards</li>
              </ul>
              <Button variant="outline" className="w-full">Start Free</Button>
            </Card>

            <Card className="p-6 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-primary text-xs px-3 py-1 rounded-full text-primary-foreground">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li>✓ Unlimited AI queries</li>
                <li>✓ Advanced study plans</li>
                <li>✓ Unlimited flashcards</li>
                <li>✓ Progress analytics</li>
              </ul>
              <Button className="w-full bg-gradient-primary">Upgrade Now</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-2">School</h3>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="space-y-2 mb-6 text-sm">
                <li>✓ All Premium features</li>
                <li>✓ Bulk licensing</li>
                <li>✓ Admin dashboard</li>
                <li>✓ Priority support</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
