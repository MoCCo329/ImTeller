import { createSlice } from '@reduxjs/toolkit'

import card1 from 'assets/image/card1.webp'
import card2 from 'assets/image/card4.webp'
import card3 from 'assets/image/card11.webp'
import card4 from 'assets/image/card22.webp'
import card5 from 'assets/image/card31.webp'
import card6 from 'assets/image/card36.webp'
import card7 from 'assets/image/card55.webp'

export const cardList = createSlice({
	name: 'cardList',
	initialState: [
		// {
		// 	cardId: 1,
		// 	cardTitle: '기본카드1',
		// 	cardImageURL: card1,
		// 	description: '기본카드1.',
		// 	grade: 'B',
		// 	effect: 4,
		// 	effectNum: 0,
		// 	createdDT: 'asdf',
		// 	recentPrice: 100,
		// 	tokenId: 1,
		// },
	],
	reducers: {
		setCardList(state, action) {
			return action.payload
		},
	},
})
export const { setCardList } = cardList.actions

export const paintList = createSlice({
	name: 'paintList',
	initialState: [
		// {
		// 	paintId: 1,
		// 	paintTitle: '기본카드1',
		// 	paintImageURL: card1,
		// 	description: '기본카드1.',
		// 	isVote: false,
		// },
	],
	reducers: {
		setPaintList(state, action) {
			return action.payload
		},
	},
})
export const { setPaintList } = paintList.actions

export const selectedCard = createSlice({
	name: 'selectedCard',
	initialState: {} as any,
	reducers: {
		setSelectedCard(state, action) {
			return action.payload
		},
	},
})
export const { setSelectedCard } = selectedCard.actions

export const selectedPaint = createSlice({
	name: 'selectedPaint',
	initialState: 0,
	reducers: {
		setSelectedPaint(state, action) {
			return action.payload
		},
	},
})
export const { setSelectedPaint } = selectedPaint.actions

export const dealList = createSlice({
	name: 'dealList',
	initialState: [
		// {
		// 	cardId: '1',
		// 	cardImageURL: card1,
		// 	dealId: 1,
		// 	designerId: 1,
		// 	description: '기본그림1',
		// 	designerNickname: 'test',
		// 	finalBidPrice: 700,
		// 	finishedAt: '2022-09-28 16:04:30',
		// 	instantPrice: 1000,
		// 	effect: 1,
		// 	grade: 'S',
		// 	tag: 'tag',
		// },
	],
	reducers: {
		setDealList(state, action) {
			return action.payload
		},
	},
})
export const { setDealList } = dealList.actions

export const dealDetail = createSlice({
	name: 'dealDetail',
	initialState: {
		cardInfo: {
		// 	cardId: 1,
		// 	cardImageURL: 'test',
		// 	cardTitle: 'test',
		// 	createdAt: '2022-10-03T16:01:40',
		// 	description: 'test1',
		// 	designerId: 2,
		// 	designerNickname: 'shy',
		// 	effect: 1,
		// 	effectNum: 10,
		// 	grade: 'S',
		// 	ownerId: 2,
		// 	ownerNickname: 'MoCCo',
		// 	tokenId: 1,
		// },
		// dealHistoryList: [
		// 	{
		// 		sellerId: 1,
		// 		sellerNickname: 'IMTELLER',
		// 		buyerId: 2,
		// 		buyerNickname: 'MoCCo',
		// 		price: 1000,
		// 		dealedAt: '2022-09-30 05:21:07',
		// 	},
		// ],
		// dealInfo: {
		// 	dealId: 1,
		// 	finalBidPrice: 100,
		// 	finishedAt: '2022-10-20 05:21:07',
		// 	instantPrice: 1000,
		// 	lowPrice: 50,
		// 	dealAddress: '0xasdfasdfasdfasdfasdf',
		// },
	},
	reducers: {
		setDealDetail(state, action) {
			return action.payload
		},
	},
})
export const { setDealDetail } = dealDetail.actions

export const voteList = createSlice({
	name: 'voteList',
	initialState: [],
	reducers: {
		setVoteList(state, action) {
			return action.payload
		},
	},
})
export const { setVoteList } = voteList.actions

export const queryState = createSlice({
	name: 'queryState',
	initialState: [0, 0, 1],
	reducers: {
		setQueryState(state, action) {
			return action.payload
		},
		setTarget(state, action) {
			state[0] = action.payload
		},
		setSort(state, action) {
			state[1] = action.payload
		},
		setStatus(state, action) {
			state[2] = action.payload
		},
	},
})
export const { setQueryState, setTarget, setSort, setStatus } = queryState.actions
