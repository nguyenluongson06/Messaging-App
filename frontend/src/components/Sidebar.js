import React, { useState } from "react";
import { ListGroup, Image, Form } from "react-bootstrap";

const Sidebar = ({ setCurrentChat }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
    { name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
    { name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
    { name: "David", avatar: "https://i.pravatar.cc/40?img=4" },
    { name: "Emma", avatar: "https://i.pravatar.cc/40?img=5" },
    { name: "Frank", avatar: "https://i.pravatar.cc/40?img=6" },
    { name: "Grace", avatar: "https://i.pravatar.cc/40?img=7" },
    { name: "Henry", avatar: "https://i.pravatar.cc/40?img=8" }
  ];

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar">
      <h5>Trò chuyện</h5>

      {/* Ô tìm kiếm */}
      <Form.Control
        type="text"
        placeholder="Tìm kiếm..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Danh sách cuộc trò chuyện */}
      <ListGroup variant="flush">
        {filteredUsers.map((user, index) => (
          <ListGroup.Item
            key={index}
            className="user-item"
            onClick={() => setCurrentChat(user)}
          >
            <Image src={user.avatar} roundedCircle className="user-avatar" />
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
