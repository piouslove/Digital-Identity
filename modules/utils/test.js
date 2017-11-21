var Merkle = require('./merkletree');
var randomString = require('./randomString');
var shuffle = require('./shuffle');

var arr = [];
var a = randomString(10);
console.log(a);
arr.push(a);
console.log(arr);

var b = randomString(11);
console.log(b);
arr.push(b);
console.log(arr);

var c = randomString(9);
console.log(c);
arr.push(c);
console.log(arr);

var m = 20;
var n = 2;
var r = randomString(Math.floor(Math.random()*(m-n+1)+n));
console.log(r);
arr.push(r);
var arr_start = arr.concat();
console.log(arr_start);

console.log(shuffle(arr));
console.log(arr);


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

var merkleArr = getMerkleArr(arr, 3);
console.log(merkleArr);
console.log(arr);

console.log(getMerkleArr(arr, 2));
console.log(arr);

var arr_end = arr.concat();
console.log(arr_end);

if (arr_start.length == arr_end.length) {
	console.log('True!');
} else {
	console.log('False!');
}

for (var i = arr_start.length - 1; i >= 0; i--) {
	if (arr_start[i] == arr_end[i]) {
	console.log('True!');
} else {
	console.log('False!');
};
}


var merkle = new Merkle();
merkle.resetTree();
merkle.addLeaves(merkleArr, true);
var doubleHash = false; // true to hash pairs twice as the tree is constructed 
var tree = merkle.makeTree(doubleHash);
var merkleroot = merkle.getMerkleRoot();
console.log(merkleroot.toString('hex'));


console.log(merkle.getLeafCount());

console.log(merkle.getLeaf(0));
console.log(merkle.getLeaf(1));
console.log(merkle.getLeaf(2));
console.log(merkle.getLeaf(4));
console.log(merkle.getLeaf(5));
