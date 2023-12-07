import React, { useState, useEffect, useContext } from "react";
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
}

const apiUrl = process.env.REACT_APP_API_URL;

const commentColors = [
  "#91C8E4", //파
  "#EAC696", //갈
  "#C8E4B2", //초
  "#D8D9DA", //회
  "#FFE17B", //노
  "#DFCCFB", //보
  "#E19898", //핑
  "#33BBC5", //파
  "#A8DF8E", //초
  "#EBE76C", //겨
  "#5C5470", //짙회
  "#A6E3E9", //하
  "#E3FDFD", //연하
  "#A6B1E1", //연남
  "#d9e1fc",
  "#edd9f2",
  "#d9f2e5",
  "#FFD54F",
  "#A1887F",
  "#FFAB91",
  "#FFCC80",
  "#FFF176",
  "#DCE775",
  "#AED581",
  "#81C784",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
];

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

  const commentAuthorMap: { [key: string]: number } = {};

  const fetchPostAndComments = async () => {
    try {
      setIsLoading(true);
      const postResponse = await axios.get(`${apiUrl}/posts/${postId}`);
      setPost(postResponse.data.posts[0]);

      const commentsResponse = await axios.get(
        `${apiUrl}/posts/${postId}/comments`
      );
      setComments(commentsResponse.data.comments);

      setLikeCount(postResponse.data.posts[0].likeCount);
      setIsLiked(postResponse.data.posts[0].liked);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching post and comments:", error);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (authContext) {
      await authContext.refreshToken();
    }
    if (!authToken || !newComment.trim()) return;

    try {
      await axios.post(
        `${apiUrl}/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `${authToken}` } }
      );
      setNewComment("");
      fetchPostAndComments(); // Refresh comments
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
        { headers: { Authorization: `${authToken}` } }
      );
      alert("Success!");
      setLikeCount(response.data.likeCount);
      setIsLiked(response.data.liked);
      console.log(isLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const getCommentColor = (nickname: string) => {
    if (!(nickname in commentAuthorMap)) {
      commentAuthorMap[nickname] = Object.keys(commentAuthorMap).length;
    }
    return commentColors[commentAuthorMap[nickname] % commentColors.length];
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

        <div className={styles.commentForm}>
          <Form.Group className="mb-3" controlId="newComment">
            <Form.Control
              as="textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handlePostComment}>
            Post
          </Button>
        </div>

        {comments.map((comment) => (
          <div className={styles.commentCardContainer} key={comment.id}>
            <Card className={styles.commentCard}>
              <Card.Body>
                <Badge
                  style={{ backgroundColor: getCommentColor(comment.nickname) }}
                >
                  {comment.nickname}
                </Badge>
                {comment.content}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Container>
    </PageView>
  );
}
