const { sequelize } = require('../config/database');
const User = require('./User');
const ChatGroup = require('./ChatGroup');
const GroupMember = require('./GroupMember');
const Message = require('./Message');
const Friend = require('./Friend');
const UserKey = require('./UserKey');

// User <-> User (Friends) associations
User.belongsToMany(User, {
	through: Friend,
	as: 'Friends',
	foreignKey: 'user1_id',
	otherKey: 'user2_id',
});

User.belongsToMany(User, {
	through: Friend,
	as: 'FriendOf',
	foreignKey: 'user2_id',
	otherKey: 'user1_id',
});

// User <-> ChatGroup associations through GroupMember
ChatGroup.belongsToMany(User, {
	through: GroupMember,
	foreignKey: 'group_id',
	otherKey: 'user_id',
	as: 'members',
});

User.belongsToMany(ChatGroup, {
	through: GroupMember,
	foreignKey: 'user_id',
	otherKey: 'group_id',
	as: 'chats',
});

// ChatGroup owner association
ChatGroup.belongsTo(User, {
	foreignKey: 'owner_id',
	as: 'owner',
});

// Message associations
Message.belongsTo(User, {
	foreignKey: 'sender_id',
	as: 'sender',
});

User.hasMany(Message, {
	foreignKey: 'sender_id',
	as: 'sentMessages',
});

// Friend associations
Friend.belongsTo(User, {
	foreignKey: 'user1_id',
	as: 'user1',
});

Friend.belongsTo(User, {
	foreignKey: 'user2_id',
	as: 'user2',
});

// User <-> UserKey association
User.hasOne(UserKey, {
	foreignKey: 'user_id',
});

UserKey.belongsTo(User, {
	foreignKey: 'user_id',
});

module.exports = {
	sequelize,
	User,
	ChatGroup,
	GroupMember,
	Message,
	Friend,
	UserKey,
};
