import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from "@react-email/components";

import { getCarrier, getTrackingUrl } from "@/lib/carriers";
import { SERVER_URL } from "@/lib/constants";
import { email as t } from "@/lib/labels";
import { Order } from "@/types";

/**
 * Avis d'expédition.
 *
 * Sans lui, l'acheteuse doit revenir d'elle-même sur la page de commande pour
 * découvrir que le colis est parti — c'est-à-dire écrire à l'atelier, ou ne
 * rien savoir. Le numéro figure en toutes lettres dans le message : un lien de
 * suivi peut expirer, un numéro non.
 */
const ShipmentNoticeEmail = ({ order }: { order: Order }) => {
  const carrier = getCarrier(order.carrier);
  const trackingUrl = getTrackingUrl(order.carrier, order.trackingNumber);

  return (
    <Html>
      <Head />
      <Body
        style={{ backgroundColor: "#fffbf5", fontFamily: "Arial, sans-serif" }}
      >
        <Container style={{ padding: "24px" }}>
          <Heading>{t.shipmentTitle}</Heading>
          <Text>{t.shipmentBody(order.user.name)}</Text>

          {order.trackingNumber ? (
            <>
              <Text>
                <strong>{t.carrierLine}</strong> {carrier?.label ?? ""}
              </Text>
              <Text>
                <strong>{t.trackingLine}</strong> {order.trackingNumber}
              </Text>
              {trackingUrl ? (
                <Button href={trackingUrl}>{t.followParcel}</Button>
              ) : null}
            </>
          ) : null}

          <Text>
            <Button href={`${SERVER_URL}/order/${order.id}`}>
              {t.viewOrder}
            </Button>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ShipmentNoticeEmail;
