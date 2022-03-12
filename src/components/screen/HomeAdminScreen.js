import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';

const theme = createTheme();

export const HomeAdminScreen = () => {

  const history = useHistory();

  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5
      }}>
        <Typography component="h1" variant="h5">
          Home Admin
        </Typography>
      </Grid>
    </ThemeProvider>
  )
}
