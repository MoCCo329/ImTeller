import { AbiItem } from 'web3-utils'
import Web3 from 'web3'

const marketABI: AbiItem[] = [
	{
		inputs: [
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
				name: 'seller',
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
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'dealAddress',
				type: 'address',
			},
		],
		name: 'NewDeal',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
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
		inputs: [
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
		],
		name: 'createDeal',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const web3 = new Web3(window.ethereum)

export const marketAddress = '0x04cE1391332Bb978fC1d8D5D476D86E91f4C6FED'
export const marketContract = new web3.eth.Contract(marketABI, marketAddress)
