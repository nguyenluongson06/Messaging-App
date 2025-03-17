import React, { useState, useEffect } from 'react';
import { ListGroup, Image, Form, Button, Modal, Toast } from 'react-bootstrap';
import { createChatGroup, addMember } from '../chatService';
import axios from 'axios';
import io from 'socket.io-client';

const Sidebar = ({ setCurrentChat, user }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState('');
	const [chats, setChats] = useState([]);
	const [friends, setFriends] = useState([]);
	const [socket, setSocket] = useState(null);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	// Initialize socket connection
	useEffect(() => {
		const newSocket = io('http://localhost:3000', {
			auth: {
				token: localStorage.getItem('token'),
			},
		});

		newSocket.on('connect', () => {
			console.log('Socket connected');
		});

		newSocket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		// Listen for friend additions
		newSocket.on('friendAdded', (data) => {
			console.log('Friend added event received:', data);
			setToastMessage(data.message);
			setShowToast(true);
			fetchFriends(); // Refresh friends list
		});

		// Add listener for new chat groups
		newSocket.on('chatGroupCreated', (chatGroup) => {
			setChats((prev) => [...prev, chatGroup]);
		});

		// Add listener for chat group updates
		newSocket.on('chatGroupUpdated', (updatedGroup) => {
			setChats((prev) =>
				prev.map((chat) => (chat.id === updatedGroup.id ? updatedGroup : chat)),
			);
		});

		setSocket(newSocket);

		// Cleanup on unmount
		return () => newSocket.disconnect();
	}, []);

	// Fetch all chats (groups and direct messages)
	const fetchChats = async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/chats', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			console.log('Fetched chats:', response.data);
			setChats(response.data);
		} catch (error) {
			console.error('Error fetching chats:', error);
		}
	};

	// Fetch friends list
	const fetchFriends = async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/friends', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
			console.log('Fetched friends:', response.data);
			setFriends(response.data);
		} catch (error) {
			console.error('Error fetching friends:', error);
		}
	};

	useEffect(() => {
		fetchChats();
		fetchFriends();
		const interval = setInterval(() => {
			fetchChats();
			fetchFriends();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		fetchChats();
		const interval = setInterval(fetchChats, 10000); // Refresh every 10 seconds
		return () => clearInterval(interval);
	}, []);

	const handleSelectUser = (user) => {
		setSelectedUsers((prev) =>
			prev.some((u) => u.id === user.id)
				? prev.filter((u) => u.id !== user.id)
				: [...prev, user],
		);
	};

	const handleCreateGroup = async () => {
		try {
			if (selectedUsers.length < 2 || !groupName.trim()) {
				alert('Please select at least two users and enter a group name');
				return;
			}

			const response = await axios.post(
				'http://localhost:3000/api/chats/create',
				{
					name: groupName.trim(),
					type: 'group',
					members: selectedUsers.map((u) => u.id),
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);

			setChats((prev) => [...prev, response.data]);
			setCurrentChat(response.data);
			setShowModal(false);
			setSelectedUsers([]);
			setGroupName('');
		} catch (error) {
			console.error('Error creating group:', error);
			alert('Failed to create group');
		}
	};

	const handleSelectFriend = async (friend) => {
		try {
			// Check if direct chat exists
			let existingChat = chats.find(
				(chat) =>
					chat.type === 'direct' &&
					chat.members.some((m) => m.id === friend.id),
			);

			if (!existingChat) {
				// Create new direct message group
				const response = await axios.post(
					'http://localhost:3000/api/chats/create',
					{
						name: [user.username, friend.username].sort().join(', '),
						type: 'direct',
						members: [friend.id],
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					},
				);
				existingChat = response.data;
				setChats((prev) => [
					...prev.filter((c) => c.id !== existingChat.id),
					existingChat,
				]);
			}

			setCurrentChat(existingChat);
		} catch (error) {
			console.error('Error creating/fetching direct chat:', error);
		}
	};

	// Add search users function
	const searchUsers = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/users/search?username=${searchQuery}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			setSearchResults(response.data.filter((u) => u.id !== user.id));
		} catch (error) {
			console.error('Error searching users:', error);
		}
	};

	// Add handler for selecting users
	const handleAddToGroup = (selectedUser) => {
		if (!selectedUsers.find((u) => u.id === selectedUser.id)) {
			setSelectedUsers([...selectedUsers, selectedUser]);
		}
	};

	// Add handler for removing selected users
	const handleRemoveFromGroup = (userId) => {
		setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
	};

	// Update the group creation modal
	const renderGroupCreationModal = () => (
		<Modal
			show={showModal}
			onHide={() => {
				setShowModal(false);
				setSelectedUsers([]);
				setGroupName('');
				setSearchQuery('');
				setSearchResults([]);
			}}>
			<Modal.Header closeButton>
				<Modal.Title>Tạo nhóm chat mới</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className='mb-3'>
					<Form.Label>Tên nhóm</Form.Label>
					<Form.Control
						type='text'
						placeholder='Nhập tên nhóm...'
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className='mb-3'>
					<Form.Label>Thêm thành viên</Form.Label>
					<div className='d-flex gap-2'>
						<Form.Control
							type='text'
							placeholder='Tìm kiếm theo tên...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button onClick={searchUsers}>Tìm</Button>
					</div>
				</Form.Group>

				{/* Selected users display */}
				{selectedUsers.length > 0 && (
					<div className='selected-users mb-3'>
						<small className='text-muted'>Thành viên đã chọn:</small>
						<div className='d-flex flex-wrap gap-2 mt-2'>
							{selectedUsers.map((user) => (
								<span
									key={user.id}
									className='badge bg-primary d-flex align-items-center gap-2'>
									{user.username}
									<button
										type='button'
										className='btn-close btn-close-white'
										onClick={() => handleRemoveFromGroup(user.id)}
									/>
								</span>
							))}
						</div>
					</div>
				)}

				{/* Search results */}
				{searchResults.length > 0 && (
					<ListGroup className='mt-3'>
						{searchResults.map((user) => (
							<ListGroup.Item
								key={user.id}
								className='d-flex justify-content-between align-items-center'>
								<span>{user.username}</span>
								<Button
									size='sm'
									onClick={() => handleAddToGroup(user)}
									disabled={selectedUsers.some((u) => u.id === user.id)}>
									{selectedUsers.some((u) => u.id === user.id)
										? 'Đã thêm'
										: 'Thêm vào nhóm'}
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => setShowModal(false)}>
					Hủy
				</Button>
				<Button
					variant='primary'
					onClick={handleCreateGroup}
					disabled={!groupName.trim() || selectedUsers.length === 0}>
					Tạo nhóm
				</Button>
			</Modal.Footer>
		</Modal>
	);

	return (
		<div className='sidebar'>
			<div className='d-flex justify-content-between align-items-center mb-3'>
				<h5 className='mb-0'>Trò chuyện</h5>
				<Button variant='primary' size='sm' onClick={() => setShowModal(true)}>
					Tạo nhóm
				</Button>
			</div>

			<ListGroup>
				{chats.map((chat) => (
					<ListGroup.Item
						key={chat.id}
						action
						onClick={() => setCurrentChat(chat)}
						className='d-flex align-items-center'>
						<Image
							src={chat.avatar || 'default-avatar.png'}
							roundedCircle
							className='mr-2'
							style={{ width: '40px', height: '40px' }}
						/>
						<div>
							<div>{chat.name}</div>
							<small className='text-muted'>
								{chat.type === 'group' ? `${chat.members.length} members` : ''}
							</small>
						</div>
					</ListGroup.Item>
				))}
			</ListGroup>

			{renderGroupCreationModal()}

			{/* Toast notification */}
			<Toast
				show={showToast}
				onClose={() => setShowToast(false)}
				style={{
					position: 'fixed',
					top: 20,
					right: 20,
					zIndex: 1000,
				}}
				delay={3000}
				autohide>
				<Toast.Header>
					<strong className='me-auto'>Chat Update</strong>
				</Toast.Header>
				<Toast.Body>{toastMessage}</Toast.Body>
			</Toast>
		</div>
	);
};

export default Sidebar;
