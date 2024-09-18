import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");  
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', {
        name,
        surname,
        username,
        password,
        email  
      });
      if (response.status === 200) {
        // Alert the user that registration was successful
        window.alert('Registration successful! You can now proceed to login.');
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
          First Name: 
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />

        <label>
          Last Name: 
          <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)} />
        </label>
        <br />

        <label>
          Username: 
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        </label>
        <br />

        <label>
          Email:
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Username@gmail' />
        </label>
        <br />

        <label>
          Password: 
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='**************'/>
        </label>
        <br />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button style={{ backgroundColor: 'grey', color: 'white' }} type="submit">Register</button>

        <br />
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
      <div className='footer'>
        <p>&copy; 2023 Asanda Madondo. TodoMaster. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Register;
