import React, { useState } from 'react';
import {
	Navbar,
	Nav,
	Dropdown,
	Button,
	Modal,
	Form,
	FormControl,
	ListGroup,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authService';
import axios from 'axios';

const Header = ({ user }) => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			navigate('/login');
			window.location.reload();
		} catch (error) {
			console.error('Logout failed:', error.response.data);
			alert(
				'Logout failed: ' + error.response.data.error.errorMessage.join(', '),
			);
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.get(
				`http://localhost:3000/api/auth/find?query=${searchTerm}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			setSearchResults(response.data);
		} catch (error) {
			console.error('Search failed:', error.response.data);
			alert('Search failed: ' + error.response.data.message);
		}
	};

	const handleAddFriend = async (friendId) => {
		try {
			await axios.post(
				'http://localhost:3000/api/friends',
				{ friendId },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				},
			);
			alert('Friend added successfully');
			setShowModal(false); // Close the search modal
		} catch (error) {
			console.error('Add friend failed:', error);
			alert(
				'Failed to add friend: ' +
					(error.response?.data?.message || error.message),
			);
		}
	};

	return (
		<>
			<Navbar bg='primary' variant='dark' className='px-3'>
				<Navbar.Brand>Chat-App</Navbar.Brand>
				<Button variant='outline-light' onClick={() => setShowModal(true)}>
					Search
				</Button>
				<Nav className='ms-auto'>
					<Navbar.Text className='mr-3'>
						Signed in as: {user && user.username ? user.username : 'Guest'}
					</Navbar.Text>
					<Dropdown>
						<Dropdown.Toggle
							variant='link'
							id='avatar-dropdown'
							className='avatar-btn'
							caret={false}>
							<img
								src='https://tse2.mm.bing.net/th?id=OIP.Siu7xzx1R99lF07TMTwafQHaHR&pid=Api&P=0&h=180'
								alt='Avatar'
								className='avatar-img'
							/>
						</Dropdown.Toggle>
						<Dropdown.Menu align='end'>
							<Dropdown.Item href='avatar.html'>Profile</Dropdown.Item>
							<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Nav>
			</Navbar>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Search Users</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSearch}>
						<FormControl
							type='text'
							placeholder='Search'
							className='mr-sm-2'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Button type='submit' variant='primary'>
							Search
						</Button>
					</Form>
					<ListGroup className='mt-3'>
						{searchResults.map((user) => (
							<ListGroup.Item key={user.id}>
								<img
									src='https://tse2.mm.bing.net/th?id=OIP.Siu7xzx1R99lF07TMTwafQHaHR&pid=Api&P=0&h=180'
									alt='Avatar'
									className='avatar-img'
								/>
								{user.username}
								<Button
									variant='success'
									className='ml-2'
									onClick={() => handleAddFriend(user.id)}>
									Add Friend
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default Header;
