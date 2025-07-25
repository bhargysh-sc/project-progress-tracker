import React from "react";

function addBusinessDays(date, days) {
  const result = new Date(date);
  let addedDays = 0;
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) addedDays++;
  }
  return result;
}


function calculateMilestoneETC(milestone, config, milestoneIndex) {
  if (milestone.completedPoints >= milestone.totalPoints) {
    return "Complete";
  }
  
  if (milestoneIndex === -1) {
    return "Unknown";
  }
  
  let totalRemainingPoints = 0;
  
  for (let i = 0; i <= milestoneIndex; i++) {
    const m = config.milestones[i];
    totalRemainingPoints += Math.max(0, (m.totalPoints || 0) - (m.completedPoints || 0));
  }
  
  if (totalRemainingPoints <= 0) {
    return "Complete";
  }
  
  const totalPoints = config.totalPoints || 1;
  
  const bestCaseDaysRaw = Math.ceil(config.bestDays * (totalRemainingPoints / totalPoints)) || 0;
  const worstCaseDaysRaw = Math.ceil(config.worstDays * (totalRemainingPoints / totalPoints)) || 0;
  
  const speedup = config.speedup || 1;
  const bestCaseDays = Math.ceil(bestCaseDaysRaw / speedup) || 0;
  const worstCaseDays = Math.ceil(worstCaseDaysRaw / speedup) || 0;
  
  const today = new Date();
  const bestCaseDate = addBusinessDays(today, bestCaseDays);
  const worstCaseDate = addBusinessDays(today, worstCaseDays);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const bestCaseDateFormatted = bestCaseDate.toLocaleDateString('en-US', options);
  const worstCaseDateFormatted = worstCaseDate.toLocaleDateString('en-US', options);
  return `${bestCaseDateFormatted} – ${worstCaseDateFormatted}`;
}

function MilestoneBar({ label, percent, color, width = 400, milestone, config, milestoneIndex, isReleaseable }) {
  const isComplete = percent === 100;
  const barColor = isComplete ? '#4caf50' : color;
  
  const etc = milestone && config ? calculateMilestoneETC(milestone, config, milestoneIndex) : null;
  
  return (
    <div style={{ marginBottom: "1em", width: 400, maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <b style={{ textAlign: 'left', wordBreak: 'break-word', flex: 1 }}>{label}</b>
        {etc && !isComplete && <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px', whiteSpace: 'nowrap', textAlign: 'right' }}>ETC: {etc}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ background: "#eee", borderRadius: 8, height: 24, width: width, maxWidth: "100%", overflow: "hidden", display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              background: barColor,
              width: `${percent}%`,
              height: "100%",
              transition: "width 0.5s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1em",
            }}
          >
            {percent > 0 ? `${percent}%` : null}
          </div>
        </div>
        {isComplete && (
          <span style={{
            marginLeft: 16,
            fontSize: 28,
            display: 'flex',
            alignItems: 'center',
            height: 24
          }}>🎉</span>
        )}
      </div>
      {isReleaseable && (
        <div style={{
          marginTop: '6px',
          display: 'inline-block',
          backgroundColor: '#e8f5e9',
          color: '#1b5e20',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.85em',
          fontWeight: 500,
          borderLeft: '3px solid #2e7d32'
        }}>
          <span role="img" aria-label="rocket">🚀</span> Releaseable
        </div>
      )}
    </div>
  );
}

export default MilestoneBar;
