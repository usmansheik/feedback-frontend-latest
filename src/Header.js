import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BASE_URL} from "./config";

function Header() {
    const navigate = useNavigate(); // Get the navigate function
    const axiosInstance = axios.create({
        baseURL: `${BASE_URL}`,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    const handleLogout = () => {
        // Clear localStorage
        localStorage.clear();
        navigate('/');
        console.log(localStorage.getItem("role"))

        // Make API call to logout
        axiosInstance.post('logout')
            .then(() => {
                // Redirect to login page
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };


    return (
        <Navbar bg="light" expand="lg">
            {/*<Navbar.Brand href="#">Your App</Navbar.Brand>*/}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
