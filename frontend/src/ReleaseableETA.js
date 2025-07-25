import React from 'react';

function ReleaseableETA({ milestones, releaseableIndex, config }) {
  function addBusinessDays(date, days) {
    const result = new Date(date.getTime());
    let addedDays = 0;
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) addedDays++;
    }
    return result;
  }

  const totalRemainingPoints = milestones.reduce((sum, m, i) => {
    if (i <= releaseableIndex) {
      return sum + ((m.totalPoints || 0) - (m.completedPoints || 0));
    }
    return sum;
  }, 0);
  
  const totalPoints = config.totalPoints || 1;
  
  const bestCaseDaysRaw = Math.ceil(config.bestDays * (totalRemainingPoints / totalPoints)) || 0;
  const worstCaseDaysRaw = Math.ceil(config.worstDays * (totalRemainingPoints / totalPoints)) || 0;
  
  const speedup = config.speedup || 1;
  const bestCaseDays = Math.ceil(bestCaseDaysRaw / speedup) || 0;
  const worstCaseDays = Math.ceil(worstCaseDaysRaw / speedup) || 0;
  
  const today = new Date();
  let bestCaseDate, worstCaseDate;
  let bestCaseDateFormatted, worstCaseDateFormatted;
  
  try {
    if (totalRemainingPoints <= 0) {
      bestCaseDateFormatted = "Already complete";
      worstCaseDateFormatted = "Already complete";
    } else {
      bestCaseDate = addBusinessDays(today, bestCaseDays);
      worstCaseDate = addBusinessDays(today, worstCaseDays);
      
      bestCaseDateFormatted = bestCaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      worstCaseDateFormatted = worstCaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch (error) {
    console.error("Error calculating dates:", error);
    bestCaseDateFormatted = "Calculation error";
    worstCaseDateFormatted = "Calculation error";
  }

  let releaseDate = null;
  let statusColor = '#f5f5f5';
  let statusTextColor = '#000000';
  
  if (config.releaseDate) {
    const [day, month, year] = config.releaseDate.split('-').map(Number);
    releaseDate = new Date(year, month - 1, day);
    
    const daysDifference = Math.floor((worstCaseDate - releaseDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 0) {
      statusColor = '#e8f5e9';
      statusTextColor = '#1b5e20';
    } else if (daysDifference <= 5) {
      statusColor = '#fff8e1';
      statusTextColor = '#f57f17';
    } else {
      statusColor = '#ffebee';
      statusTextColor = '#c62828';
    }
  }
  
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px', width: 400, maxWidth: '100%' }}>
      <div style={{ 
        backgroundColor: statusColor,
        color: statusTextColor,
        padding: '12px', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderLeft: `3px solid ${statusTextColor}`
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          <span role="img" aria-label="calendar">📅</span> First release: {bestCaseDateFormatted} – {worstCaseDateFormatted}
        </div>
        <div style={{ paddingLeft: '4px' }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
            (best case date – worst case date)
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseableETA;
