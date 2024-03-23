import React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import LinearProgress from '@mui/joy/LinearProgress';

async function getQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    return data;
}

export const DashboardQuote = () => {
    const [quote, setQuote] = React.useState(null);

    React.useEffect(() => {
        getQuote().then(data => setQuote(data));
    }, []);

    if (!quote) {
        return <LinearProgress />;
    }

    return (
        <Box p={2} border={1} borderRadius={2}>
            <blockquote>
                <Typography variant="body1" component="p">
                    "{quote.content}"
                </Typography>
                <Typography variant="caption" color="text.secondary" component="footer">
                    - {quote.author}
                </Typography>
            </blockquote>
        </Box>
    );
};
