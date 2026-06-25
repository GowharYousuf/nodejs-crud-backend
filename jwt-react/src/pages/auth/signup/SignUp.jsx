import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
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

  const submitSignup = async () => {
    const endpoints = ['http://localhost:5000/user/signup', 'http://localhost:5000/user/register'];
    let lastErrorMessage = 'Signup failed';

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
        throw new Error(message || 'Signup failed');
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
      const result = await submitSignup();
      console.log('Signup successful:', result);
      setFormData({
        email: '',
        password: '',
        name: ''
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage(error.message || 'Unable to sign up right now');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form className='w-50 mx-auto mt-5' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

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
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
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
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
