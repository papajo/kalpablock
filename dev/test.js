const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const previousBlockHash = 'LKJASLJDLA87878';
const currentBlockData = [
	{
		amount: 10,
		sender: 'KJSLKJAD098098',
		recipient: 'OIUYLKJASD98798'
	},
	{
		amount: 30,
		sender: 'DFDKJSLKJAD098098',
		recipient: '124SDFGLKJASD98798'
	},
	{
		amount: 200,
		sender: 'SSWEKJSLKJAD098098',
		recipient: 'QWDS23LKJASD98798'
	},
];
const nonce = 100;






console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));


//bitcoin.createNewBlock(1234, 'OIIHASDO23234243', 'UIHKH657532');
//bitcoin.createNewBlock(1235, '323HASDO23234243', '121UIHKH657532');
//bitcoin.createNewBlock(1236, '2324HASDO23234243', '212UIHKH657532');
//
console.log(bitcoin);