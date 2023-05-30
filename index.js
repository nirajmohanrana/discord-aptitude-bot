// Import required modules
const axios = require('axios');
const cron = require('cron');
const fs = require('fs');

// Load the JSON file
const jsonData = require('./aptitude.json');
const questions = jsonData.questions;

// Set up the Discord webhook URL
const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';

// Function to send questions to the Discord webhook
const sendQuestions = () => {
  const currentDay = sendQuestionsJob.currentTick() + 1;
  const startIdx = (currentDay - 1) * 10;
  const endIdx = currentDay * 10;

  const webhookData = {
    embeds: [
      {
        title: 'Aptitude Questions',
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
      value: `${question.question}\n\nGiven: ${question.given}`,
    });
  }

  // Send the webhook request
  axios
    .post(webhookUrl, webhookData)
    .then(() => console.log('Questions sent successfully!'))
    .catch((error) => console.error('Error sending questions:', error));
};

// Function to send answers to the Discord webhook
const sendAnswers = () => {
  const currentDay = sendAnswersJob.currentTick() + 1;
  const startIdx = (currentDay - 1) * 10;
  const endIdx = currentDay * 10;

  const webhookData = {
    embeds: [
      {
        title: 'Aptitude Answers',
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
      value: `Answer: ${question.answer}\n\nExplanation: ${question.explanation}\n\nSolution: ${question.solution}`,
    });
  }

  // Send the webhook request
  axios
    .post(webhookUrl, webhookData)
    .then(() => console.log('Answers sent successfully!'))
    .catch((error) => console.error('Error sending answers:', error));
};

// Function to get the color for the embed based on the day
const getColorForDay = (day) => {
  const colors = [
    0xFFD700, // Gold color
    0x00FF00, // Green color
    0x1E90FF, // Dodger Blue color
    // Add more colors for subsequent days if needed
  ];

  const colorIndex = (day - 1) % colors.length;
  return colors[colorIndex];
};

// Set up the cron job to schedule the question and answer sending
const questionSchedule = '00 09 * * *'; // 09:00 IST Asia/Kolkata
const answerSchedule = '00 16 * * *'; // 04:00 IST Asia/Kolkata

// Create cron job instances
const sendQuestionsJob = new cron.CronJob(questionSchedule, sendQuestions, null, true, 'Asia/Kolkata');
const sendAnswersJob = new cron.CronJob(answerSchedule, sendAnswers, null, true, 'Asia/Kolkata');

// Start the cron jobs
sendQuestionsJob.start();
sendAnswersJob.start();
