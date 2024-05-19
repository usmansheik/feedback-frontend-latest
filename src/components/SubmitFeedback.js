import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SubmitFeedback = () => {
    const [formData, setFormData] = useState({
        rating: '',
        comment: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Submit Feedback</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit Feedback
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SubmitFeedback;
