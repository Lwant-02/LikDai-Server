import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { LogoUrl } from "../../src/constant";

interface ChangePasswordEmailProps {
  username?: string;
  resetLink?: string;
  expiryTime?: string;
}

export const ChangePasswordEmail = ({
  username = "Typing Enthusiast",
  resetLink = "https://likdai-pro.com/change-password?token=example-token-12345",
  expiryTime = "5 minutes",
}: ChangePasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "#040303",
                foreground: "#2b2e31",
                primary: "#ffffff",
                yellow: "#dcb743",
                blue: "#3674b5",
                red: "#ea2f14",
                green: "#1f7d53",
                orange: "#ff7601",
                purple: "#7965c1",
              },
            },
          },
        }}
      >
        <Preview>Reset your LikDai-Pro password</Preview>
        <Body className="bg-background text-primary mx-auto my-auto">
          <Container className="max-w-xl p-8 mx-auto my-10 bg-foreground/5 rounded-lg border border-foreground/10">
            <Section className="text-center mb-8">
              <Img
                src={LogoUrl}
                width="90"
                height="90"
                alt="LikDai-Pro Logo"
                className="mx-auto"
              />
              <Heading className="text-3xl font-bold text-primary mt-4 mb-0">
                Password Reset
              </Heading>
              <Text className="text-lg mt-2 text-orange">
                Secure Your LikDai-Pro Account
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="text-base mb-4">
                Hello{" "}
                <span className="text-orange font-semibold">{username}</span>,
              </Text>
              <Text className="text-base mb-4">
                We received a request to reset your password for your LikDai-Pro
                account. If you didn't make this request, you can safely ignore
                this email.
              </Text>
              <Text className="text-base mb-4">
                To reset your password, click the button below:
              </Text>
            </Section>

            <Section className="text-center mb-8">
              <Link
                href={resetLink}
                className="bg-yellow/20 text-yellow px-6 py-3 rounded-lg font-bold no-underline inline-block hover:bg-yellow/30"
              >
                Reset Password
              </Link>
            </Section>

            <Section className="mb-8">
              <Text className="text-base mb-2">
                Or copy and paste this URL into your browser:
              </Text>
              <Text className="text-sm text-yellow bg-foreground/30 p-3 rounded-md break-all">
                {resetLink}
              </Text>
            </Section>

            <Section className="mb-8 bg-foreground/10 p-4 rounded-md border-l-4 border-yellow">
              <Text className="text-sm mb-0">
                <span className="font-bold">Note:</span> This password reset
                link will expire in {expiryTime}.
              </Text>
            </Section>

            <Section className="border-t border-foreground/10 pt-8 text-sm text-primary/70">
              <Text className="mb-4">
                If you didn't request a password reset, please contact our
                support team immediately.
              </Text>
              <Text className="mb-4">Secure typing!</Text>
              <Text className="font-bold">The LikDai-Pro Team</Text>
            </Section>

            <Section className="text-center text-xs text-primary/50 mt-8">
              <Text>
                © {new Date().getFullYear()} LikDai-Pro | All rights reserved.
              </Text>
              <Text>
                Inspired by{" "}
                <Link
                  href="https://monkeytype.com/"
                  className="text-yellow no-underline"
                >
                  monkeytype
                </Link>
              </Text>
              <Text>This is an automated email, please do not reply.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ChangePasswordEmail;
