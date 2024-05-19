import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterPage.css';
import {BASE_URL} from "./config"; // Import custom CSS file for styling

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Get the navigate function

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/register`, {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('id', user?.id);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessage = Object.values(error.response.data.errors).join(' ');
                setError(errorMessage);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Container className="register-container">
            <div className="register-form">
                <h2>Register</h2>
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {error && <p className="error-message">{error}</p>}

                    <Button className='mt-2' variant="primary" type="submit">
                        Register
                    </Button>
                    <p>Do you have an account? <Link to="/">Login</Link></p>

                </Form>
            </div>
        </Container>
    );
}

export default RegisterPage;
