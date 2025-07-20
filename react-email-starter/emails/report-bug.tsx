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

interface ReportBugEmailProps {
  text: string;
}

export default function ReportBugEmail({ text }: ReportBugEmailProps) {
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
              <Text className="text-base mb-4 text-white">
                Hello{" "}
                <span className="text-yellow font-semibold">
                  Developer Team,
                </span>
              </Text>
              <Text className="text-base mb-4 text-white">
                A user has reported an issue with the app. The report is as
                follows:
              </Text>
            </Section>
            <Section className="bg-foreground px-4 rounded-lg ">
              <Text className="text-base mb-4 text-white">{text}</Text>
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
}
