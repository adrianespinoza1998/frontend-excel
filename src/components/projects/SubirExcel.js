import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const theme = createTheme();

export const SubirExcel = ({data, cargarDatos}) => {

    return (
        <ThemeProvider theme={theme}>
            <Grid sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 5
            }}>
                <Typography component="h1" variant="h5">
                    Datos a Subir
                </Typography>
                <TableContainer sx={{ maxWidth: '75%', mt: 5 }} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">{data[0][0]}</TableCell>
                                <TableCell align="right">{data[0][1]}</TableCell>
                                <TableCell align="right">{data[0][2]}</TableCell>
                                <TableCell align="right">{data[0][3]}</TableCell>
                                <TableCell align="right">{data[0][4]}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((row) => {
                                    return (row[0] !== 'BMP') && <TableRow
                                        key={row}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >{
                                            row.map((cell) => {
                                                return <TableCell key={cell} align="right">{cell}</TableCell>
                                            })
                                        }</TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    onClick={cargarDatos}
                    sx={{
                        mt: 5,
                        mb: 5,
                        backgroundColor: "#2196f3",
                        color: "#fff",
                        "&:hover": {
                            color: "#2196f3"
                        }
                    }}>Guardar</Button>
            </Grid>
        </ThemeProvider>
    )
}
