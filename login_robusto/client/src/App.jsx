import React, { useEffect, useState } from 'react';
// Axios foi utilizado para a implementacao do back - Doc: https://axios-http.com/docs/intro
// npm i axios
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Axios from 'axios'
import './App.css';

import Crud_page from './pages/crud_page';
import Navbar from './components/Navbar'
// import Login from './pages/Login.jsx'
function App() {

  // Para captar os inputs usamos os React Hooks

  // Register
  const [usernameReg, setUserNameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')

  //Login
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  const [loginStatus, setLoginStatus] = useState(false)

  // Funcao para enviar dados para o back
  // Deixando um pouco mais claro, register vai chamar um post por meio do Axios, esse post tem o endereçamento a 
  // '/register' e vai enviar um objeto com dois atributos, no caso o CPF e a Senha que foram captados usando
  // os hooks acima

  Axios.defaults.withCredentials = true; // Habilitar cookies

  const register = () => {
    Axios.post('http://localhost:3001/register', {
      cpf: usernameReg,
      senha: passwordReg
    }).then((response) => {
      console.log(response)
    });
  };

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      cpf: cpf,
      senha: senha,
    }).then((response) => {
      if (!response.data.auth){
        setLoginStatus(false);
      } else {
        localStorage.setItem("token", response.data.token); // salva o token na memória local
        setLoginStatus(true);
      }
    });
  };

  // Checa se há alguém logado toda refresh da página
  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].cpf);
      }
    });
  }, []);

  const userAuthenticated = () => {
    Axios.get("http://localhost:3001/isUserAuth", { 
      headers: {
        "x-acess-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response)
    })
  }

  return (
    <Router>
      <Navbar/>
      <div className="App">
        {loginStatus ? (
          <Routes> 
            <Route path='/' element={<Crud_page />} />
          </Routes>
        ) : (
          <>
          
            <div className="Container_Custom">
              <h1>ID SOCORRO</h1>

              <div className="Login-boddy">
                <label>
                  <h3>CPF:</h3>
                  <input 
                    type="text"
                    placeholder='Username...'
                    onChange={(e) => {
                      setCpf(e.target.value)
                    }}
                  />
                </label>
                <label>
                  <h3>SENHA:</h3>
                  <input
                    type="password"
                    placeholder="password..."
                    onChange={(e) => {
                      setSenha(e.target.value)
                    }}
                  />
                </label>
                <div className="btn">
                  <button onClick={login}> Entrar <i class="fa-solid fa-circle-arrow-right"></i> </button>              
                </div>
              </div>
            
            </div>
          </>
        ) }
      </div>
    </Router>
  );
}

export default App;
