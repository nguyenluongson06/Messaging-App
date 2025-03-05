const sodium = require('libsodium-wrappers');

// hash password before saving to database
async function hashPassword(password) {
	await sodium.ready;
	return sodium.crypto_pwhash_str(
		password,
		sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
		sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
	);
}

// encrypt message before sending to recipient
async function encryptMessage(message, recipientPublicKey, senderPrivateKey) {
	await sodium.ready;
	const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
	const cipherText = sodium.crypto_box_easy(
		message,
		nonce,
		recipientPublicKey,
		senderPrivateKey,
	);
	return { nonce, cipherText };
}

module.exports = { hashPassword, encryptMessage };
