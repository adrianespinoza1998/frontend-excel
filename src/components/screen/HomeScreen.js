import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import xlsxFile from 'read-excel-file';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as axios from 'axios';
import {useContext} from 'react'
import {AuthContext} from '../auth/authContext'

const theme = createTheme();

export const HomeScreen = () => {

    const [items, setItems] = useState({
        data: [],
        load: false
    });

    const { data, load } = items;

    const {user} = useContext(AuthContext); 

    const [archivo, setArchivo] = useState({
        nombreArchivo: '',
        cargaArchivo: false
    });

    const { nombreArchivo, cargaArchivo } = archivo;

    const handleSubmit = async () => {
        //event.preventDefault();
        const data = new FormData(document.querySelector('form'));

        const excel = data.get("excel");

        if (excel.name !== '') {
            const finalData = await xlsxFile(excel);

            setItems({
                data: finalData,
                load: true
            });
        } else {
            alert('Por favor, ingrese el excel a la plataforma');
        }
    }

    const onChangeUpload = (event) => {
        event.preventDefault();

        if (event.target.value !== '') {

            const finalPath = event.target.value.replace(/\\/g, '/');

            const arrPath = finalPath.split('/');

            const archivoSubido = arrPath[arrPath.length - 1];

            setArchivo({
                nombreArchivo: archivoSubido,
                cargaArchivo: true
            });
        } else {
            setArchivo({
                nombreArchivo: 'Datos a subir',
                cargaArchivo: false
            });
        }
    }

    const cargarDatos = async () => {

        try {

            console.log(user.token);

            const fetch = await axios({
                url: 'http://localhost:5000/api/items',
                method: 'POST',
                data: {
                    items: data
                },
                headers: {
                    'x-token':  user.token
                }
            });

            if (!fetch.data.msg.includes('Error')) {
                alert('Items insertados');

                setArchivo({
                    nombreArchivo: 'Datos a subir',
                    cargaArchivo: false
                });

                setItems({
                    data: [],
                    load: false
                });
            } else {
                alert('Error al insertar items');

                setArchivo({
                    nombreArchivo: 'Datos a subir',
                    cargaArchivo: false
                });

                setItems({
                    data: [],
                    load: false
                });
            }
        } catch (error) {
            console.log(error);
            alert('Base de datos offline');
        }
    }

    return (
        <div>
            {(load) ?
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
                :
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
            }
        </div>
    )
}
