import { db } from "./src/config/db";
import { plans } from "./src/db/schema";
import dotenv from "dotenv";

dotenv.config();

const seedPlans = async () => {
  console.log("Seeding plans...");

  const initialPlans = [
    {
      id: "free",
      name: "Basic Plan",
      amount: "0",
      period: "per month.",
      description: "Perfect for individuals or small teams looking to stay organized with basic features.",
      features: [
        "3 AI Analyses",
        "Basic task management",
        "Personal calendar",
        "Task reminders",
        "Collaboration with 3 team members",
        "Limited file storage (up to 1 GB)",
        "Access to mobile and desktop apps",
      ],
      billingNote: "",
      buttonText: "Start for free",
      popular: "false",
    },
    {
      id: "monthly",
      name: "Pro",
      amount: "1",
      period: "per month.",
      description: "Ideal for growing teams needing more robust tools and integrations.",
      features: [
        "Unlimited Analyses",
        "Advanced task management",
        "Shared team calendar",
        "Unlimited team collaboration",
        "50 GB file storage",
        "Priority customer support",
        "Integrations with popular apps",
      ],
      billingNote: "",
      buttonText: "Get Pro",
      popular: "true",
    },
    {
      id: "yearly",
      name: "Pro Yearly",
      amount: "699",
      period: "per year.",
      description: "Ideal for growing teams needing more robust tools and integrations.",
      features: [
        "Unlimited Analyses",
        "Advanced task management",
        "Shared team calendar",
        "Unlimited team collaboration",
        "50 GB file storage",
        "Priority customer support",
        "Integrations with popular apps",
      ],
      billingNote: "Billed annually",
      buttonText: "Get Pro",
      popular: "false",
    },
    {
      id: "lifetime",
      name: "Enterprise",
      amount: "999",
      period: "one-time",
      description: "Designed for businesses requiring comprehensive, scalable management tools.",
      features: [
        "Everything in Yearly",
        "Custom solutions",
        "Unlimited file storage",
        "Advanced security",
        "Detailed analytics",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      billingNote: "Billed once",
      buttonText: "Get Enterprise",
      popular: "false",
    },
  ];

  for (const plan of initialPlans) {
    await db.insert(plans).values(plan).onConflictDoUpdate({
      target: plans.id,
      set: plan,
    });
  }

  console.log("Plans seeded successfully!");
  process.exit(0);
};

seedPlans().catch((err) => {
  console.error("Error seeding plans:", err);
  process.exit(1);
});
