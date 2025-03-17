const sodium = require('libsodium-wrappers');
const UserKey = require('../models/UserKey');

// create public + private key
async function generateKeys(user_id) {
	await sodium.ready;
	const keyPair = sodium.crypto_box_keypair();
	await UserKey.create({
		userId: user_id,
		public_key: Buffer.from(keyPair.publicKey).toString('base64'),
		private_key: Buffer.from(keyPair.privateKey).toString('base64'),
	});
}

// get user public key
async function getPublicKey(user_id) {
	const key = await UserKey.findOne({ where: { user_id: user_id } });
	return key ? Buffer.from(key.public_key, 'base64') : null;
}

module.exports = { generateKeys, getPublicKey };
