import React, { useState } from 'react';
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
	const [user, setUser] = useState(null); // Lưu trạng thái đăng nhập

	return (
		<Router>
			<Header user={user} /> {/* Pass user prop to Header */}
			<Routes>
				<Route path='/login' element={<Login setUser={setUser} />} />
				<Route path='/register' element={<Register setUser={setUser} />} />
				<Route
					path='/chat'
					element={user ? <Chat /> : <Navigate to='/login' />}
				/>
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</Router>
	);
};

export default App;
