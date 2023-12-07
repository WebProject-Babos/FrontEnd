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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/community" element={<CommunityHome />} />
          <Route path="/community/addPost" element={<AddPost />} />
          <Route path="/community/view/:postId" element={<CommunityPostView />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
