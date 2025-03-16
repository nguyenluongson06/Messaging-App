const sequelize = require('../config/database');
const User = require('./User');
const ChatGroup = require('./ChatGroup');
const GroupMember = require('./GroupMember');
const Message = require('./Message');
const UserKey = require('./UserKey');
const Friend = require('./Friend'); // Import the Friend model

User.hasMany(ChatGroup, { foreignKey: 'owner_id' });
ChatGroup.belongsTo(User, { foreignKey: 'owner_id' });
ChatGroup.hasMany(GroupMember, { foreignKey: 'group_id' });
User.hasMany(GroupMember, { foreignKey: 'user_id' });
GroupMember.belongsTo(ChatGroup, { foreignKey: 'group_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id' });
ChatGroup.hasMany(Message, { foreignKey: 'group_id' });
User.hasMany(Message, { foreignKey: 'sender_id' });
Message.belongsTo(ChatGroup, { foreignKey: 'group_id' });
Message.belongsTo(User, { foreignKey: 'sender_id' });
UserKey.belongsTo(User, { foreignKey: 'user_id' });
User.belongsToMany(User, {
	through: Friend,
	as: 'Friends',
	foreignKey: 'user1_id',
});

module.exports = {
	sequelize,
	User,
	ChatGroup,
	GroupMember,
	Message,
	UserKey,
	Friend,
};
