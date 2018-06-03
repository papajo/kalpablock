const Blockchain = require('./Blockchain');
const kalpacoin = new Blockchain();

const bc1 = {
"chain": [
{
"index": 1,
"timestamp": 1528032002314,
"transactions": [],
"nonce": 100,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1528032188180,
"transactions": [],
"nonce": 18140,
"hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1528032283487,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "d20c4230673011e8a296459c31980525",
"transactionId": "4161b160673111e8a296459c31980525"
},
{
"amount": 10,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "6a5dc9f0673111e8a296459c31980525"
},
{
"amount": 20,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "6e3a40d0673111e8a296459c31980525"
},
{
"amount": 30,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "714f9720673111e8a296459c31980525"
}
],
"nonce": 67371,
"hash": "0000f8f2d8fb78cbabecaf8e5f2bae32bfa200463fac2a9580c46f4d5e9fa2c3",
"previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
},
{
"index": 4,
"timestamp": 1528032425545,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "d20c4230673011e8a296459c31980525",
"transactionId": "7a21e420673111e8a296459c31980525"
},
{
"amount": 40,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "c2c551d0673111e8a296459c31980525"
},
{
"amount": 50,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "c529ceb0673111e8a296459c31980525"
},
{
"amount": 60,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "c76f51e0673111e8a296459c31980525"
},
{
"amount": 70,
"sender": "11KLJASLDKJSSLSJ87879867AA2",
"recipient": "22QWJASDL1212KJALSJD875785QQ2",
"transactionId": "c994f100673111e8a296459c31980525"
}
],
"nonce": 86156,
"hash": "00001ccfec9b259c9ba979a3657175f7a2f6223dde441440e148a58732ba989e",
"previousBlockHash": "0000f8f2d8fb78cbabecaf8e5f2bae32bfa200463fac2a9580c46f4d5e9fa2c3"
},
{
"index": 5,
"timestamp": 1528032465691,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "d20c4230673011e8a296459c31980525",
"transactionId": "cece38c0673111e8a296459c31980525"
}
],
"nonce": 11908,
"hash": "0000e22aaf8a606aee9a22c876929b89cc4d65ab4beac31ece292966f2b71a17",
"previousBlockHash": "00001ccfec9b259c9ba979a3657175f7a2f6223dde441440e148a58732ba989e"
},
{
"index": 6,
"timestamp": 1528032468726,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "d20c4230673011e8a296459c31980525",
"transactionId": "e6bc2af0673111e8a296459c31980525"
}
],
"nonce": 21062,
"hash": "0000d265649210435afcf77fdbca7324ded7736bce5b7385c724bb93234c77cf",
"previousBlockHash": "0000e22aaf8a606aee9a22c876929b89cc4d65ab4beac31ece292966f2b71a17"
}
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "d20c4230673011e8a296459c31980525",
"transactionId": "e88b1e90673111e8a296459c31980525"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};

console.log('VALID: ', kalpacoin.chainIsValid(bc1.chain));