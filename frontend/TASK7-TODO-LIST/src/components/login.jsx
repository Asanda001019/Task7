import {Link, useNavigate} from "react-router-dom"
import { useState } from 'react'
import "./login/signUp.css"

function Login (){

const [UserName, setUserName] =useState("");
const [PassWord, setPassWord] =useState("");
// const navigate = useNavigate;
const todo = useNavigate();

const handleSubmit =(e)=>{e.preventDefault()}

console.log(UserName, PassWord)

  return (
    <>
    <div className="backf">
      <div className='login-container'>
        <form className='login-form' onSubmit={handleSubmit}>

        <h1 className='heading'>Please Login</h1>

        <label>
          UserName: 
          <input type='text'
          value={UserName} onChange={(e)=>setUserName(e.target.value)} placeholder='Asanda19@gmail.com'/>
        </label>
        <br></br>
        <br></br>

        <label>
          PassWord: 
          <input type='password'
          value={PassWord} onChange={(e)=>setPassWord(e.target.value)}/>
        </label>
        <br></br>
        <br></br>

       
        <button style={{ backgroundColor: 'grey', color: 'white' }} onClick={() => todo("/todo")}>Register</button>
        <br></br>
        
        <p>Don't have an account? <Link to="/register">Register here</Link></p>

        </form>
      </div>
      </div>

    </>
  )
}

export default Login