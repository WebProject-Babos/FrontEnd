import PageView from "../PageView/PageView";
import { Container, Row, Col } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import "./HomePage.css";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function HomePage() {
  const authContext = useContext(AuthContext);
  const authToken = localStorage.getItem("Authorization");
  const [nickName, setNickName] = useState("");
  const [id, setId] = useState("");
  const { isLoggedIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfo = async () => {
    if (authContext) {
      await authContext.refreshToken();
    }
    try {
      setIsLoading(true);
      const userInfo = await axios.get(
        `${process.env.REACT_APP_API_URL}/members/me`,
        { headers: { Authorization: `${authToken}` } }
      );
      setNickName(userInfo.data.nickname);
      setId(userInfo.data.id);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  },[]);

  return (
    <PageView isLoading={isLoading}>
      <Container
        fluid
        className="justify-content-center align-items-center text-center"
        style={{ paddingTop: "100px" }}
      >
        <div>
          <Row>
            <Col style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  paddingLeft: window.innerWidth < 550 ? "5%" : 0,
                }}
              ></div>
            </Col>
          </Row>

          <div>
            <h1 className="display-5">
              <strong>PKU Community Project</strong>
            </h1>
            <p className="lead">@计算机网络与WEB基础 by 张晙优，朴乾浩</p>

            <figure className="text-center">
              <br></br>

              <p>
                <em>
                  This website is made as a course project for
                  计算机网络与WEB基础 2023
                </em>
                <br></br>
              </p>
              {isLoggedIn ? (
                <>
                  <Alert key="update" variant="success">
                    Welcome, <strong>{nickName}</strong>! <br></br>ID <strong>#{id}</strong> will be used as your identification for messaging functions.
                  </Alert>
                </>
              ) : (
                <>
                  <Alert key="update" variant="info">
                    Please <Alert.Link href="/login">Login</Alert.Link> to begin!
                  </Alert>
                </>
              )}

              <p>Supervised by 张岩</p>
            </figure>
          </div>
        </div>
      </Container>
    </PageView>
  );
}
