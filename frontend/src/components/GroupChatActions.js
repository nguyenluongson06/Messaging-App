import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const GroupChatActions = ({ show, onHide, chat, currentUser, onUpdate }) => {
	const [groupName, setGroupName] = useState(chat?.name || '');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const isOwner = chat?.owner_id === currentUser?.id;

	const searchUsers = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/users/search?username=${searchQuery}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			// Filter out existing members
			setSearchResults(
				response.data.filter(
					(user) => !chat.members.some((member) => member.id === user.id),
				),
			);
		} catch (error) {
			console.error('Error searching users:', error);
		}
	};

	const updateGroupName = async () => {
		try {
			await axios.put(
				`http://localhost:3000/api/chats/${chat.id}`,
				{ name: groupName },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			onUpdate();
		} catch (error) {
			console.error('Error updating group name:', error);
		}
	};

	const addMember = async (userId) => {
		try {
			await axios.post(
				'http://localhost:3000/api/chats/add-member',
				{ group_id: chat.id, user_id: userId },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			onUpdate();
		} catch (error) {
			console.error('Error adding member:', error);
		}
	};

	const removeMember = async (userId) => {
		try {
			const response = await axios.post(
				'http://localhost:3000/api/chats/remove-member',
				{
					group_id: chat.id,
					user_id: userId,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
				},
			);

			if (response.data) {
				onUpdate();
				// If the removed user is the current user, close the modal
				if (userId === currentUser.id) {
					onHide();
				}
			}
		} catch (error) {
			console.error(
				'Error removing member:',
				error.response?.data || error.message,
			);
			alert(
				'Failed to remove member: ' +
					(error.response?.data?.message || 'Unknown error'),
			);
		}
	};

	const leaveGroup = async () => {
		try {
			await axios.post(
				'http://localhost:3000/api/chats/leave',
				{ group_id: chat.id },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			onUpdate();
			onHide();
		} catch (error) {
			console.error('Error leaving group:', error);
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Quản lý nhóm chat</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{isOwner && (
					<Form.Group className='mb-3'>
						<Form.Label>Tên nhóm</Form.Label>
						<div className='d-flex gap-2'>
							<Form.Control
								type='text'
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
							/>
							<Button onClick={updateGroupName}>Lưu</Button>
						</div>
					</Form.Group>
				)}

				{isOwner && (
					<>
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

						{searchResults.length > 0 && (
							<ListGroup className='mb-3'>
								{searchResults.map((user) => (
									<ListGroup.Item
										key={user.id}
										className='d-flex justify-content-between align-items-center'>
										{user.username}
										<Button size='sm' onClick={() => addMember(user.id)}>
											Thêm
										</Button>
									</ListGroup.Item>
								))}
							</ListGroup>
						)}
					</>
				)}

				<div className='mb-3'>
					<h6>Thành viên nhóm</h6>
					<ListGroup>
						{chat?.members.map((member) => (
							<ListGroup.Item
								key={member.id}
								className='d-flex justify-content-between align-items-center'>
								{member.username}
								{isOwner && member.id !== currentUser.id && (
									<Button
										variant='danger'
										size='sm'
										onClick={() => removeMember(member.id)}>
										Xóa
									</Button>
								)}
							</ListGroup.Item>
						))}
					</ListGroup>
				</div>

				{!isOwner && (
					<Button variant='danger' onClick={leaveGroup} className='w-100'>
						Rời nhóm
					</Button>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default GroupChatActions;
