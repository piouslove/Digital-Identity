'use strict';

var signer = require('jsontokens').cryptoClient['ES256K'];
var secp256k1 = require('secp256k1');
var sha3 = require('ethereumjs-util');

function jwtToaddr(jwt) {
	var tokenParts = token.split('.');
	var header = tokenParts[0];
	var payload = tokenParts[1];
	var signature = tokenParts[2];

    //calculate the signing input hash
    var msg = header + '.' + payload;
    var msgHash = signer.createHash(msg);
    var sigBuf = new Buffer(signature, 'base64');
    var publicKey = secp256k1.recover(msgHash, sigBuf, 1);

    publicKey = secp256k1.publicKeyConvert(publicKey, false).slice(1);
    return sha3(publicKey).slice(-20).toString('hex');
}