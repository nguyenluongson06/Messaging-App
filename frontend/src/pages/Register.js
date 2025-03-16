import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { register } from '../authService';

const Register = ({ setUser }) => {
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const data = await register(userName, email, password);
			setUser({ name: userName, email });
			localStorage.setItem('token', data.token);
			navigate('/login');
		} catch (error) {
			console.error('Registration failed:', error.response.data);
			alert(
				'Registration failed: ' +
					error.response.data.error.errorMessage.join(', '),
			);
		}
	};

	return (
		<div className='auth-container'>
			<div className='auth-box'>
				<h2>Đăng ký</h2>
				<Form onSubmit={handleRegister}>
					<Form.Group className='form-group'>
						<Form.Control
							type='text'
							placeholder='Họ và Tên'
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Control
							type='email'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Control
							type='password'
							placeholder='Mật khẩu'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Group>
					<Button type='submit' variant='primary'>
						Đăng ký
					</Button>
				</Form>
				<p>
					Đã có tài khoản? <a href='/login'>Đăng nhập</a>
				</p>
			</div>
		</div>
	);
};

export default Register;
