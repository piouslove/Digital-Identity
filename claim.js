'use strict';

var Merkle = require('./utils/merkletree');
var randomString = require('./utils/randomString');
var shuffle = require('./utils/shuffle');

//function Claim(arr, audience, issuer, expiration, subject, iat, strength)
function Claim(props){
	// JWT
	this.iss = props.issuer;
	this.iat = props.iat;
	this.exp = props.expiration;
	this.aud = props.audience;
	this.sub = props.subject;

    // 属性
	this.attributes = props.arr; // 属性键值对数组
	this.strength = props.strength; // 1:不随机, 2：随机排序, 3：随机字符
	this.getMerkleArr = () => {
		if (this.strength === 3) {
			//return randomString()
			//return shuffle()
		}
		else if (this.strength === 2) {
            //return shuffle()
		}
		else {
			return this.attributes;
		}
	} 
}

Claim.prototype.getMerkleRoot = function() {
	// body...
};

function createClaim(props) {
    return new Claim(props)
}