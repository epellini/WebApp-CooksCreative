import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/joy/Button';
import { useEffect } from "react";
const ConfirmationPage = () => {
  useEffect(() => {
    // Get the confirmation URL from the query parameter
    const confirmationURL = new URLSearchParams(window.location.search).get('confirmation_url');
    setConfirmationURL(confirmationURL);
  }, []);

const [confirmationURL, setConfirmationURL] = useState('');


  const handleConfirmation = () => {
    // Redirect the user to the confirmation URL when the button is clicked
    if (confirmationURL) {
      window.location.href = confirmationURL;
    }
    
    //window.location.href = '/login';
  };

  return (
    <div>
      <h1>Confirmation Page</h1>
      <p>Please wait while we confirm your action...</p>
      <Button onClick={handleConfirmation} variant="solid">
        Confirm
      </Button>
    </div>
  );
};

export default ConfirmationPage;
