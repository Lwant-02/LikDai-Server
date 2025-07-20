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

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({
  username = "Typing Enthusiast",
}: WelcomeEmailProps) => {
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
        <Body className="bg-background text-white mx-auto my-auto">
          <Preview>
            Welcome to LikDai-Pro - Master Shan Typing with Precision and Speed
          </Preview>
          <Container className="max-w-xl p-8 mx-auto  bg-foreground/5 rounded-lg border border-foreground/10">
            <Section>
              <Text className="text-base mb-3">
                Hello{" "}
                <span className="text-yellow font-semibold">{username}</span>,
              </Text>
              <Text className="text-base mb-3">
                Thank you for joining{" "}
                <span className="text-yellow">LikDai-Pro!</span> We're excited
                to have you on board. Our platform is designed to help you
                master Shan language typing with a clean, distraction-free
                environment inspired by{" "}
                <span className="text-yellow">monkeytype.</span>
              </Text>
              <Text className="text-base mb-4">With LikDai-Pro, you can:</Text>
              <Text className="text-base pl-4 mb-2">
                • Practice in both English and Shan languages
              </Text>
              <Text className="text-base pl-4 mb-2">
                • Track your WPM, accuracy, and consistency
              </Text>
              <Text className="text-base pl-4 mb-2">
                • Choose from different test types (timed, word count, quotes)
              </Text>
              <Text className="text-base pl-4 mb-4">
                • Compete with others on the leaderboard
              </Text>
            </Section>

            <Section className="text-center mb-8 w-full mt-2">
              <Link
                href={`http://localhost:3001`}
                className="bg-yellow text-black px-6 py-3 rounded-lg  no-underline"
              >
                Start Typing Now
              </Link>
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

export default WelcomeEmail;
