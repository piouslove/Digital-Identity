'use strict';

var config = {

	claim: {
		issuer: 'IDHub',
		expiration: 300,
		subject: 'test',
		strength: 3,
		privateKey: 'b08e0060d8aa08633c16b3ddaebc0a7e8e11aedf54873bdbf1ff4f05c8b83d17',
		// iat: 0
	},

	credential: {
		issuer: 'IDHub',
		publicKey: '044d460e74c1d5ef7c4969b31d0cb366a3d015c39153ca9fe60e85bbfb7c4cc07a1ef021e539f86ec5957cba00e5a64cc70b93186bf778b934683363598b2e6805'
	}

}

module.exports = config;