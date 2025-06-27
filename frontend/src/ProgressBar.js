import React from "react";

function ProgressBar({ percent }) {
  return (
    <div style={{ position: "relative", margin: "1em 0", width: 400, maxWidth: "100%" }}>
      <div
        style={{
          background: "#eee",
          borderRadius: 8,
          height: 32,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#4caf50",
            width: `${percent}%`,
            height: "100%",
            transition: "width 0.5s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.1em",
          }}
        >
          {percent}%
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
