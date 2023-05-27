// Import required modules
const axios = require("axios");
const cron = require("cron");
const fs = require("fs");

// Load the JSON file
const jsonData = require("./aptitude.json");
const questions = jsonData.questions;

// Set up the Discord webhook URL
const webhookUrl =
  "https://discord.com/api/webhooks/1111595854407671909/5qgrDMvBGQ4Z5_Gn-vllNdt2HUlA7FAgPkIsZhT6eEeGLsrWOyk_TPh4qwuql6hSEG4D";

// Function to send questions to the Discord webhook
const sendQuestions = () => {
  const webhookData = {
    embeds: [
      {
        title: "Aptitude Questions",
        description: "Here are today's questions:",
        color: 0xffd700, // Gold color
        fields: [],
      },
    ],
  };

  // Send 10 questions
  for (let i = 0; i < 10; i++) {
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
};

// Function to send answers to the Discord webhook
const sendAnswers = () => {
  const webhookData = {
    embeds: [
      {
        title: "Aptitude Answers",
        description: "Here are today's answers:",
        color: 0x00ff00, // Green color
        fields: [],
      },
    ],
  };

  // Send answers for 10 questions
  for (let i = 0; i < 10; i++) {
    const question = questions[i];
    webhookData.embeds[0].fields.push({
      name: `Question ${i + 1}`,
      value: `**Answer**: \`\`\`${question.answer}\`\`\`\n\n**Explanation**:\n ${question.explanation}\n\n**Solution**:\n ${question.solution}\n==============================\n`,
    });
  }

  // Send the webhook request
  axios
    .post(webhookUrl, webhookData)
    .then(() => console.log("Answers sent successfully!"))
    .catch((error) => console.error("Error sending answers:", error));
};

// Set up the cron job to schedule the question and answer sending
const questionSchedule = "00 09 * * *"; // 17:15 IST Asia/Kolkata
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
