import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import {BASE_URL} from "../config";

function ViewProducts() {
    const navigate = useNavigate(); // Get the navigate function

    const [products, setProducts] = useState([]);
    const [feedback, setFeedback] = useState({
        productId: '',
        rating: '',
        comment: '',
    });
    const apiToken=localStorage.getItem('token');
    const userId=localStorage.getItem('id');
    useEffect(() => {
        fetchProducts();
    }, []);
    const axiosInstance = axios.create({
        baseURL: `${BASE_URL}`,
        headers: {
            'Authorization': 'Bearer ' + apiToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('product');
            console.log(response)
            if (response.data.error === "Unauthorized.") {
                localStorage.clear();
                navigate('/');
                return
            }
            var res_products = response.data.products;
            res_products.map((product) => {
                product?.feedbacks.map((feedback) => {
                    if(feedback?.customer?.user_id == parseInt(userId)){
                        product.feedbackProvided = true;
                    }
                })
            })
            setProducts(res_products);
        } catch (error) {
            if(error.response.status == 401){
                localStorage.clear();
                navigate('/');
            }
            console.error('Error fetching products:', error.response.status);
        }
    };

    const submitFeedback = async (productId) => {
        try {
            await axiosInstance.post('feedback', {
                product_id: productId,
                rating: feedback.rating,
                comment: feedback.comment
            });
            // Feedback submitted successfully, fetch products again
            fetchProducts();
        } catch (error) {
            if(error.response.status==401){
                localStorage.clear();
                navigate('/');
            }
            if (error.response && error.response.data.error === "Unauthorized.") {
                localStorage.clear();
                navigate('/');
                return
            }

            console.error('Error submitting feedback:', error);
        }
    };

    // Function to handle changes in feedback form fields
    const handleFeedbackChange = (e) => {
        setFeedback({ ...feedback, [e.target?.name]: e.target.value });
    };

    const feedbackForm = (feedback, product) => {
        if (product?.feedbackProvided){
            return false
        }
        return <Form>
            <Form.Group>
                <Form.Control
                    as="select"
                    name="rating"
                    className="mt-2"
                    value={feedback?.rating}
                    onChange={handleFeedbackChange}
                >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Control
                    as="textarea"
                    className="mt-2"
                    rows={3}
                    placeholder="Enter your feedback"
                    name="comment"
                    value={feedback?.comment}
                    onChange={handleFeedbackChange}
                />
            </Form.Group>
            <Button
                variant="primary"
                className="mt-2"
                onClick={() => {
                    setFeedback({ ...feedback, productId: product.id });
                    submitFeedback(product.id);
                }}
            >
                Submit Feedback
            </Button>
        </Form>
    }

    return (
        <div>
        <Header/>

        <Container className="py-4">
            <h1 className="mb-4">Products</h1>
            <Row>
                {products?.map((product) => (
                    <Col key={product.id} md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title><p>Product Name:</p>{product?.name}</Card.Title>
                                <Card.Text><b><p>Description:</p></b> {product?.description}</Card.Text>
                                <Card.Text><b>Price:</b> ${product?.price}</Card.Text>

                                {product?.feedbacks?.length > 0 && (
                                    <div className="mb-3">
                                        <h6>Feedbacks:</h6>
                                        <ul className="list-unstyled">
                                            {product.feedbacks.map((feedback) => (
                                                <li key={feedback.id}>
                                                    <strong>{feedback.customer?.name}:</strong> {feedback.comment} (Rating: {feedback.rating})
                                                    {feedback?.response && (
                                                        <p><strong>Admin Response:</strong> {feedback.response}</p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                    <>
                                    {
                                        product?.feedbacks?.length > 0 ? (product.feedbacks.map((feedback) => (
                                            feedbackForm({}, product)
                                        ))) : feedbackForm({}, product)
                                    }

                                    </>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    );
}

export default ViewProducts;
