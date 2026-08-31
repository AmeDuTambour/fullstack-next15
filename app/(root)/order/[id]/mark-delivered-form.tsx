"use client";

import { useState, useTransition } from "react";
import { PackageCheck } from "lucide-react";

import { PendingButton } from "@/components/ui/pending-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { markOrderAsDelivered } from "@/lib/actions/order.actions";
import { CARRIERS, checkTrackingNumber } from "@/lib/carriers";
import { order as t } from "@/lib/labels";

/**
 * Expédition et suivi, en un seul geste.
 *
 * Le suivi n'est pas un second écran : c'est ce que Julien a sous les yeux au
 * moment où il dépose le colis. Un formulaire séparé aurait garanti qu'il ne
 * soit jamais renseigné.
 *
 * Le numéro reste facultatif — le bouton marque l'expédition avec ou sans lui.
 * L'incohérence de forme est signalée, jamais bloquante : le transporteur seul
 * décide si un numéro est valide.
 */
const MarkDeliveredForm = ({ orderId }: { orderId: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [carrier, setCarrier] = useState(CARRIERS[0].id);
  const [trackingNumber, setTrackingNumber] = useState("");

  const hint = trackingNumber.trim()
    ? checkTrackingNumber(carrier, trackingNumber)
    : null;

  const onSubmit = () => {
    startTransition(async () => {
      const res = await markOrderAsDelivered(orderId, {
        carrier,
        trackingNumber,
      });
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="carrier">{t.carrier}</Label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger id="carrier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CARRIERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="trackingNumber">{t.trackingNumber}</Label>
          <Input
            id="trackingNumber"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder={t.trackingOptional}
            aria-describedby={hint ? "trackingHint" : undefined}
          />
          {hint ? (
            <p id="trackingHint" className="text-xs text-muted-foreground">
              {t.trackingHint(hint)}
            </p>
          ) : null}
        </div>
      </div>

      <PendingButton
        type="button"
        pending={isPending}
        icon={<PackageCheck className="h-4 w-4" />}
        onClick={onSubmit}
      >
        {t.markAsDelivered}
      </PendingButton>
    </div>
  );
};

export default MarkDeliveredForm;
