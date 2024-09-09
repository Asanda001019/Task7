import React from 'react'
import "./landingPage.css"
import { useNavigate } from 'react-router-dom'

function LandingPage(){
  const login=useNavigate();
  const register=useNavigate();
  const todo=useNavigate();

  return (
    <>
    <div className='landing-page'>
      <div className='top-navbar'>
        <button onClick={()=>login("/login")}>Login</button>
        <button onClick={()=>register("./register")}>SignUp</button>
        <button onClick={()=>todo("./todo")}>Todo</button>
      </div>
      <div className='app-info'>
        <h1>TodoMaster</h1>
        <p>Master your tasks, master your life</p>
      </div>
    </div>
    </>
  )
}

export default LandingPage