import { AbiItem } from 'web3-utils'
import Web3 from 'web3'

const dealABI: AbiItem[] = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_seller',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_cardId',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_price',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_cardAddress',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'dealCA',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cardId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'seller',
				type: 'address',
			},
		],
		name: 'DealCanceled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'dealCA',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cardId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'buyer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'DealEnded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cardId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'seller',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'dealState',
				type: 'bool',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'information',
		type: 'event',
	},
	{
		inputs: [],
		name: 'cancelDeal',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'cardContract',
		outputs: [
			{
				internalType: 'contract IERC721',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'coinContract',
		outputs: [
			{
				internalType: 'contract IERC20',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getInfo',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'purchase',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
]
export default dealABI
