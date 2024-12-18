import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Target className="w-8 h-8" />
            <h1 className="text-4xl font-bold">AI Goal Coach</h1>
          </div>

          <p className="text-xl text-muted-foreground">
            Your personal AI-powered goal coach that helps you set, track, and
            achieve your goals through natural conversation and personalized
            guidance.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/goals")}
              className="gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
