import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Mic, MessageSquareText, ImageIcon } from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";

export default function AppointmentOptionsPage() {
  return (
    <PageWrapper>
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl font-headline">Elija como desea interactuar con AURAMed</CardTitle>
          <CardDescription className="text-lg">
            ¿Cómo le gustaría agendar su cita?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button  className="w-full text-lg py-6 justify-start" size="lg" variant="outline">
            <Link to="/voice">
              <span className="flex items-center">
                <Mic className="mr-3 h-6 w-6 primary-color" />
                AURAMed Voice
              </span>
            </Link>
          </Button>
          <Button  className="w-full text-lg py-6 justify-start" size="lg" variant="outline">
            <Link to="/text">
              <span className="flex items-center">
                <MessageSquareText className="mr-3 h-6 w-6 primary-color" />
                AURAMed Text
              </span>
            </Link>
          </Button>
          <Button  className="w-full text-lg py-6 justify-start" size="lg" variant="outline">
            <Link to="/images">
              <span className="flex items-center">
                <ImageIcon className="mr-3 h-6 w-6 primary-color" />
                AURAMed Pics
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
