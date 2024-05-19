import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import {BASE_URL} from "./config"; // Import custom CSS file for styling

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Get the navigate function

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                email,
                password
            });
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('id', user?.id);
            localStorage.setItem('role', user?.role);
            navigate('/dashboard');

        } catch (error) {
            setError('Invalid email or password.'); // Display error for invalid credentials
        }
    };

    return (
        <Container className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <Form onSubmit={handleLogin}>
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
                    {error && <p className="error-message">{error}</p>}
                    <Button className='mt-2' variant="primary" type="submit">
                        Login
                    </Button>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>


                </Form>
            </div>
        </Container>
    );
}

export default LoginPage;
