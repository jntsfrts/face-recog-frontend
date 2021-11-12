import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { Route, BrowserRouter } from "react-router-dom";



function App() {

  const adminUser = {
    email:"admin@admin.com.br",
    password:"123456"
  }

  const [user, setUser] = useState({name:"", email:""});
  const [error, setError] = useState("");

  const Signup = details => {

    console.log(details)

    if(details.name !== "") {
      setUser({name: details.name, email: details.email})
    } else {
      setError("O campo 'nome' não pode ser nulo.")
    }
  }

  const Login = details => {

    if(details.user != "") {
      setUser({
        name: details.name
      })
    }
  }

  const Logout = () => {
    console.log("Logout");  
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
