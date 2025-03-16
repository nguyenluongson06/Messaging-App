import React, { useState, useEffect } from 'react';
import { ListGroup, Image, Form, Button, Modal } from 'react-bootstrap';
import { createChatGroup, addMember } from '../chatService';
import axios from 'axios';

const Sidebar = ({ setCurrentChat }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState('');
	const [chats, setChats] = useState([]);
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await axios.get('http://localhost:3000/friends', {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
				setFriends(response.data);
			} catch (error) {
				console.error('Error fetching friends:', error.response.data);
			}
		};

		fetchFriends();
	}, []);

	const handleSelectUser = (user) => {
		setSelectedUsers((prev) =>
			prev.some((u) => u.id === user.id)
				? prev.filter((u) => u.id !== user.id)
				: [...prev, user],
		);
	};

	const handleCreateGroup = async () => {
		if (selectedUsers.length >= 2 && groupName.trim() !== '') {
			const token = localStorage.getItem('token');
			const newGroup = await createChatGroup(groupName, '', token);
			selectedUsers.forEach(async (user) => {
				await addMember(newGroup.id, user.id, token);
			});
			setChats([...chats, newGroup]);
			setCurrentChat(newGroup);
			setShowModal(false);
			setSelectedUsers([]);
			setGroupName('');
		} else {
			alert('Cần chọn ít nhất 2 người và đặt tên nhóm!');
		}
	};

	return (
		<div className='sidebar'>
			<h5>Trò chuyện</h5>

			<div className='search-group'>
				<Form.Control
					type='text'
					placeholder='Tìm kiếm...'
					className='search-bar'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button
					variant='success'
					className='add-group-btn'
					onClick={() => setShowModal(true)}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='28'
						height='28'
						viewBox='0 0 24 24'
						fill='none'
						stroke='white'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='lucide lucide-users-plus'>
						<path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
						<circle cx='9' cy='7' r='4'></circle>
						<path d='M20 8v6'></path>
					</svg>
				</Button>
			</div>

			<ListGroup variant='flush'>
				{chats.map((chat, index) => (
					<ListGroup.Item
						key={index}
						className='user-item'
						onClick={() => setCurrentChat(chat)}>
						<Image src={chat.avatar} roundedCircle className='user-avatar' />
						{chat.name}
					</ListGroup.Item>
				))}
				{friends.map((friend, index) => (
					<ListGroup.Item
						key={index}
						className='user-item'
						onClick={() => setCurrentChat(friend)}>
						<Image src={friend.avatar} roundedCircle className='user-avatar' />
						{friend.username}
					</ListGroup.Item>
				))}
			</ListGroup>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Tạo nhóm chat</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Control
						type='text'
						placeholder='Nhập tên nhóm...'
						className='mb-3'
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
					/>
					<ListGroup>
						{friends.map((friend, index) => (
							<ListGroup.Item
								key={index}
								onClick={() => handleSelectUser(friend)}
								style={{
									cursor: 'pointer',
									background: selectedUsers.some((u) => u.id === friend.id)
										? '#d3f9d8'
										: 'white',
								}}>
								<Image
									src={friend.avatar}
									roundedCircle
									className='user-avatar'
								/>
								{friend.username}{' '}
								{selectedUsers.some((u) => u.id === friend.id) ? '✅' : ''}
							</ListGroup.Item>
						))}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setShowModal(false)}>
						Hủy
					</Button>
					<Button variant='primary' onClick={handleCreateGroup}>
						Tạo nhóm
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Sidebar;
