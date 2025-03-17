import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = ({ user }) => {
	const [currentChat, setCurrentChat] = useState(null);
	const navigate = useNavigate();

	if (!user || !user.id) {
		console.error('No valid user data:', user);
		localStorage.removeItem('user');
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
							setCurrentChat={setCurrentChat}
							key={currentChat.id}
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
