import React, {useState} from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { Link, Route, Switch, BrowserRouter } from "react-router-dom";


// Signup form (name and photo)=> Signup button and confirmation message
// Login form (photo) => Welcome fulano 

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
      setUser({name: details.name})
    } else {
      setError("O campo 'nome' não pode ser nulo.")
    }
    
    /*
    if(details.email == adminUser.email && details.password == adminUser.password) {
      console.log("Logged in");
      setUser({
        name: details.name,
        email: details.email
      })


    } else {
      console.log("Details do not match");
      setError("Details do not match.")
    }
    */
  }

  const Login = details => {

    console.log(details)

    if(details.user != "") {
      setUser({
        name: details.name
      })
    }

    /*

    if(details.email == adminUser.email && details.password == adminUser.password) {
      console.log("Logged in");
      setUser({
        name: details.name,
        email: details.email
      })
      
      
    } else {
      console.log("Details do not match");
      setError("Details do not match.")
    }
    */
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
          
          <Route path="/signup" component={SignupForm}>
            {(user.name != "") ? (
              <div className="welcome">
                <h2>Cadastro efetuado com sucesso, <span>{user.name}.</span></h2>
                <h3>Teste</h3>
                <button onClick={Logout}>Logout</button>
              </div>
            ) : (
              //<LoginForm Login={Login} error={error}/>
              <SignupForm Signup={Signup}/>
              )}
          </Route>
          <Route path="/login" component={LoginForm}>
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
