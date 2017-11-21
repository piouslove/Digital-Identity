'use strict';

var Merkle = require('./utils/merkletree');
var merkle = new Merkle();
var randomString = require('./utils/randomString');
var shuffle = require('./utils/shuffle');
var cfg = require('../config');
var jwt = require('jsontokens');

function Claim(props){
	// issuer可指定但建议由配置文件输入
	this.iss = props.issuer || cfg.claim.issuer;
	// issued at time建议不指定由系统自己生成
	this.iat = props.iat || cfg.claim.iat;
	// 有效期限可指定但建议由配置文件输入
	this.exp = props.expiration || cfg.claim.expiration;
	this.aud = props.audience;
	// 可由配置文件指定固定主题
	this.sub = props.subject || cfg.claim.subject;
	// attr to JSON
	this.attributes = attrtoJSON(props.arr);
	// privacy encryption strength
	this.strength = props.strength || cfg.claim.strength;
	// generate merkle tree leaves array
	this.merkleArr = getMerkleArr(this.attributes, this.strength, cfg.claim.max, cfg.claim.min);
}

Claim.prototype.getMerkleRoot = function() {
	merkle.resetTree();
	merkle.addLeaves(this.merkleArr, true);
	var doubleHash = false; // true to hash pairs twice as the tree is constructed 
	merkle.makeTree(doubleHash);
	return merkle.getMerkleRoot().toString('hex');
};

Claim.prototype.getJWT = function() {
	var now = new Date();
	var payload = {
		iss: this.iss,
		// issued at time建议采用方式
		iat: this.iat || now.getTime(),
		exp: this.exp,
		aud: this.aud,
		sub: this.sub,
		context: {
			MerkleTreeRoot:this.getMerkleRoot()
		}
	};
	var token = new jwt.TokenSigner('ES256k', cfg.claim.privateKey).sign(payload);
	return token;
};

Claim.prototype.getMerkleProof = function(index) {
	merkle.resetTree();
	merkle.addLeaves(this.merkleArr, true);
	var doubleHash = false; // true to hash pairs twice as the tree is constructed 
	merkle.makeTree(doubleHash);
	return merkle.getProof(index);
};

Claim.prototype.getAttestation = function() {
	var attestation = [];
	for (var i = this.attributes.length - 1; i >= 0; i--) {
		var attrobj = {};
		var attr = this.attributes[i];
		var obj = JSON.parse(attr);
		var key = '';
		// 获取attribute的key
		for (var j in obj) {
			key = j;
		}
		attrobj.issuer = this.iss;
		attrobj.key = key;
		// 获取attribute的value
		attrobj.value = obj[key];
		attrobj.index = this.merkleArr.indexOf(attr);
		attrobj.proof = this.getMerkleProof(attrobj.index);
		attrobj.jwt = this.getJWT();
		attestation.push(attrobj);
	}
	return JSON.stringify(attestation);
};

function getMerkleArr(arr, strength, max, min) {
	var k = arr.length;
	var merkleArr = [];
	var m = max || 20;
	var n = min || 2;
	var randomArr = [];
	if (strength === 3) {
		//add randomString and shuffle
        for (var i = k / 2 - 1; i >= 0; i--) {
        	randomArr.push(randomString(Math.floor(Math.random()*(m-n+1)+n)));
        }
        merkleArr = randomArr.concat(arr);
        //return shuffle
        return shuffle(merkleArr);
	}
	else if (strength === 2) {
        //return shuffle
        return shuffle(arr);
	}
	else {
		// no change
		return arr;
	}
} 

function attrtoJSON(arr) {
	for (var i = arr.length - 1; i >= 0; i--) {
		arr[i] = JSON.stringify(arr[i]);
	}
	return arr;
}

function createClaim(props) {
    return new Claim(props);
}

module.exports = Claim;