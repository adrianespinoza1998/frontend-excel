import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './auth/authContext';

function appBarLabel(label, history, dispatch, setIsDrawerOpen) {

    const logout = () => {

        const action = {
            type: 'logout'
        }

        dispatch(action);

        history.replace('/');
    }

    return (

        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon onClick={() => setIsDrawerOpen(true)} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {label}
            </Typography>
            <Button onClick={logout} color="inherit">Cerrar sesión</Button>
        </Toolbar>
    );
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

export const Navbar = ({setIsDrawerOpen}) => {

    const history = useHistory();
    const { dispatch } = useContext(AuthContext);

    return (
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static" color="primary" style={{ margin: 0 }}>
                    {appBarLabel('Extraer excel', history, dispatch, setIsDrawerOpen)}
                </AppBar>
            </ThemeProvider>
        </Stack>
    )
}
