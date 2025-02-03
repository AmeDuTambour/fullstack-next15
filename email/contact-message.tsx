import { ContactFormData } from "@/types";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

export const ContactRequest = ({
  name,
  email,
  message,
  subject,
}: ContactFormData) => (
  <Html>
    <Head />
    <Body
      style={{ backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" }}
    >
      <Container>
        <Heading>{subject || "New Contact Form Submission"}</Heading>
        <Text>
          <strong>Name:</strong> {name}
        </Text>
        <Text>
          <strong>Email:</strong> {email}
        </Text>
        <Text>
          <strong>Message:</strong> {message}
        </Text>
      </Container>
    </Body>
  </Html>
);
