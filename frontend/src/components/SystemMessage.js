import React from 'react';

const SystemMessage = ({ text, timestamp }) => {
	const messageTime = timestamp
		? new Date(timestamp).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
		  })
		: '';

	return (
		<div className='system-message'>
			<span>
				{text}
				{timestamp && <small className='system-time'>{messageTime}</small>}
			</span>
		</div>
	);
};

export default React.memo(SystemMessage);
