import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/joy/Button';
import { useEffect } from "react";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const confirmUser = async () => {
      const confirmationURL = new URLSearchParams(window.location.search).get('confirmation_url');
      if (confirmationURL) {
        try {
          // Simulate clicking the confirmation link by fetching it
          // Note: This is a simplistic approach; actual implementation may vary based on response requirements
          const response = await fetch(confirmationURL);
          if (response.ok) {
            setIsConfirmed(true);
            // Redirect to set-password page after a short delay to ensure user sees confirmation status
            setTimeout(() => navigate('/set-password'), 5000); // Adjust delay as necessary
          } else {
            throw new Error('Confirmation failed');
          }
        } catch (error) {
          console.error('Error confirming user:', error);
          // Handle confirmation error (e.g., show an error message)
        }
      }
    };

    confirmUser();
  }, [navigate]);

  return (
    <div>
      <h1>Confirmation Page</h1>
      {isConfirmed ? (
        <p>Your email has been confirmed! Redirecting to set your password...</p>
      ) : (
        <p>Confirming your email, please wait...</p>
      )}
    </div>
  );
};

export default ConfirmationPage;



// const ConfirmationPage = () => {

//   const navigate = useNavigate();
  
//   useEffect(() => {
//     // Get the confirmation URL from the query parameter
//     const confirmationURL = new URLSearchParams(window.location.search).get('confirmation_url');
//     setConfirmationURL(confirmationURL);
//   }, []);

// const [confirmationURL, setConfirmationURL] = useState('');


//   const handleConfirmation = () => {
//     // Redirect the user to the confirmation URL when the button is clicked
//     if (confirmationURL) {
//       window.location.href = confirmationURL;
//     }
//     navigate('/set-password')
//     //window.location.href = '/login';
//   };

//   return (
//     <div>
//       <h1>Confirmation Page</h1>
//       <p>Please wait while we confirm your action...</p>
//       <Button onClick={handleConfirmation} variant="solid">
//         Confirm
//       </Button>
//     </div>
//   );
// };

// export default ConfirmationPage;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from '@mui/joy/Button';
// import { useEffect } from "react";
// const ConfirmationPage = () => {
//   useEffect(() => {
//     // Get the confirmation URL from the query parameter
//     const confirmationURL = new URLSearchParams(window.location.search).get('confirmation_url');
//     setConfirmationURL(confirmationURL);
//   }, []);

// const [confirmationURL, setConfirmationURL] = useState('');


//   const handleConfirmation = () => {
//     // Redirect the user to the confirmation URL when the button is clicked
//     if (confirmationURL) {
//       window.location.href = confirmationURL;
//     }
    
//     //window.location.href = '/login';
//   };

//   return (
//     <div>
//       <h1>Confirmation Page</h1>
//       <p>Please wait while we confirm your action...</p>
//       <Button onClick={handleConfirmation} variant="solid">
//         Confirm
//       </Button>
//     </div>
//   );
// };

// export default ConfirmationPage;
