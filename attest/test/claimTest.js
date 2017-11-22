'use strict';

var Claim = require('../claim');

var attr_name = {name: 'IDHub'},
    attr_number = {number: 1},
    attr_platform = {platform: 'blockchain'},
    attr_feature = {feature: 'Open decentralized identity platform!'};

var attrs = [attr_name, attr_number, attr_platform, attr_feature];
var props = {
	issuer: 'Ethereum',
	iat: 1514736000000,
	expiration: 180000,
	audience: 'IDHub',
	subject: 'Digital Identity',
	arr: attrs,
	strength: 3
};

var claim = new Claim(props);

console.log(
	'MerkleTreeArray : '+
	claim.merkleArr
	);

console.log(
	'MerkleTreeRoot : '+
	claim.getMerkleRoot()
	);

console.log(
	'JSON Web Token : '+
	claim.getJWT()
	);

console.log(
	'Attestation : '+
	claim.getAttestation()
	);