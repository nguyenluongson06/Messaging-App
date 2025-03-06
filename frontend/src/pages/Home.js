import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <h1>Chào mừng đến với Messenger</h1>
      <Link to="/chat">
        <Button variant="primary" className="mt-3">Bắt đầu trò chuyện</Button>
      </Link>
    </Container>
  );
};

export default Home;
