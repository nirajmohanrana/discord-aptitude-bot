// Import required modules
const axios = require("axios");
const cron = require("cron");
const fs = require("fs");

// Load the JSON file
const jsonData = require("./aptitude.json");
const questions = jsonData.questions;

// Set up the Discord webhook URL
const webhookUrl = "https://discord.com/api/webhooks/1111970460490530816/ZU9NuuEjLMAsWpxscmJNXli5fi8AXY-CC0BjZ0uyVkACN3T_WisPZyRXINk08KIDiN7k";

// Counter variable to track the current day
let currentDay = 1;

// Function to send questions to the Discord webhook
const sendQuestions = () => {
  const startIdx = (currentDay - 1) * 10;
  const endIdx = currentDay * 10;

  const webhookData = {
    embeds: [
      {
        title: "Aptitude Questions",
        description: `Here are today's questions (Day ${currentDay}):`,
        color: getColorForDay(currentDay),
        fields: [],
      },
    ],
  };

  // Send questions for the current day
  for (let i = startIdx; i < endIdx; i++) {
    const question = questions[i];
    webhookData.embeds[0].fields.push({
      name: `Question ${i + 1}`,
      value: `${question.question}\n\n**Given**: \`\`\`${question.given}\`\`\`\n==============================\n`,
    });
  }

  // Send the webhook request
  axios
    .post(webhookUrl, webhookData)
    .then(() => console.log("Questions sent successfully!"))
    .catch((error) => console.error("Error sending questions:", error));

  currentDay++; // Increment the current day counter
};

// Function to send answers to the Discord webhook
const sendAnswers = () => {
  const startIdx = (currentDay - 1) * 10;
  const endIdx = currentDay * 10;

  const webhookData = {
    embeds: [
      {
        title: "Aptitude Answers",
        description: `Here are today's answers (Day ${currentDay}):`,
        color: getColorForDay(currentDay),
        fields: [],
      },
    ],
  };

  // Send answers for the current day
  for (let i = startIdx; i < endIdx; i++) {
    const question = questions[i];
    webhookData.embeds[0].fields.push({
      name: `Question ${i + 1}`,
      value: `**Answer**: \`\`\`${question.answer}\`\`\`\n\n**Explanation**: ${question.explanation}\n\n**Solution**: ${question.solution}\n==============================\n`,
    });
  }

  // Send the webhook request
  axios
    .post(webhookUrl, webhookData)
    .then(() => console.log("Answers sent successfully!"))
    .catch((error) => console.error("Error sending answers:", error));
};

// Function to get the color for the embed based on the day
const getColorForDay = (day) => {
  const colors = [
    0xffd700, // Gold color
    0x00ff00, // Green color
    0x1e90ff, // Dodger Blue color
    // Add more colors for subsequent days if needed
  ];

  const colorIndex = (day - 1) % colors.length;
  return colors[colorIndex];
};

// Set up the cron job to schedule the question and answer sending
const questionSchedule = "30 10 * * *"; // 17:15 IST Asia/Kolkata
const answerSchedule = "00 16 * * *"; // 17:16 IST Asia/Kolkata

// Create cron job instances
const sendQuestionsJob = new cron.CronJob(
  questionSchedule,
  sendQuestions,
  null,
  true,
  "Asia/Kolkata"
);
const sendAnswersJob = new cron.CronJob(
  answerSchedule,
  sendAnswers,
  null,
  true,
  "Asia/Kolkata"
);

// Start the cron jobs
sendQuestionsJob.start();
sendAnswersJob.start();
