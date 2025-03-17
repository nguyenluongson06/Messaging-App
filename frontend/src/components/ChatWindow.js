import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import Message from './Message';
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi';
import io from 'socket.io-client';
import axios from 'axios';

const ChatWindow = ({ user, currentChat }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [socket, setSocket] = useState(null);
	const messagesEndRef = useRef(null);

	// Add validation for currentChat
	useEffect(() => {
		if (!currentChat) {
			console.error('No chat selected');
			return;
		}
		console.log('Current chat:', currentChat);
	}, [currentChat]);

	// Initialize socket connection
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No token found');
			return;
		}

		const newSocket = io('http://localhost:3000', {
			auth: {
				token: token,
			},
			transports: ['websocket'],
			withCredentials: true,
		});

		newSocket.on('connect', () => {
			console.log('Socket connected successfully');
		});

		newSocket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		newSocket.on('error', (error) => {
			console.error('Socket error:', error);
		});

		setSocket(newSocket);

		return () => {
			if (newSocket) newSocket.disconnect();
		};
	}, []);

	// Handle chat room joining and message listening
	useEffect(() => {
		if (!socket || !currentChat) return;

		const roomId = `chat_${currentChat.id}`;
		console.log('Joining room:', roomId);
		socket.emit('joinRoom', roomId);

		const messageHandler = (message) => {
			console.log('Message handler - Current user:', {
				userId: user.id,
				messageFrom: message.sender_id,
			});

			const messageWithSender = {
				...message,
				sender_name: message.sender_name || 'Unknown',
			};
			setMessages((prev) => [...prev, messageWithSender]);
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		};

		socket.on('message', messageHandler);

		// Fetch messages
		const fetchMessages = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/api/messages/${currentChat.id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					},
				);
				console.log('Fetched messages:', response.data);
				setMessages(response.data);
			} catch (error) {
				console.error('Error fetching messages:', error);
			}
		};
		fetchMessages();

		return () => {
			socket.emit('leaveRoom', roomId);
			socket.off('message', messageHandler);
		};
	}, [currentChat, socket, user.id]); // Added user.id to dependencies

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (input.trim() === '' || !socket || !currentChat) return;

		const messageData = {
			chatId: currentChat.id,
			content: input.trim(),
		};

		socket.emit('sendMessage', messageData);
		setInput('');
	};

	return (
		<div className='chat-container'>
			<div className='chat-header'>
				<div className='chat-user-info'>
					<Image
						src='https://tse2.mm.bing.net/th?id=OIP.Siu7xzx1R99lF07TMTwafQHaHR&pid=Api&P=0&h=180'
						roundedCircle
						className='chat-user-avatar'
					/>
					<span className='chat-user-name'>
						{currentChat?.username || currentChat?.name || 'Chat'}
					</span>
				</div>
				<div className='chat-actions'>
					<button className='icon-btn'>
						<FiPhone />
					</button>
					<button className='icon-btn'>
						<FiVideo />
					</button>
					<button className='icon-btn'>
						<FiInfo />
					</button>
				</div>
			</div>

			<div className='chat-box'>
				<div className='messages'>
					{messages.map((msg, index) => {
						console.log('Rendering message:', {
							messageId: msg.id,
							senderId: msg.sender_id,
							currentUserId: user.id,
						});

						return (
							<Message
								key={msg.id || index}
								text={msg.content}
								sender={msg.sender_name}
								timestamp={msg.created_at}
								currentUserId={user.id}
								senderId={msg.sender_id}
							/>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
				<Form className='input-area' onSubmit={sendMessage}>
					<Form.Control
						type='text'
						placeholder='Nhập tin nhắn...'
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button type='submit' variant='primary'>
						Gửi
					</Button>
				</Form>
			</div>
		</div>
	);
};

export default ChatWindow;
