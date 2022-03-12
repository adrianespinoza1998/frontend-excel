import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { validarRegistroUsuario } from './../../helpers/validarRegistroUsuario';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const theme = createTheme();

export const RegistroScreen = () => {

    const history = useHistory();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const nombre = data.get('nombre');
        const apPaterno = data.get('apPaterno');
        const apMaterno = data.get('apMaterno');
        const correo = data.get('email');
        const contrasena = data.get('password');

        if (validarRegistroUsuario(nombre, apPaterno, apMaterno, correo, contrasena)) {
            //alert("Validación correcta");
            const fetch = await axios({
                url: 'http://localhost:5000/api/usuario',
                method: 'POST',
                data: {
                    nombre,
                    apPaterno,
                    apMaterno,
                    correo,
                    contrasena,
                    idRol: 3
                }
            });

            if(JSON.stringify(fetch.data)===JSON.stringify({msg: `Usuario con el correo: ${correo} ya esta registrado`})){
                alert("El correo electronico ya se encuentra registrado");
            }

            if(JSON.stringify(fetch.data) !== JSON.stringify({msg: `Error al crear usuario`})){
                alert("Usuario registrado");
                history.push('/');
            }else{
                alert("Error al crear usuario ");
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Registrarse
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nombre"
                            label="Nombre"
                            name="nombre"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="apPaterno"
                            label="Apellido Paterno"
                            name="apPaterno"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="apMaterno"
                            label="Apellido Materno"
                            name="apMaterno"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo electronico"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrase
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
