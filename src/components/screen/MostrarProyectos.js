import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { validarSO } from '../../helpers/validarSO';
import { AuthContext } from '../auth/authContext';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const theme = createTheme();

export const MostrarProyectos = () => {

    const [proyectos, setProyectos] = useState([]);
    const { user } = useContext(AuthContext);

    const history = useHistory();

    useEffect(async () => {
        const fetch = await axios({
            url: `${validarSO()}/api/proyecto`,
            method: 'GET',
            headers: {
                'x-token': user.token
            }
        });

        setProyectos(fetch.data);
    }, []);

    const handleClick = (id) => {
        history.push(`/home/admin/proyecto/${id}`);
    }

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
                        Lista de proyectos
                    </Typography>
                    {
                        proyectos.map((pr, index) => {

                            return <Card variant='outlined' key={index} sx={{ minWidth: 275, marginTop: 4 }}>
                                <CardContent sx={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                                        {`${pr.nombreProyecto} (${index})`}
                                    </Typography>
                                    <Divider />
                                </CardContent>
                                <CardActions sx={{alignItems: 'center', justifyContent: 'center'}}>
                                <Button onClick={()=>{handleClick(pr.idProyecto)}} size="small">Ver</Button>
                                </CardActions>
                            </Card>
                        })
                    }
                </Box>
            </Container>
        </ThemeProvider>
    )
}
