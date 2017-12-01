'use strict';

var ethers = require('ethers');
var cfg = require('../config');

var Wallet = ethers.Wallet;
var Contract = ethers.Contract;
var contractAbi = cfg.contract.managerAbi;
var contractAddress = cfg.contract.managerAddress;
var ethereumProvider = new ethers.providers.JsonRpcProvider(cfg.nodeRpcUrl, false, cfg.contract.chainId);

function createIdentity(owner, recoveryKey) {
	var wallet = new Wallet(privKey, ethereumProvider)
    var contract = new Contrct(contractAddress, contractAbi, wallet); 
    var createdId = contract.createIdentity(owner, recoveryKey);
	sendPromise.then(function(transaction) {
        console.log(transaction);
    });
}