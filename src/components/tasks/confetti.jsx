import React from 'react';
import confetti from "https://esm.run/canvas-confetti@1";
import Button from "@mui/joy/Button";

function Confetti() {
  function onClick() {
    confetti({
      particleCount: 190,
      spread: 130
    });
  }

  return (
      <Button onClick={onClick}>
        <span>Complete Task</span>
      </Button>
  );
}

export default Confetti;