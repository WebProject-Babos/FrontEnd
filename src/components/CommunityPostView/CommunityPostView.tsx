import React, { useState, useEffect, useContext, FormEvent } from "react";
import PageView from "../PageView/PageView";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import styles from "./communityPostView.module.css";
import { AuthContext } from "../../contexts/AuthContext";

interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  commentCount: number;
  likeCount: number;
  liked: boolean;
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
  color: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

export default function CommunityPostView() {
  const authToken = localStorage.getItem("Authorization");
  const authContext = useContext(AuthContext);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const postId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    if (authContext) {
      await authContext.refreshToken();
    }

    try {
      setIsLoading(true);

      // Fetch post data
      const postResponse = await axios.get(`${apiUrl}/posts/${postId}`);
      setPost(postResponse.data.posts[0]);

      // Fetch liked status
      const getLikedStatus = await axios.get(`${apiUrl}/posts/${postId}/like`, {
        headers: { Authorization: authToken },
      });
      setIsLiked(getLikedStatus.data.liked);

      // Fetch comments
      const commentsResponse = await axios.get(
        `${apiUrl}/posts/${postId}/comments`
      );
      setComments(commentsResponse.data.comments);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching post and comments:", error);
      setIsLoading(false);
    }
  };

  const handlePostComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (authContext) {
      await authContext.refreshToken();
    }
    if (!authToken || !newComment.trim()) return;

    try {
      await axios.post(
        `${apiUrl}/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: authToken } }
      );
      setNewComment("");
      alert("Success!");
      fetchPostAndComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLike = async () => {
    if (authContext) {
      await authContext.refreshToken();
    }
    if (!authToken) return;

    try {
      const response = await axios.put(
        `${apiUrl}/posts/${postId}/like`,
        {},
        { headers: { Authorization: authToken } }
      );
      alert("Success!");
      setLikeCount(response.data.likeCount);
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-start">
        {post && (
          <div className={styles.postCardContainer}>
            <Card className={styles.postCard}>
              <div className={styles.sharp}>#{post.id}</div>
              <Card.Body className="text-start">
                <Card.Title style={{ color: "#43A680", fontWeight: "800" }}>
                  {post.title}
                </Card.Title>
                <Card.Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    whiteSpace: "pre-line",
                    color: "#888893",
                    fontWeight: "600",
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <Button onClick={handleLike} className={styles.likeButton}>
                  {isLiked ? "Unlike" : "Like"}
                </Button>
                <div className={styles.likeComment}>
                  <img
                    src="/images/like.svg"
                    alt="likes-icon"
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <span>{likeCount}</span>

                  <img
                    src="/images/comments.svg"
                    alt="comments-icon"
                    style={{
                      marginLeft: "10px",
                      marginRight: "5px",
                      width: "15px",
                      height: "15px",
                    }}
                  />
                  <span>{post.commentCount}</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <form
            onSubmit={handlePostComment}
            style={{ width: "90%", display: "flex", alignItems: "center" }}
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flexGrow: 1,
                marginRight: "10px",
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                outline: "none",
                resize: "vertical",
                minHeight: "40px",
                lineHeight: "1.5",
                backgroundColor: "#f8f9fa",
              }}
            />
            <Button variant="success" type="submit" style={{ flexShrink: 0 }}>
              Post
            </Button>
          </form>
        </div>
        <br></br>
        {comments.map((comment) => (
          <div className={styles.commentCardContainer} key={comment.id}>
            <Card className={styles.commentCard}>
              <Card.Body>
                <Badge
                  bg={
                    comment.nickname === post?.nickname ? "success" : "primary"
                  }
                >
                  {comment.nickname}
                  {comment.nickname === post?.nickname ? " (Author)" : ""}
                </Badge>
                {` ${comment.content}`}
                <br></br>
                <br></br>
                {new Intl.DateTimeFormat("zh-CN", {
                  timeZone: "Asia/Shanghai",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(new Date(comment.createdAt))}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Container>
    </PageView>
  );
}
