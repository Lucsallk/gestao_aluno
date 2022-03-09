import React, { useEffect, useState } from 'react';
// Axios foi utilizado para a implementacao do back - Doc: https://axios-http.com/docs/intro
// npm i axios
import Axios from 'axios'
import './App.css';

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
    <div className="Registration_page">
      
      <div className="registration">
        <h1>Registrarion</h1>
        <label>Username</label>

        {/* Funcao para captura de input de usuario junto ao hook */}
        <input 
          type="text"
          onChange={(e) => {
            setUserNameReg(e.target.value)
          }}
        />

        {/* Funcao para captura de input de senha junto ao hook */}
        <label>Password</label>        
        <input 
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value)
          }}
        />
        {/* vai chamar a funcao register */}
        <button onClick={register}>Register</button>
      </div>

    </div>
  );
}

export default App;
