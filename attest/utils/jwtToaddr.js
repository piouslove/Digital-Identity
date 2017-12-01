'use strict';

var signer = require('jsontokens').cryptoClients['ES256K'];
var secp256k1 = require('secp256k1');
var sha3 = require('ethereumjs-util').sha3;

function jwtToaddr(token) {
	var tokenParts = token.split('.');
	var header = tokenParts[0];
	var payload = tokenParts[1];
    console.log(payload);
	var signature = tokenParts[2];

    //calculate the signing input hash
    var msg = header + '.' + payload;
    var msgHash = signer.createHash(msg);
    console.log(msgHash);
    var sigBuf = new Buffer(signature, 'base64');
    console.log(sigBuf);
    console.log(sigBuf.toString('hex'));
    var publicKey = secp256k1.recover(msgHash, sigBuf, 1);
    console.log(publicKey);
    console.log(publicKey.toString('hex'));

    publicKey = secp256k1.publicKeyConvert(publicKey, false).slice(1);
    console.log(publicKey);
    console.log(publicKey.toString('hex'));
    return sha3(publicKey).slice(-20).toString('hex');
}

module.exports = jwtToaddr;