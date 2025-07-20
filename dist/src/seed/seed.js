"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_lib_1 = __importDefault(require("../lib/db.lib"));
var AchievementCategory;
(function (AchievementCategory) {
    AchievementCategory["speed"] = "speed";
    AchievementCategory["accuracy"] = "accuracy";
    AchievementCategory["consistency"] = "consistency";
    AchievementCategory["practice"] = "practice";
    AchievementCategory["certificate"] = "certificate";
})(AchievementCategory || (AchievementCategory = {}));
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
        await db_lib_1.default.achievement.createMany({
            data: achievements,
        });
        console.log("Achievements seeded successfully!");
    }
    catch (error) {
        console.log(error);
    }
};
seedDatabase();
