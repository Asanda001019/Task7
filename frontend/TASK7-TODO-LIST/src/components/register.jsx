import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");  // Add email state
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server to register the user
      const response = await axios.post('http://localhost:3001/register', {
        name,
        surname,
        username,
        password,
        email  // Include email in the request
      });
      // Check for successful registration
      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(response.data.error || 'An error occurred');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'An error occurred');
    }
  };

  return (
    <div className='login-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <h1 className='heading'>Please Register</h1>

        <label>
          FirstName: 
          <input type='text'
            value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />

        <label>
          SurName: 
          <input type='text'
            value={surname} onChange={(e) => setSurname(e.target.value)} />
        </label>
        <br />

        <label>
          UserName: 
          <input type='text'
            value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        </label>
        <br />

        <label>
          Email: 
          <input type='email'
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        </label>
        <br />

        <label>
          PassWord: 
          <input type='password'
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button style={{ backgroundColor: 'grey', color: 'white' }} type="submit">Register</button>

        <br />
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}

export default Register;
