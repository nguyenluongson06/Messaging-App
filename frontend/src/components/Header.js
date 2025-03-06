import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" className="px-3">
      <Navbar.Brand>Messenger</Navbar.Brand>
      <Nav className="ms-auto">
        <Dropdown>
        <Dropdown.Toggle variant="link" id="avatar-dropdown" className="avatar-btn" caret={false}>
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.Siu7xzx1R99lF07TMTwafQHaHR&pid=Api&P=0&h=180" // Thay ảnh avatar tại đây
              alt="Avatar"
              className="avatar-img"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="avatar.html">Hồ sơ</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;
