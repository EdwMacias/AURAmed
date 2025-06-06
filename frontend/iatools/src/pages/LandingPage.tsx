import { useNavigate } from "react-router-dom";
import { activateSession } from "../services/appointmentService";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";
import { useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const activateModels = async () => {
    setIsLoading(true);

    try {
      const response = await activateSession();
      console.log(response);
      
        toast({
          title: "Disfruta de AURAmed",
          description: "Tu asistente está listo para ayudarte.",
        });
        navigate("/text");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Hubo un error.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <PageWrapper>
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Sparkles className="h-12 w-12 primary-color  mb-2" />
          <CardTitle className="text-3xl font-headline">
            Bienvenido a AURAmed
          </CardTitle>
          <CardDescription className="text-lg">
            Programe sus citas médicas sin complicaciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            Haga clic en "Empezar" para iniciar el proceso y permita que AURAmed
            haga el resto por usted.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={activateModels}
             className="w-full text-lg py-6 justify-center" size="lg" variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Empezar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
