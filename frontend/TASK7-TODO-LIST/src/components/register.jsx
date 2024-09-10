import { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"

function Register  (){

const [Name, setName] =useState("");
const [SurName, setSurName] =useState("");
const [UserName, setUserName] =useState("");
const [PassWord, setPassWord] =useState("");

const login = useNavigate();

const handleSubmit =(e)=>{e.preventDefault()}

console.log(UserName, PassWord)

  return (
    <>
      <div className='login-container'>
        <form className='register-form' onSubmit={handleSubmit}>

        <h1 className='heading'>Please Register</h1>

        <label>
          FirstName: 
          <input type='text'
          value={Name} onChange={(e)=>setName(e.target.value)}/>
        </label>
        <br></br>

        <label>
          SurName: 
          <input type='text'
          value={SurName} onChange={(e)=>setSurName(e.target.value)}/>
        </label>
        <br></br>

        <label>
          UserName: 
          <input type='text'
          value={UserName} onChange={(e)=>setUserName(e.target.value)}placeholder='Username@gmail.com'/>
        </label>
        <br></br>

        <label>
          PassWord: 
          <input type='password'
          value={PassWord} onChange={(e)=>setPassWord(e.target.value)}/>
        </label>
        <br></br>

        <button style={{ backgroundColor: 'grey', color: 'white' }} onClick={() => {
         alert("You have successfully registered!");
         login("/login");
        }}>Register</button>

        
        <br></br>
        <p>Already have an account? <Link to="/login">Login here</Link></p>

        </form>
      </div>

    </>
  )
}

export default Register