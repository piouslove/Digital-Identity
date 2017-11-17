'use strict';

var Merkle = require('./utils/merkletree');
var randomString = require('./utils/randomString');
var shuffle = require('./utils/shuffle');
var cfg = require('../config')

//function Claim(arr, audience, issuer, expiration, subject, iat, strength)
function Claim(props){
	// JWT
	this.iss = props.issuer || cfg.claim.issuer;
	this.iat = props.iat || 0;
	this.exp = props.expiration || cfg.claim.expiration;
	this.aud = props.audience;
	this.sub = props.subject || cfg.claim.subject;

    // 属性
	this.attributes = props.arr; // 属性键值对数组
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


}

Claim.prototype.getMerkleRoot = function() {
	// body...
};

Claim.prototype.getJWT = function() {
	// body...
};

Claim.prototype.getMerkleProof = function() {
	// body...
};

Claim.prototype.getAttestation = function() {
	// body...
	//return set json
};

getMerkleArr = function(arr, strength, max, min) {
	var k = arr.length;
	var merkleArr = [];
	var m = max || 20;
	var n = min || 2；
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

function createClaim(props) {
    return new Claim(props);
}