'use strict';

var Merkle = require('./utils/merkletree');
var merkle = new Merkle();
var cfg = require('../config');
var jwt = require('jsontokens');
var sha256 = require('./utils/sha256.js')

function Credential(props) {
	this.key = props.key;
	this.value = props.value;
	this.index = props.index;
	this.proof = props.proof;
	this.jwt = props.jwt;

	this.jwtData = this.jwtParse();
	this.MerkleTreeRoot = this.getMerkleRoot();
	this.issuer = this.getIssuer();
	this.audience = this.getAudience();
	this.iat = this.getIat();
	this.expiration = this.getExpiration();
	this.subject = this.getSubject();
}

Credential.prototype.jwtParse = function() {
	var data = jwt.decodeToken(this.jwt);
	return data;
};

Credential.prototype.getMerkleRoot = function() {
	return this.jwtData.payload.context.MerkleTreeRoot;
};

Credential.prototype.getIssuer = function() {
	return this.jwtData.payload.iss;
};

Credential.prototype.getAudience = function() {
	return this.jwtData.payload.aud;
};

Credential.prototype.getIat = function() {
	return this.jwtData.payload.iat;
};

Credential.prototype.getExpiration = function() {
	return this.jwtData.payload.exp;
};

Credential.prototype.getSubject = function() {
	return this.jwtData.payload.sub;
};

Credential.prototype.verifyJwt = function(key) {
	var publicKey = cfg.credential.publicKey || key;
	var bool = new jwt.TokenVerifier('ES256k', publicKey).verify(this.jwt);
	return bool;
};

Credential.prototype.verifyExpiration = function() {
	var now = new Date();
	return now <= (this.iat + this.expiration);
};

Credential.prototype.verifyIssuer = function(iss) {
	var issuer = iss || cfg.credential.issuer;
	return issuer === this.issuer;
};

Credential.prototype.verifyProof = function() {
	var key = this.key,
	    value = this.value;
	// console.log(key + ':' + value);
	var attr = '{"'+key+'":"'+value+'"}';
	// console.log(attr);
	// var hash = sha256(attr);
	// console.log(hash);
	return merkle.validateProof(this.proof, sha256(attr), this.MerkleTreeRoot);
};

Credential.prototype.isValid = function() {
	var bool1 = this.verifyJwt();
	var bool2 = this.verifyExpiration();
	var bool3 = this.verifyIssuer();
	var bool4 = this.verifyProof();
	return bool1 && bool2 && bool3 && bool4;
};

module.exports = Credential;