import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Chat = () => {
	const [currentChat, setCurrentChat] = useState(null);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('user'); // Xóa thông tin user
		navigate('/login'); // Quay lại trang đăng nhập
	};

	return (
		<>
			<Container fluid className='chat-container'>
				<Row>
					<Col md={3}>
						<Sidebar setCurrentChat={setCurrentChat} />
					</Col>
					<Col md={9}>
						{currentChat ? (
							<ChatWindow user={currentChat} />
						) : (
							<div className='d-flex justify-content-center align-items-center h-100'>
								<h4>Chọn một người để bắt đầu trò chuyện</h4>
							</div>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Chat;
