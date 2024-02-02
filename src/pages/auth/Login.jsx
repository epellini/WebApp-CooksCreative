import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button, Stack } from "@mui/joy";
import Card from '@mui/joy/Card';
import CircularProgress from '@mui/joy/CircularProgress';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../../hooks/AuthProvider";

export default function Login() {
  const { session, loading, supabase} = useAuth();
  let location = useLocation();
  let from = location.state?.from.pathname || "/";

  if (loading) {
    return <CircularProgress />;
  }

  if (!session) {
    return (
      <Stack 
      padding={10}
      direction={'row'}
      justifyContent="center"
      sx={{ minWidth: 22 }}
      alignItems="center"
      spacing={3}
      >
      <Card 
      variant="outlined"
      sx={{ padding: 2, paddingLeft: 5, paddingRight: 5}}
      >
      <Auth
        supabaseClient={supabase} 
        showLinks={false}
        socialLayout="vertical"
        providers={['email']}
        appearance={{ theme: ThemeSupa,
          style: {
            button: { background: '#0B6BCB', color: 'white',   border: '1px solid #0B6BCB', },
            container: { margin: 10},
            
          },
        }}
        />
        {/* <Button onClick={supabase.auth.resetPasswordForEmail}>Forgot Password</Button> */}
        </Card>
        </Stack>
    );
  } else {
    return (
      <Navigate to={from} replace  />
    );
  }
}
