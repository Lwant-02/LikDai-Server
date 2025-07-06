import prisma from "../lib/db.lib";

enum AchievementCategory {
  speed = "speed",
  accuracy = "accuracy",
  consistency = "consistency",
  practice = "practice",
  certificate = "certificate",
}

const achievements = [
  {
    name: "Speed Demon",
    requirement: "Reach 100 WPM",
    threshold: 100,
    category: AchievementCategory.speed,
  },
  {
    name: "Accuracy Master",
    requirement: "Complete a test with 100% accuracy",
    threshold: 100,
    category: AchievementCategory.accuracy,
  },
  {
    name: "Bilingual Pro",
    requirement: "Complete 50 tests in both languages",
    threshold: 50,
    category: AchievementCategory.consistency,
  },
  {
    name: "Marathon Typer",
    requirement: "Practice for 30 hours total",
    threshold: 30,
    category: AchievementCategory.practice,
  },
  {
    name: "Certified Typist",
    requirement: "Complete 4 achievements",
    threshold: 4,
    category: AchievementCategory.certificate,
  },
];

const seedDatabase = async () => {
  try {
    await prisma.achievement.createMany({
      data: achievements,
    });
    console.log("Achievements seeded successfully!");
  } catch (error) {
    console.log(error);
  }
};

seedDatabase();
