import { useNavigate } from "react-router-dom";
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

  setTimeout(() => {
    toast({
      title: "Disfruta de AURAmed",
      description: "Tu asistente está listo para ayudarte.",
    });

    navigate("/text");
    setIsLoading(false);
  }, 1500);
};
  return (
    <PageWrapper>
     <div className="pointer-events-none bg-[#50bfff60] absolute inset-0 z-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://img.freepik.com/free-vector/green-medical-patterned-background-vector_53876-169038.jpg')] before:bg-repeat opacity-60"></div>

  <Card className="relative z-10 shadow-xl">
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
