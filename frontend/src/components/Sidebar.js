import React, { useState } from "react";
import { ListGroup, Image, Form, Button, Modal } from "react-bootstrap";

const Sidebar = ({ setCurrentChat }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(""); // Thêm state cho tên nhóm
  const [chats, setChats] = useState([]); // Lưu danh sách chat
  

  const users = [
    { name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
    { name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
    { name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
    { name: "David", avatar: "https://i.pravatar.cc/40?img=4" },
    { name: "Emma", avatar: "https://i.pravatar.cc/40?img=5" },
    { name: "Frank", avatar: "https://i.pravatar.cc/40?img=9" },
    { name: "Grace", avatar: "https://i.pravatar.cc/40?img=7" },
    { name: "Henry", avatar: "https://i.pravatar.cc/40?img=8" },
    { name: "Mark", avatar: "https://i.pravatar.cc/40?img=17" },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.name === user.name)
        ? prev.filter((u) => u.name !== user.name)
        : [...prev, user]
    );
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length >= 2 && groupName.trim() !== "") {
      const newGroup = {
        name: groupName,
        avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        members: selectedUsers
      };
      setChats([...chats, newGroup]);
      setCurrentChat(newGroup);
      setShowModal(false);
      setSelectedUsers([]);
      setGroupName("");
    } else {
      alert("Cần chọn ít nhất 2 người và đặt tên nhóm!");
    }
  };

  return (
    <div className="sidebar">
      <h5>Trò chuyện</h5>

      <div className="search-group">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="success" className="add-group-btn" onClick={() => setShowModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-plus">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M20 8v6"></path>
            <path d="M23 11h-6"></path>
            <path d="M17 11h6"></path>
          </svg>
        </Button>
      </div>

      <ListGroup variant="flush">
        {chats.map((chat, index) => (
          <ListGroup.Item key={index} className="user-item" onClick={() => setCurrentChat(chat)}>
            <Image src={chat.avatar} roundedCircle className="user-avatar" />
            {chat.name}
          </ListGroup.Item>
        ))}
        {filteredUsers.map((user, index) => (
          <ListGroup.Item key={index} className="user-item" onClick={() => setCurrentChat(user)}>
            <Image src={user.avatar} roundedCircle className="user-avatar" />
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo nhóm chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Nhập tên nhóm..."
            className="mb-3"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <ListGroup>
            {users.map((user, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleSelectUser(user)}
                style={{
                  cursor: "pointer",
                  background: selectedUsers.some((u) => u.name === user.name) ? "#d3f9d8" : "white"
                }}
              >
                <Image src={user.avatar} roundedCircle className="user-avatar" />
                {user.name} {selectedUsers.some((u) => u.name === user.name) ? "✅" : ""}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleCreateGroup}>Tạo nhóm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
