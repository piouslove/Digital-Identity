'use strict';

var Merkle = require('./utils/merkletree');
var merkle = new Merkle();

var randomString = require('./utils/randomString');
var shuffle = require('./utils/shuffle');
var cfg = require('../config');
var jwt = require('jsontokens')

//function Claim(arr, audience, issuer, expiration, subject, iat, strength)
function Claim(props){
	// JWT
	this.iss = props.issuer || cfg.claim.issuer;
	this.iat = props.iat || 0;
	this.exp = props.expiration || cfg.claim.expiration;
	this.aud = props.audience;
	this.sub = props.subject || cfg.claim.subject;

    // 属性
	this.attributes = attrtoJSON(props.arr); // 属性键值对数组
	this.strength = props.strength || cfg.claim.strength; // 1:不随机, 2：随机排序, 3：随机字符
	/*this.getMerkleArr = () => {
		var k = this.attributes.length;
		var merkleArr = [];
		if (this.strength === 3) {
			//return randomString()
            for (var i = k / 2 - 1; i >= 0; i--) {
            	randomString
            }
			//return shuffle()
		}
		else if (this.strength === 2) {
            //return shuffle()
		}
		else {
			return this.attributes;
		}
	};*/
	this.merkleArr = getMerkleArr(this.attributes, this.strength, cfg.claim.max, cfg.claim.min); 
	//this.merkleArr = getMerkleArr(this.attributes, this.strength);
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
		iss:this.iss || now.getTime(),
		iat:this.iat,
		exp:this.exp,
		aud:this.aud,
		sub:this.sub,
		context:{
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
		for (var j in obj) {
			key = j;
		}
		attrobj.issuer = this.iss;
		attrobj.key = key;
		attrobj.value = obj.key;
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
		//return randomString()
        for (var i = k / 2 - 1; i >= 0; i--) {
        	randomArr.push(randomString(Math.floor(Math.random()*(m-n+1)+n)));
        }
        merkleArr = randomArr.concat(arr);
        return shuffle(merkleArr);
		//return shuffle()
	}
	else if (strength === 2) {
        //return shuffle()
        return shuffle(arr);
	}
	else {
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