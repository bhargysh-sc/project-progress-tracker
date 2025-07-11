import React from "react";

function MilestoneBar({ label, percent, color, width = 400, eta }) {
  const isComplete = percent === 100;
  const barColor = isComplete ? '#4caf50' : color;
  return (
    <div style={{ marginBottom: "1em", width: 400, maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <b style={{ textAlign: 'left', wordBreak: 'break-word', flex: 1 }}>{label}</b>
        {eta && <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px', whiteSpace: 'nowrap', textAlign: 'right', minWidth: '80px' }}>ETC: {eta}</span>}
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
    </div>
  );
}

export default MilestoneBar;
