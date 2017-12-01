'use strict';

var config = {

	claim: {
		issuer: 'IDHub',
		expiration: 300,
		subject: 'test',
		strength: 3,
		privateKey: 'fe36e720cc3c0706406bc269a4c0d688478130d4ab2743b9a8ec3f902af33f80',
		// iat: 0
	},

	credential: {
		issuer: 'IDHub',
		publicKey: '049161d39424bd0c91d37500ce0f64a05b6b5eb2154137e2f5fbdbf4b2185138a80633ef6f273e3dbcca9a5716422d01705540f729d58ac6d6d7cdc5baa095e3ff'
	}

}

module.exports = config;