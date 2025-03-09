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
    { name: "Frank", avatar: "https://i.pravatar.cc/40?img=6" },
    { name: "Grace", avatar: "https://i.pravatar.cc/40?img=7" },
    { name: "Henry", avatar: "https://i.pravatar.cc/40?img=8" },
    { name: "Mark", avatar: "https://i.pravatar.cc/40?img=9" },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý chọn thành viên
  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.name === user.name)
        ? prev.filter((u) => u.name !== user.name)
        : [...prev, user]
    );
  };

  // Tạo nhóm
  const handleCreateGroup = () => {
    if (selectedUsers.length >= 2 && groupName.trim() !== "") {
      const newGroup = {
        name: groupName, // Dùng tên nhóm do người dùng nhập
        avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Avatar nhóm mặc định
        members: selectedUsers
      };
      setChats([...chats, newGroup]); // Thêm nhóm vào danh sách chat
      setCurrentChat(newGroup); // Mở nhóm ngay khi tạo
      setShowModal(false);
      setSelectedUsers([]); // Reset danh sách chọn
      setGroupName(""); // Reset ô nhập tên nhóm
    } else {
      alert("Cần chọn ít nhất 2 người và đặt tên nhóm!");
    }
  };

  <div className="current-user">
  <Image src="https://i.pravatar.cc/50" roundedCircle className="current-user-avatar" />
  <div className="current-user-info">
    <span className="current-user-name">Người dùng</span>
    <span className="current-user-status">Hoạt động 32 phút trước</span>
  </div>
</div>

  return (
    <div className="sidebar">
      <h5>Trò chuyện</h5>

      {/* Thanh tìm kiếm & Nút + Nhóm */}
      <div className="search-group">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="success" className="add-group-btn" onClick={() => setShowModal(true)}>+</Button>
      </div>

      {/* Danh sách cuộc trò chuyện */}
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

      {/* Modal tạo nhóm */}
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
