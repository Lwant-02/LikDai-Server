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

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({
  username = "Typing Enthusiast",
}: WelcomeEmailProps) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

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
        <Body className="bg-background text-primary mx-auto my-auto">
          <Preview>
            Welcome to LikDai-Pro - Master Shan Typing with Precision and Speed
          </Preview>
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
                Welcome to LikDai-Pro
              </Heading>
              <Text className="text-lg mt-2 text-orange">
                Master Shan Typing with Precision and Speed
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="text-base mb-4">
                Hello{" "}
                <span className="text-orange font-semibold">{username}</span>,
              </Text>
              <Text className="text-base mb-4">
                Thank you for joining{" "}
                <span className="text-orange">LikDai-Pro!</span> We're excited
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

            <Section className="text-center mb-8">
              <Link
                href={`http://localhost:3001`}
                className="bg-yellow/20 text-yellow px-6 py-3 rounded-lg font-bold no-underline inline-block hover:bg-yellow/30"
              >
                Start Typing Now
              </Link>
            </Section>

            <Section className="border-t border-foreground/10 pt-8 text-sm text-primary/70">
              <Text>This is an automated email, please do not reply.</Text>
              <Text className="mb-4">Happy typing!</Text>
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
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
