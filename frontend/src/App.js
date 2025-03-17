import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Header from './components/Header'; // Import Header
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	// Add validation for user data
	useEffect(() => {
		if (user && !user.id) {
			// If user exists but has no ID, log out
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			setUser(null);
		}
	}, [user]);

	return (
		<Router>
			{user && user.username ? <Header user={user} /> : null}
			{/* Only show Header if user is logged in */}
			<Routes>
				<Route path='/login' element={<Login setUser={setUser} />} />
				<Route path='/register' element={<Register setUser={setUser} />} />
				<Route
					path='/chat'
					element={
						user && user.id ? <Chat user={user} /> : <Navigate to='/login' />
					}
				/>
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</Router>
	);
};

export default App;
