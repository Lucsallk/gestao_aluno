// import React, { useEffect, useState } from 'react';
// // Axios foi utilizado para a implementacao do back - Doc: https://axios-http.com/docs/intro
// // npm i axios
// import Axios from 'axios'
// import './Login.css';

// function Login() {

//   // Para captar os inputs usamos os React Hooks

//   //Login
//   const [cpf, setCpf] = useState('')
//   const [senha, setSenha] = useState('')

//   const [loginStatus, setLoginStatus] = useState(false)

//   // Funcao para enviar dados para o back
//   // Deixando um pouco mais claro, register vai chamar um post por meio do Axios, esse post tem o endereçamento a 
//   // '/register' e vai enviar um objeto com dois atributos, no caso o CPF e a Senha que foram captados usando
//   // os hooks acima

//   Axios.defaults.withCredentials = true; // Habilitar cookies

//   const login = () => {
//     Axios.post("http://localhost:3001/login", {
//       cpf: cpf,
//       senha: senha,
//     }).then((response) => {
//       if (!response.data.auth){
//         setLoginStatus(false);
//       } else {
//         localStorage.setItem("token", response.data.token); // salva o token na memória local
//         setLoginStatus(true);
//       }
//     });
//   };

//   // Checa se há alguém logado toda refresh da página
//   useEffect(() => {
//     Axios.get("http://localhost:3001/login").then((response) => {
//       if (response.data.loggedIn == true) {
//         setLoginStatus(response.data.user[0].cpf);
//       }
//     });
//   }, []);

//   const userAuthenticated = () => {
//     Axios.get("http://localhost:3001/isUserAuth", { 
//       headers: {
//         "x-acess-token": localStorage.getItem("token"),
//       },
//     }).then((response) => {
//       console.log(response)
//     })
//   }

//   return (
//     <div className="login_page">

//       <div className="login">
//         <h1>Login</h1>
//         <input 
//           type="text"
//           placeholder='Username...'
//           onChange={(e) => {
//             setCpf(e.target.value)
//           }}
//         />

//         <input
//           type="text"
//           placeholder="password..."
//           onChange={(e) => {
//             setSenha(e.target.value)
//           }}
//         />

//         <button onClick={login}> Login </button>
//       </div>

//       {loginStatus && <button onClick={userAuthenticated}> Check if Authenticated</button>}

//     </div>
//   );
// }

// export default Login;
