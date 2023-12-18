import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import HomePage from "./components/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import CommunityHome from "./components/CommunityHome/CommunityHome";
import AddPost from "./components/AddPost/AddPost";
import CommunityPostView from "./components/CommunityPostView/CommunityPostView";
import SignUp from "./components/SignUp/SignUp";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MessagesHome from "./components/MessagesHome/MessagesHome";
import SendMessage from "./components/SendMessage/SendMessage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/community" element={<ProtectedRoute><CommunityHome /></ProtectedRoute>} />
          <Route path="/community/addPost" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
          <Route path="/community/view/:postId" element={<ProtectedRoute><CommunityPostView /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesHome /></ProtectedRoute>} />
          <Route path="/messages/send" element={<ProtectedRoute><SendMessage /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
