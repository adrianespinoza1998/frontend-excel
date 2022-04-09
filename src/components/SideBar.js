import { Drawer, List, ListItem, ListItemText } from '@mui/material'
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { AuthContext } from './auth/authContext';

export const SideBar = ({ isDrawerOpen, setIsDrawerOpen }) => {

    const history = useHistory();

    const { user } = useContext(AuthContext);

    const usuario = JSON.parse(user.usuario);

    const cargarItems = () => {
        history.push('/home/admin/items');
    }

    const mostrarProyectos = ()=>{
        history.push('/home/admin/mostrar-proyectos')
    }

    return (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <List>
                {(usuario.idRol !== 1)
                    ?
                    <div>
                        < ListItem button>
                            <ListItemText primary="Home" />
                        </ListItem>

                        <ListItem button>
                            <ListItemText primary="About" />
                        </ListItem>

                        <ListItem button>
                            <ListItemText primary="Contact" />
                        </ListItem>

                        <ListItem button>
                            <ListItemText primary="Services" />
                        </ListItem>
                    </div>
                    :
                    <div>
                        <ListItem button onClick={cargarItems}>
                            <ListItemText primary="Cargar items" />
                        </ListItem>
                        <ListItem button onClick={mostrarProyectos}>
                            <ListItemText primary="Mostrar proyectos" />
                        </ListItem>
                    </div>
                }
            </List>
        </Drawer >
    )
}
