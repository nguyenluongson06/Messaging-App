import React, { useEffect } from 'react';
import logger from '../utils/logger';

const Message = React.memo(
	({ text, sender, timestamp, currentUserId, senderId }) => {
		const isCurrentUser = Number(currentUserId) === Number(senderId);

		console.log('Message render:', {
			currentUserId,
			senderId,
			isCurrentUser,
			text: text.substring(0, 20), // Log first 20 chars for context
		});

		const messageTime = new Date(timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		});

		return (
			<div
				className={`message-container ${isCurrentUser ? 'sent' : 'received'}`}>
				<div className='message-content'>
					{!isCurrentUser && <div className='message-sender'>{sender}</div>}
					<div className='message-bubble'>
						<p className='message-text'>{text}</p>
						<span className='message-time'>{messageTime}</span>
					</div>
				</div>
			</div>
		);
	},
);

Message.displayName = 'Message';

export default Message;
