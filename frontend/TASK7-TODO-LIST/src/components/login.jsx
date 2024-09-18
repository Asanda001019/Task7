import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import "./login/signUp.css";

function Login() {
  const [UserName, setUserName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the username exists
      const userCheck = await axios.get(`http://localhost:3001/login/${UserName}`);
      
      if (userCheck.data.exists) {
        // Send a POST request to the server for login
        const response = await axios.post('http://localhost:3001/login', {
          username: UserName,
          password: PassWord
        });

        if (response.status === 200) {
          // Login successful, show alert and navigate to the todo page
          window.alert('Login successful! Welcome!');
          navigate("/todo");
        } else {
          setError(response.data.error || 'An error occurred');
        }
      } else {
        setError('Username does not exist');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'An error occurred');
    }
  };

  return (
    <div className="backf">
      <div className='login-container'>
        <form className='login-form' onSubmit={handleSubmit}>
          <h1 className='heading'>Please Login</h1>

          <label>
            UserName: 
            <input type='text'
              value={UserName} onChange={(e) => setUserName(e.target.value)} placeholder='Username' />
          </label>
          <br />
          <br />                                    

          <label>
            PassWord: 
            <input type='password'
              value={PassWord} onChange={(e) => setPassWord(e.target.value)} placeholder='**************' />
          </label>
          <br />
          <br />

          {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error messages */}

          <button style={{ backgroundColor: 'grey', color: 'white' }} type="submit">Login</button>
          <br />
          
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </form>
      </div>
      <div className='footer'>
          <p>&copy; 2023 Asanda Madondo. TodoMaster. All rights reserved.</p>
        </div>
    </div>
  );
}

export default Login;
