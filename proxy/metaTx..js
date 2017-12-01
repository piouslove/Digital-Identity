var util = require("ethereumjs-util");
var leftPad = require('left-pad');
const lightwallet = require('eth-lightwallet');

function enc(funName, types, params) {
  return '0x' + lightwallet.txutils._encodeFunctionTxData(funName, types, params)
}

function pad(n) {
  assert.equal(typeof(n), 'string', "Passed in a non string")
  let data
  if (n.startsWith("0x")) {
    data = '0x' + leftPad(n.slice(2), '64', '0')
    assert.equal(data.length, 66, "packed incorrectly")
    return data;
  } else {
    data = '0x' + leftPad(n, '64', '0')
    assert.equal(data.length, 66, "packed incorrectly")
    return data;
  }
}

var signMsgHash = function (privKey, msgHash, signingAddress) {

  signingAddress = util.stripHexPrefix(signingAddress);

  return util.ecsign(new Buffer(util.stripHexPrefix(msgHash), 'hex'), new Buffer(privKey, 'hex'));
};

function signPayload(signingAddr, sendingAddr, txRelayAddr, destinationAddress, functionName,
                     functionTypes, functionParams, privKey, nonce)
{
   if (functionTypes.length !== functionParams.length) {
     return //should throw error
   }
   if (typeof(functionName) !== 'string') {
     return //should throw error
   }
   let data
   let hashInput
   let hash
   let sig
   let retVal = {}
   data = enc(functionName, functionTypes, functionParams)
   //Tight packing, as Solidity sha3 does
   hashInput = txRelayAddr.slice(2) + pad(nonce.toString('16')).slice(2)
               + destinationAddress.slice(2) + data.slice(2) + sendingAddr.slice(2)
   hash = solsha3(hashInput)
   sig = signMsgHash(privKey, hash, signingAddr)
   retVal.r = '0x'+sig.r.toString('hex')
   retVal.s = '0x'+sig.s.toString('hex')
   retVal.v = sig.v //Q: Why is this not converted to hex?
   retVal.data = data
   retVal.hash = hash
   retVal.nonce = nonce
   retVal.dest = destinationAddress
   return retVal
}