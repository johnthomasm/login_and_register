import React, { useState, useEffect } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiUserSharedFill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login'; // Determine if the current route is login
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form data and errors when component mounts
    setFormData({ username: '', password: '', name: '', email: '' });
    setErrors({});
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const { username, password, name, email } = formData;

    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    if (!isLogin) { // Validation for registration
      if (!name) newErrors.name = 'Name is required';
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setErrors({});

      try {
        const url = isLogin ? '/api/login' : '/api/register';
        const data = isLogin 
          ? { username: formData.username, password: formData.password } 
          : { username: formData.username, password: formData.password, name: formData.name, email: formData.email };

        const response = await axios.post(url, data);

        if (isLogin) {
          alert('Login successful!'); // Consider using a toast notification
          localStorage.setItem('token', response.data.token);
          navigate('/home');
        } else {
          alert('Registration successful!'); // Consider using a toast notification
          navigate('/login');
        }
      } catch (error) {
        setErrors({ global: error.response?.data.message || 'An error occurred' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={`Wrapper ${isLogin ? 'login' : 'register'}`}>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>

          {errors.global && <span className="error-message">{errors.global}</span>}

          {!isLogin && (
            <div className="input-box">
              <input 
                type="text" 
                name="name" 
                placeholder='Name' 
                onChange={handleChange} 
                aria-label="Name"
              />
              <RiUserSharedFill className='icon' />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="input-box">
            <input 
              type="text" 
              name="username" 
              placeholder='Username' 
              onChange={handleChange} 
              aria-label="Username"
            />
            <FaUser className='icon' />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {!isLogin && (
            <div className="input-box">
              <input 
                type="email" 
                name="email" 
                placeholder='Email' 
                onChange={handleChange} 
                aria-label="Email"
              />
              <MdEmail className='icon' />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          )}

          <div className="input-box">
            <input 
              type="password" 
              name="password" 
              placeholder='Password' 
              onChange={handleChange} 
              aria-label="Password"
            />
            <FaLock className='icon' />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="remember-forgot">
              <label>
                <input type="checkbox" required />
                I agree to the terms and conditions
              </label>
            </div>
          )}

          <button type='submit' disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
          
          <div className="reg-link">
            <p>{isLogin 
              ? "If you don't have an account? " 
              : "Already have an account? "} 
              <Link to={isLogin ? '/register' : '/login'}>
                {isLogin ? 'Register' : 'Login'}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
