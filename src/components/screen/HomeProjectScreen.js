import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const theme = createTheme();

export const HomeProjectScreen = () => {
  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5
      }}>
        <Typography component="h1" variant="h5">
          Home Project
        </Typography>
      </Grid>
    </ThemeProvider>
  )
}
