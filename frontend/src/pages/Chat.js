import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Chat = ({ user }) => {
	const [currentChat, setCurrentChat] = useState(null);
	const navigate = useNavigate();

	// Add debug logging for user
	console.log('Chat component user:', user);

	// Improved validation
	if (!user || !user.id) {
		console.error('No valid user data:', user);
		localStorage.removeItem('user'); // Clear invalid user data
		localStorage.removeItem('token');
		return <Navigate to='/login' />;
	}

	return (
		<Container fluid className='chat-container'>
			<Row>
				<Col md={3}>
					<Sidebar setCurrentChat={setCurrentChat} user={user} />
				</Col>
				<Col md={9}>
					{currentChat ? (
						<ChatWindow
							user={user}
							currentChat={currentChat}
							key={currentChat.id} // Add key to force remount on chat change
						/>
					) : (
						<div className='d-flex justify-content-center align-items-center h-100'>
							<h4>Chọn một người để bắt đầu trò chuyện</h4>
						</div>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default Chat;
