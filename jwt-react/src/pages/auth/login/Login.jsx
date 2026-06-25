import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const parseResponseBody = async (response) => {
    const rawBody = await response.text();

    if (!rawBody) {
      return { data: null, message: '' };
    }

    try {
      const parsedBody = JSON.parse(rawBody);
      return {
        data: parsedBody,
        message: parsedBody.message || rawBody
      };
    } catch (error) {
      return {
        data: null,
        message: rawBody
      };
    }
  };

  const submitLogin = async () => {
    const endpoints = ['http://localhost:5000/user/login'];
    let lastErrorMessage = 'Login failed';

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const { data, message } = await parseResponseBody(response);

      if (response.ok) {
        return data;
      }

      if (response.status !== 404) {
        throw new Error(message || 'Login failed');
      }

      lastErrorMessage = message || lastErrorMessage;
    }

    throw new Error(lastErrorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await submitLogin();
      console.log('Login successful:', result);

      if (result?.token) {
        localStorage.setItem('token', result.token);
      }

      if (result?.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        onLogin?.(result.user);
      }

      setFormData({
        email: '',
        password: '',
        name: ''
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.message || 'Unable to log in right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form className='w-50 mx-auto mt-5' onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="dark" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
