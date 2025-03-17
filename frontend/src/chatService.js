// filepath: c:\Users\nguye\OneDrive\Documents\GitHub\Messaging-App\frontend\src\chatService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const createChatGroup = async (name, description, token) => {
	const response = await axios.post(
		`${API_URL}/chat/create`,
		{ name, description },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	return response.data;
};

export const addMember = async (group_id, user_id, token) => {
	const response = await axios.post(
		`${API_URL}/chat/add-member`,
		{ group_id, user_id },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	return response.data;
};

export const removeMember = async (group_id, user_id, token) => {
	const response = await axios.post(
		`${API_URL}/chat/remove-member`,
		{ group_id, user_id },
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	return response.data;
};

export const getChatHistory = async (groupId, token) => {
	const response = await axios.get(`${API_URL}/chat/history/${groupId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};
