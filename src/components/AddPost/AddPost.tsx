import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../contexts/AuthContext";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddPost() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
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
      title: postTitle,
      content: postContent,
    };

    axios
      .post(`${apiUrl}/posts`, data, { headers })
      .then((response) => {
        if (response.status === 201) {
          alert(`Successfully posted! Post ID: ${response.data}`);
          navigate(`/community`);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to post. Please try again.");
      });
  };

  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={8}>
            <h2 style={{ marginLeft: "14%" }}>Write new post</h2>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">Title</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              placeholder="Please Enter Title (Within 45 Chars)"
              aria-describedby="inputGroup-sizing-sm"
              value={postTitle}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPostTitle(event.target.value)
              }
              maxLength={45}
              required
            />
          </InputGroup>

          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text>Content</InputGroup.Text>
            <Form.Control
              as="textarea"
              placeholder="Please Enter Content (Within 255 Chars)"
              rows={4}
              value={postContent}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPostContent(event.target.value);
                setContentLength(event.target.value.length);
              }}
              maxLength={255}
              required
            />
          </InputGroup>
          <div
            className="text-end mr-4"
            style={{ width: "80%", margin: "0 auto" }}
          >
            {contentLength}/255
          </div>

          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button variant="success" type="submit">
              Post
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
