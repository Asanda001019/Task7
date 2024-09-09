import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './components/landingPage'
import Login from './components/login'
import Register from './components/register'
import TodoPage from './components/todo'
import {BrowserRouter, Route, Routes} from "react-router-dom"

function App() {


  return (
    <>
<BrowserRouter>
   <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="login" element={<Login/>}/>
    <Route path="register" element={<Register />}/>
    <Route path="todo" element={<TodoPage/>}/>
  </Routes>
</BrowserRouter>

{/* <Login/> */}

{/* <LandingPage/> */}
    </>
  )
}

export default App
