import React, { useState } from 'react'
import { HomeAdminScreen } from './../screen/HomeAdminScreen';
import { HomeProjectScreen } from './../screen/HomeProjectScreen';
import { HomeUserScreen } from './../screen/HomeUserScreen';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { HomeScreen } from '../screen/HomeScreen';
import { Navbar } from '../Navbar';
import { SideBar } from '../SideBar';
import { MostrarProyectos } from '../screen/MostrarProyectos';
import { MostrarProyectoScreen } from '../screen/MostrarProyectoScreen';

export const HomeRouter = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      <Navbar setIsDrawerOpen={setIsDrawerOpen} />
      <SideBar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <Switch>
        <Route exact path="/home/admin" component={HomeAdminScreen} />
        <Route exact path="/home/admin/items" component={HomeScreen} />
        <Route exact path="/home/project" component={HomeProjectScreen} />
        <Route exact path="/home/admin/mostrar-proyectos" component={MostrarProyectos} />
        <Route exact path="/home/admin/proyecto/:id" component={MostrarProyectoScreen} />
        <Route exact path="/home/user" component={HomeUserScreen} />
        <Redirect to="/" />
      </Switch>
    </div>
  )
}
