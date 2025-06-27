require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // allow requests from React dev server

app.get('/config', (req, res) => {
  // Helper to strip quotes
  function stripQuotes(val) {
    if (!val) return '';
    if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
    return val;
  }

  // Dynamically collect milestones
  const milestones = [];
  let i = 1;
  while (true) {
    const nameKey = `milestone${i}Name`;
    const totalPointsKey = `milestone${i}TotalPoints`;
    const completedPointsKey = `milestone${i}CompletedPoints`;
    const name = stripQuotes(process.env[nameKey]);
    if (!name) break;
    milestones.push({
      name,
      totalPoints: Number(process.env[totalPointsKey]) || 0,
      completedPoints: Number(process.env[completedPointsKey]) || 0
    });
    i++;
  }

  // Calculate total and completed points from milestones
  const totalPoints = milestones.reduce((sum, m) => sum + m.totalPoints, 0);
  const completedPoints = milestones.reduce((sum, m) => sum + m.completedPoints, 0);

  // Remove surrounding quotes if present
  let projectName = process.env.name || '';
  if (projectName.startsWith('"') && projectName.endsWith('"')) {
    projectName = projectName.slice(1, -1);
  }

  // Estimate project duration
  const bestDays = Number(process.env.bestDays);
  const worstDays = Number(process.env.worstDays);
  const speedup = Number(process.env.speedup);
  // Fraction completed
  const fractionComplete = totalPoints > 0 ? completedPoints / totalPoints : 0;
  // Remaining fraction
  const fractionRemaining = 1 - fractionComplete;
  // Days remaining (best/worst/adjusted)
  const bestCaseDays = Math.ceil(bestDays * fractionRemaining);
  const worstCaseDays = Math.ceil(worstDays * fractionRemaining);
  const adjustedBestCaseDays = Math.ceil(bestCaseDays / speedup);
  const adjustedWorstCaseDays = Math.ceil(worstCaseDays / speedup);

  // Business weeks (5 business days per week)
  const bestCaseWeeks = Math.ceil(bestCaseDays / 5);
  const worstCaseWeeks = Math.ceil(worstCaseDays / 5);
  const adjustedBestCaseWeeks = Math.ceil(adjustedBestCaseDays / 5);
  const adjustedWorstCaseWeeks = Math.ceil(adjustedWorstCaseDays / 5);

  res.json({
    name: projectName,
    totalPoints,
    completedPoints,
    bestDays,
    worstDays,
    engineers: Number(process.env.engineers),
    speedup,
    bestCaseDays,
    worstCaseDays,
    bestCaseWeeks,
    worstCaseWeeks,
    adjustedBestCaseDays,
    adjustedWorstCaseDays,
    adjustedBestCaseWeeks,
    adjustedWorstCaseWeeks,
    milestones
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
