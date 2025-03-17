import React, { useEffect } from 'react';
import logger from '../utils/logger';

const Message = ({ text, sender, timestamp, currentUserId, senderId }) => {
	useEffect(() => {
		// Log component props and debug info
		logger.debug('Message Component Render', {
			props: {
				text,
				sender,
				timestamp,
				currentUserId,
				senderId,
			},
			debug: {
				currentUserId: {
					original: `${currentUserId} (${typeof currentUserId})`,
					parsed: `${Number(currentUserId)} (number)`,
				},
				senderId: {
					original: `${senderId} (${typeof senderId})`,
					parsed: `${Number(senderId)} (number)`,
				},
				comparison: {
					isEqual: Number(currentUserId) === Number(senderId),
					className:
						Number(currentUserId) === Number(senderId) ? 'sent' : 'received',
				},
			},
		});
	}, [currentUserId, senderId, text, sender, timestamp]);

	const isCurrentUser = Number(currentUserId) === Number(senderId);
	const messageTime = new Date(timestamp).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div className={`message-container ${isCurrentUser ? 'sent' : 'received'}`}>
			<div className='message-content'>
				{!isCurrentUser && <div className='message-sender'>{sender}</div>}
				<div className='message-bubble'>
					<p className='message-text'>{text}</p>
					<span className='message-time'>{messageTime}</span>
				</div>
			</div>
		</div>
	);
};

export default Message;
