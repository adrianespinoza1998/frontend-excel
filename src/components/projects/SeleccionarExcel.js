import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export const SeleccionarExcel = ({handleSubmit, cargaArchivo, nombreArchivo, onChangeUpload}) => {
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Subir Excel
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} align="center">
                        <Grid sx={{ alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: (cargaArchivo) ? "green" : "primary"
                                }}
                            >
                                {(cargaArchivo) ? nombreArchivo : "Seleccionar Archivo"}
                                <input
                                    name="excel"
                                    id="excel"
                                    type="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    hidden
                                    onChange={onChangeUpload}
                                />
                            </Button>
                        </Grid>
                        <Grid sx={{ alignItems: 'center' }}>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                fullWidth
                                variant="contained"
                                component="label"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Subir
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
