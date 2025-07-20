import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ChangePasswordEmailProps {
  username?: string;
  resetLink?: string;
  expiryTime?: string;
}

export const ChangePasswordEmail = ({
  username,
  resetLink,
  expiryTime,
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
        <Body className="bg-background text-white mx-auto my-auto">
          <Container className="max-w-xl p-8 mx-auto  bg-foreground/5 rounded-lg border border-foreground/10">
            <Section>
              <Text className="text-base mb-4">
                Hello{" "}
                <span className="text-yellow font-semibold">{username}</span>,
              </Text>
              <Text className="text-base mb-4">
                Nobody likes being locked out of their account. We're coming to
                your rescue - just click the button below to get started. If you
                didn't request a password reset, you can safely ignore this
                email.
              </Text>
            </Section>
            <Section className="my-4 py-3 w-full">
              <Link
                href={resetLink}
                className="bg-yellow text-black px-6 w-full py-3 rounded-lg  no-underline "
              >
                Reset Your Password
              </Link>
            </Section>

            <Section>
              <Text className=" mb-2 opacity-50 text-sm">
                Alternatively, you can copy and paste the link below into your
                browser:
              </Text>
              <Text className="text-sm text-yellow bg-foreground/30 p-3 rounded-md break-all">
                {resetLink}
              </Text>
              <Text className=" mb-2 opacity-80 text-sm">
                Noted that the reset link is valid for {expiryTime} and you will
                need to request a new one if it expires.
              </Text>
            </Section>

            <Section className="border-t border-foreground/10 pt-3 text-sm text-primary/70">
              <Text className="mb-4 font-bold">Secure typing!</Text>
              <Text className="font-bold">The LikDai-Pro Team</Text>
            </Section>

            <Section className="text-center text-xs text-primary/50 ">
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
