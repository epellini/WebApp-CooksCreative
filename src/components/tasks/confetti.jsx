import React from 'react';
import confetti from "https://esm.run/canvas-confetti@1";

// Inline styles equivalent to the provided CSS
const styles = {
  body: {
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.5,
    display: 'grid',
    placeItems: 'center',
  },
  button: {
    backgroundColor: '#404663',
    color: '#fff',
    border: 0,
    fontSize: '2rem',
    fontWeight: 400,
    padding: '0.5em 1.25em',
    borderRadius: '0.5em',
    zIndex: 999,
    position: 'relative',
    display: 'flex',
    gap: '0.5em',
    boxShadow: '0px 1.7px 2.2px rgba(0, 0, 0, 0.02), 0px 4px 5.3px rgba(0, 0, 0, 0.028), 0px 7.5px 10px rgba(0, 0, 0, 0.035), 0px 13.4px 17.9px rgba(0, 0, 0, 0.042), 0px 25.1px 33.4px rgba(0, 0, 0, 0.05), 0px 60px 80px rgba(0, 0, 0, 0.07)',
    cursor: 'pointer',
    margin: 0,
    padding: 0,
  },
  buttonActive: {
    transform: 'scale(1.01)',
  }
};

function Confetti() {
  function onClick() {
    confetti({
      particleCount: 150,
      spread: 60
    });
  }

  return (
    <div style={styles.body}>
      <button style={styles.button} onClick={onClick} onMouseDown={(e) => e.target.style.transform = 'scale(1.01)'} onMouseUp={(e) => e.target.style.transform = 'scale(1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
        <span>🎉</span>
        <span>Complete Task</span>
      </button>
    </div>
  );
}

export default Confetti;
