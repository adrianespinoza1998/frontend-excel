import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { AuthContext } from '../auth/authContext';
import { useHistory } from 'react-router-dom';

const theme = createTheme();

export const LoginScreen = () => {

  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const correo = data.get('email');
    const contrasena = data.get('password');

    const fetch = await axios({
      url: 'http://localhost:5000/api/auth',
      method: 'POST',
      data: {
        correo,
        contrasena
      }
    });

    if (JSON.stringify(fetch.data) !== JSON.stringify({ msg: `Correo y/o contraseña incorrectos` })) {

      const action = {
        type: 'login',
        payload: {
          usuario: JSON.stringify(fetch.data.usuario),
          token: JSON.stringify(fetch.data.token)
        }
      }

      dispatch(action);

      let home = '';

      switch (fetch.data.usuario.idRol) {
        case 1:
          home = '/home/admin';
          break;
        case 2:
          home = '/home/project';
          break;
        case 3:
          home = '/home/user';
          break;
        default:
          home = '/';
      }

      history.replace(home);

    } else {
      alert("Correo y/o contraseña incorrectos");
    }
  };

  const signInScreen = ()=>{
    history.push('/signin');
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electronico"
              name="email"
              autoComplete="email"
              autoFocus
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar cuenta"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  ¿Olvido su contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link onClick={signInScreen} href="javascript:void(0);" variant="body2">
                  {"Registrese aquí"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
