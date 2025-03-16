import React, { useState } from 'react';
import {
	Navbar,
	Nav,
	Dropdown,
	Form,
	FormControl,
	Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authService';
import axios from 'axios';

const Header = ({ user }) => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleLogout = async () => {
		try {
			await logout();
			localStorage.removeItem('token');
			navigate('/login');
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
				`http://localhost:3000/auth/find?query=${searchTerm}`,
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

	return (
		<Navbar bg='primary' variant='dark' className='px-3'>
			<Navbar.Brand>Chat-App</Navbar.Brand>
			<Form inline onSubmit={handleSearch}>
				<FormControl
					type='text'
					placeholder='Search'
					className='mr-sm-2'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button type='submit' variant='outline-light'>
					Search
				</Button>
			</Form>
			<Nav className='ms-auto'>
				<Navbar.Text className='mr-3'>Signed in as: {user.name}</Navbar.Text>
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
	);
};

export default Header;
