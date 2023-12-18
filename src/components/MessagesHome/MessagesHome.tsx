import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import "./MessagesHome.css";
import PageView from "../PageView/PageView";
import { AuthContext } from "../../contexts/AuthContext";

interface Message {
  id: number;
  senderNickname: string;
  receiverNickname: string;
  content: string;
  date: string;
}

const MessagesHome = () => {
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [showSent, setShowSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);

  const fetchMessages = async () => {
    if (authContext) {
      await authContext.refreshToken();
    }
    try {
      // Fetch sent messages
      const sentResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/me/send`,
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
      const sortedSentMessages = sentResponse.data.messages.sort(
        (a: Message, b: Message) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSentMessages(sortedSentMessages);

      // Fetch received messages
      const receivedResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/me/receive`,
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
      const sortedReceivedMessages = receivedResponse.data.messages.sort(
        (a: Message, b: Message) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setReceivedMessages(sortedReceivedMessages);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <PageView isLoading={isLoading}>
      <div className="messages-home">
        <div className="header-container">
          <h2>{showSent ? "Sent Messages" : "Received Messages"}</h2>
          <Button
            href="/messages/send"
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
            Send New Message
          </Button>
        </div>
        <br></br>
        <div className="toggle-button-container">
          <button
            className="toggle-button"
            onClick={() => setShowSent(!showSent)}
          >
            {showSent ? "Show Received Messages" : "Show Sent Messages"}
          </button>
        </div>

        <div className="messages-list">
          {(showSent ? sentMessages : receivedMessages).map((message) => (
            <Card key={message.id} className="message-card">
              <Card.Body>
                <Card.Title>
                  {showSent
                    ? "To: " + message.receiverNickname
                    : "From: " + message.senderNickname}
                </Card.Title>
                <Card.Text>{message.content}</Card.Text>
                <Card.Footer>
                  <small className="text-muted">
                    {new Intl.DateTimeFormat("zh-CN", {
                      timeZone: "Asia/Shanghai",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(message.date))}
                  </small>
                </Card.Footer>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </PageView>
  );
};

export default MessagesHome;
