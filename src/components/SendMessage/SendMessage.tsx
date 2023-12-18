import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import PageView from "../PageView/PageView";
import { AuthContext } from "../../contexts/AuthContext";

const apiUrl = process.env.REACT_APP_API_URL;

export default function SendMessage() {
  const [receiverId, setReceiverId] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authContext) {
      await authContext.refreshToken();
    }

    const authToken = localStorage.getItem("Authorization");
    const headers = {
      Authorization: authToken,
    };

    const data = {
      receiverId: parseInt(receiverId),
      content: messageContent,
    };

    axios
      .post(`${apiUrl}/messages/send`, data, { headers })
      .then((response) => {
        if (response.status === 201) {
          alert(`Message sent successfully! Message ID: ${response.data}`);
          navigate(`/messages`);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send the message. Please try again.");
      });
  };

  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={12}>
            <h2 className="text-center mt-4 mb-4">Send Message</h2>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginBottom: "30px" }}
          >
            <InputGroup.Text>Receiver ID</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="Enter receiver's ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%" }}
          >
            <InputGroup.Text>Message</InputGroup.Text>
            <Form.Control
              as="textarea"
              placeholder="Write your message here (500 characters max)"
              rows={4}
              value={messageContent}
              onChange={(e) => {
                setMessageContent(e.target.value);
                setContentLength(e.target.value.length);
              }}
              maxLength={500}
              required
            />
          </InputGroup>
          <div className="text-end" style={{ width: "80%", margin: "0 auto" }}>
            {contentLength}/500
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="success" type="submit">
              Send Message
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
