'use strict';

var Claim = require('../claim');
var Credential = require('../credential');

var attr_name = {name: 'Ethereum'},
    attr_number = {number: 1},
    attr_platform = {platform: 'blockchain'},
    attr_feature = {feature: 'Open decentralized identity platform!'};

var attrs = [attr_name, attr_number, attr_platform, attr_feature];
var props1 = {
	audience: 'IDHub',
	arr: attrs
};

var claim = new Claim(props1);
var att = claim.getAttestation();
console.log(claim.merkleArr);
var arr = JSON.parse(att);

for (var i = attrs.length - 1; i >= 0; i--) {
console.log('=== === === === === === START === === === === === ===\n');
var attr = arr[0];
var credential = new Credential(attr);

console.log(
	'jwtData : '+
	credential.jwtData
	);

console.log(
	'MerkleTreeRoot : '+
	credential.MerkleTreeRoot
	);

console.log(
	'issuer : '+
	credential.issuer
	);

console.log(
	'audience : '+
	credential.audience
	);

console.log(
	'iat : '+
	credential.iat
	);

console.log(
	'expiration : '+
	credential.expiration
	);

console.log(
	'subject : '+
	credential.subject
	);

console.log(
	'verifyJwt : '+
	credential.verifyJwt()
	);

console.log(
	'verifyExpiration : '+
	credential.verifyExpiration()
	);

console.log(
	'verifyIssuer : '+
	credential.verifyIssuer()
	);

console.log(
	'verifyProof : '+
	credential.verifyProof()
	);

console.log(
	'Credential is Valid : '+
	credential.isValid() + '\n'
	);

console.log('=== === === === === === END === === === === === ===\n\n');
};