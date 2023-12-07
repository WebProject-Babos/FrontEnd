import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import PageView from "../PageView/PageView";
import styles from "./Community.module.css";

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  commentCount: number;
  likeCount: number;
}

const apiUrl = process.env.REACT_APP_API_URL;

export default function CommunityHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}/posts/all`);
        console.log(response.data);

        const fetchedPosts = response.data.posts as Post[];
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-start">
        <div
          className="d-flex flex-wrap align-items-left"
          style={{ marginLeft: "7%" }}
        >
          <h2>Community</h2>
          <Button
            href="/community/addPost"
            className="my-auto align-self-center"
            variant="success"
            size="sm"
            style={{
              marginLeft: "20px",
              backgroundColor: "#43A680",
              borderColor: "#43A680",
            }}
          >
            <img
              src="/images/plus.svg"
              className="bi"
              width="23"
              height="23"
              alt="add-icon"
            />
            New Post
          </Button>
        </div>

        <div className={styles.communityContainer}>
          <div className={styles.groupReviews}>
            {posts.map((post) => (
              <div className={styles.cardContainer} key={post.id}>
                <Link
                  to={`/community/view/${post.id}`}
                  key={post.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className={styles.card}>
                    <div className={styles.sharp}>#{post.id}</div>
                    <Card.Body className="text-start">
                      <Card.Title
                        style={{ color: "#43A680", fontWeight: "800" }}
                      >
                        {post.title}
                      </Card.Title>
                      <Card.Text
                        style={{
                          height: "4.8em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "3",
                          WebkitBoxOrient: "vertical",
                          whiteSpace: "pre-line",
                          color: "#888893",
                          fontWeight: "600",
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      ></Card.Text>
                      <div className={styles.likeComment}>
                        <img
                          src="../images/like.svg"
                          alt="likes-icon"
                          style={{
                            marginRight: "5px",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        <span>{post.likeCount}</span>{" "}
                        <img
                          src="../images/comments.svg"
                          alt="comments-icon"
                          style={{
                            marginLeft: "10px",
                            marginRight: "5px",
                            width: "15px",
                            height: "15px",
                          }}
                        />
                        <span>{post.commentCount}</span>{" "}
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </PageView>
  );
}
