import { EuroIcon, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Livraison Gratuite</div>
            <div className="text-sm text-muted-foreground">
              Livraison offerte pour les commandes supérieures à 150 €
            </div>
          </div>
          <div className="space-y-2">
            <EuroIcon />
            <div className="text-sm font-bold">Garantie Remboursement</div>
            <div className="text-sm text-muted-foreground">
              Valable dans les 30 jours suivant l&apos;achat
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Paiement Flexible</div>
            <div className="text-sm text-muted-foreground">
              Payez par carte bancaire ou PayPal
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">Assistance 24h/7j</div>
            <div className="text-sm text-muted-foreground">
              Assistance disponible à tout moment
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
