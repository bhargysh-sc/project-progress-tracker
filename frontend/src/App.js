import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import MilestoneBar from "./MilestoneBar";

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
      });
  }, []);

  // Add Google Font to document head
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  if (!config) return <div>Loading...</div>;

  function getPercent(completed, total) {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  const percent = getPercent(config.completedPoints, config.totalPoints);

  function calculateMilestoneETC(milestone, projectConfig) {
    if (milestone.completedPoints >= milestone.totalPoints) {
      return "Complete";
    }
    
    const remainingPoints = milestone.totalPoints - milestone.completedPoints;
    const overallVelocity = projectConfig.completedPoints / (projectConfig.totalPoints || 1);
    
    if (overallVelocity === 0) {
      return `${projectConfig.adjustedBestCaseDays}-${projectConfig.adjustedWorstCaseDays} days`;
    }
    
    const totalProjectDays = projectConfig.adjustedWorstCaseDays;
    const dailyPointsRate = (projectConfig.totalPoints / totalProjectDays) * 0.8; // Add buffer by reducing daily rate
    
    const estimatedDays = Math.round(remainingPoints / dailyPointsRate);
    
    return `${estimatedDays} day${estimatedDays !== 1 ? 's' : ''}`;
  }

const milestoneBlue = "#2196f3";

return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'sans-serif'" }}>
      <h1>{config.name || "Project Progress Tracker"}</h1>
      <ProgressBar percent={percent} />
      <div>
        <span style={{ fontSize: "0.95em", color: "#555" }}>
          Development Start Date: 10-06-2025
        </span>
      </div>
      <div style={{ margin: '10px 0 10px 0', padding: '12px', background: '#f0f4f8', borderRadius: 8, color: '#333', fontSize: '1.08em', display: 'inline-block' }}>
        <span>
          Engineering effort:&nbsp;
          <b>{config.adjustedBestCaseDays}</b>–<b>{config.adjustedWorstCaseDays}</b> days (best–worst)
          <br />
          <span style={{ fontSize: '0.98em', color: '#555' }}>
            <b>{config.adjustedBestCaseWeeks}</b>–<b>{config.adjustedWorstCaseWeeks}</b> weeks
          </span>
        </span>
      </div>
      <h2>Milestones Progress</h2>
      {(() => {
        if (!config.milestones || config.milestones.length === 0) return null;
        const minWidth = 120;
        const maxWidth = 400;
        const maxPoints = Math.max(...config.milestones.map(m => m.totalPoints), 1);
        function getWidth(points) {
          return Math.round(minWidth + ((points / maxPoints) * (maxWidth - minWidth)));
        }
        return (
          <>
            {config.milestones.map((m, i) => (
              <MilestoneBar
                key={i}
                label={`Milestone ${i + 1}: ${m.name}`}
                percent={getPercent(m.completedPoints, m.totalPoints)}
                color={milestoneBlue}
                width={getWidth(m.totalPoints)}
                eta={calculateMilestoneETC(m, config)}
                isReleaseable={i === 3}
              />
            ))}
            <div style={{ fontSize: '1em', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
              🏁 Current project ETC: {(() => {
                const remainingPoints = config.totalPoints - config.completedPoints;
                if (remainingPoints <= 0) return "Complete";
                
                const dailyPointsRate = (config.totalPoints / config.adjustedWorstCaseDays) * 0.8;
                const estimatedDays = Math.round(remainingPoints / dailyPointsRate);
                const estimatedWeeks = Math.round(estimatedDays / 5); // Business weeks
                
                return `${estimatedWeeks} week${estimatedWeeks !== 1 ? 's' : ''}`;
              })()}
            </div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
              * ETC = Estimated time to complete in business days
            </div>
          </>
        );
      })()}

    </div>
  );
}

export default App;
