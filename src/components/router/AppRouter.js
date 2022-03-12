import { LoginScreen } from './../screen/LoginScreen';
import {HomeRouter} from './HomeRouter'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import { RegistroScreen } from '../screen/RegistroScreen';

export const AppRouter = () => {
  return (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={LoginScreen} />
                <Route path="/home" component={HomeRouter} />
                <Route exact path="/signin" component={RegistroScreen} />
                <Redirect to="/" />
            </Switch>
        </div>
    </Router>
  )
}
