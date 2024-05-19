import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from "../Header";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../config";

function AdminFeedback() {

    const navigate = useNavigate(); // Get the navigate function
    const [feedbackData, setFeedbackData] = useState([]);
    const apiToken = localStorage.getItem('token');

    useEffect(() => {
        fetchFeedbackData();
    }, []);

    const axiosInstance = axios.create({
        baseURL: `${BASE_URL}`,
        headers: {
            'Authorization': 'Bearer ' + apiToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const fetchFeedbackData = async () => {
        try {
            const response = await axiosInstance.get('admin/feedback');
            setFeedbackData(response.data);
        } catch (error) {
            if(error.response.status==401){
                localStorage.clear();
                navigate('/');
            }
            console.error('Error fetching feedback data:', error);
        }
    };

    const handleResponseChange = (feedbackId, newResponse) => {
        setFeedbackData(prevFeedbackData =>
            prevFeedbackData.map(feedback =>
                feedback.id === feedbackId ? { ...feedback, response: newResponse } : feedback
            )
        );
    };

    const handleResponseSubmit = async (feedbackId) => {
        const feedback = feedbackData.find(item => item.id === feedbackId);
        try {
            await axiosInstance.post(`admin/feedback/${feedbackId}/response`, { response: feedback.response });
            fetchFeedbackData()
        } catch (error) {
            if(error.response.status==401){
                localStorage.clear();
                navigate('/');
            }
            console.error('Error responding to feedback:', error);
        }
    };
    const handleStatusToggle = async (feedbackId, currentStatus) => {
        try {
            await axiosInstance.put(`admin/toggle-feedback/${feedbackId}`, { status: !currentStatus });
            fetchFeedbackData();
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate('/');
            }
            console.error('Error toggling feedback status:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="mt-4">Admin Feedback</h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer ID</th>
                        <th>Product ID</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Response</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {feedbackData.map((feedback) => (
                        <tr key={feedback.id}>
                            <td>{feedback.id}</td>
                            <td>{feedback.customer_id}</td>
                            <td>{feedback.product_id}</td>
                            <td>{feedback.rating}</td>
                            <td>{feedback.comment}</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={feedback.response}
                                    onChange={(e) => handleResponseChange(feedback.id, e.target.value)}
                                />
                            </td>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    id={`status-checkbox-${feedback.id}`}
                                    checked={feedback.status}
                                    onChange={() => handleStatusToggle(feedback.id, feedback.status)}
                                    label={feedback.status ? 'Active' : 'Inactive'}
                                />
                            </td>

                            <td>
                                <Button onClick={() => handleResponseSubmit(feedback.id)}>
                                    Save Response
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default AdminFeedback;
