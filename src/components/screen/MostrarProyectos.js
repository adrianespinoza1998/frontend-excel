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

    const handleClick = (id)=>{
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
                        proyectos.map((pr,index)=>{
                            return <div onClick={()=>{handleClick(pr.idProyecto)}} >
                                <div key={index}>{pr.nombreProyecto}</div>
                                <hr />
                            </div>
                        })
                    }
                </Box>
            </Container>
        </ThemeProvider>
    )
}
