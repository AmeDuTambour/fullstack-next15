import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const ContactRequestSuccess = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="w-fit">
        <CardContent className="flex flex-col items-center justify-center p-6 shadow-lg rounded-2xl text-center">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-xl font-semibol">Message envoyé !</h2>
          <p className="text-gray-400 mt-2 mb-10">
            Nous avons bien reçu votre message et reviendrons vers vous sous
            peu.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactRequestSuccess;
