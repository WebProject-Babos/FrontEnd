import PageView from "../PageView/PageView";
import { Container, Row, Col } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import "./HomePage.css";


export default function HomePage() {
  return (
    <PageView>
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

              <Alert key="update" variant="success">
                Please login to begin!
              </Alert>
              <p>Supervised by 张岩</p>
            </figure>
          </div>
        </div>
      </Container>
    </PageView>
  );
}
