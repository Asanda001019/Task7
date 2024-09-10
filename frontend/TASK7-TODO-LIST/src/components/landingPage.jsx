import React from 'react';
import "./landingPage.css";
import { useNavigate } from 'react-router-dom';

function LandingPage(){
  const login = useNavigate();
  const register = useNavigate();
  const todo = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn'); 
  const isRegistered = localStorage.getItem("isRegistered");

  const handleTodoClick = () => {
    if (!isLoggedIn) {
      alert('You must login first to access the Todo page!');
    } else {
      todo('/todo');
    }
  };

  const handleLoginClick = () => {
    if (!isRegistered) {
      alert('You must Register first to access the login page!');
    } else {
      login('/login');
    }
  };

  return (
    <>
      <div className='landing-page'>
        <div className='top-navbar'>
          <button onClick={handleLoginClick}>Login</button>
          <button onClick={() => register("./register")}>SignUp</button>
          <button onClick={handleTodoClick}>Todo</button>
        </div>
        <div className='app-info'>
          <h1>TodoMaster</h1>
          <p>Master your tasks, master your life</p>
        </div>
        <div className='footer'>
          <p>&copy; 2023 Asanda Madondo. TodoMaster. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;