import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { Route, BrowserRouter } from "react-router-dom";
import DataCard from "./components/DataCard";
import { Grid } from '@mui/material';


function App() {

  //const [user, setUser] = useState({name:"", email:""});
  const [user, setUser] = useState({name:"Jona", email:"", accessLevel: ""});
  const [error, setError] = useState("");

  const Signup = details => {

    if(details.name !== "") {
      setUser({name: details.name, email: details.email, accessLevel: ""})
    } else {
      setError("O campo 'nome' não pode ser nulo.")
    }
  }

  const Login = details => {

    if(details.user != "") {
      setUser({
        name: details.name,
        accessLevel: details.accessLevel
      })
    }
  }

  const Logout = () => {
    setUser({
      name: "",
        email: ""
    });
    setError("")
  }
  

  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" component={App}>
          <Route path="/user/new" component={SignupForm}>
            {(user.name != "") ? (
              <div className="welcome">
                <h2>Cadastro efetuado com sucesso, <span>{user.name}.</span></h2>
                <h4>Um link de verificação foi enviado para <span>{user.email}. Verifique sua caixa de entrada.</span></h4>
                <button onClick={Logout}>Logout</button>
              </div>
            ) : (
              <SignupForm Signup={Signup}/>
              )}
          </Route>
          <Route path="/session/new" component={LoginForm}>
          {(user.name != "") ? (
              <div className="welcome">
                <h2>Login efetuado com sucesso, <span>{user.name}.</span></h2>
                <button onClick={Logout}>Logout</button>
                <Grid container >
                    {(parseInt(user.accessLevel) >= 1) ? (
                      <Grid item xs={4}>
                        <DataCard 
                        level={'Público'}
                        title={'Aumento trimestral do desmatamento'}
                        subtitle={''}
                        details={''}/>
                      </Grid>     
                    ) : (console.log("Restrição Level 1 aplicada"))}
                    {(parseInt(user.accessLevel) >= 2) ? (
                      <Grid item xs={4}>
                        <DataCard 
                        level={'Restrito'}
                        title={''}
                        subtitle={''}
                        details={''}/>
                      </Grid>
                    ):(console.log("Restrição Level 2 aplicada"))}
                    {(parseInt(user.accessLevel) >= 3) ? (
                      <Grid item xs={4}>
                        <DataCard 
                        level={'Ultrassecreto'}
                        title={''}
                        subtitle={''}
                        details={''}/>
                      </Grid>
                    ):(console.log("Restrição Level 3 aplicada"))}
                </Grid>
              </div>
            ) : (
              <LoginForm Login={Login} error={error}/>
              )}
          </Route>
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
