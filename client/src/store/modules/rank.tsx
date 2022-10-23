import { createSlice } from '@reduxjs/toolkit'

export const rankList = createSlice({
	name: 'rankList',
	initialState: {},
	reducers: {
		setRankList(state, action) {
			return action.payload
		},
	},
})
export const { setRankList } = rankList.actions

export const rankTabNo = createSlice({
	name: 'rankTabNo',
	initialState: 0,
	reducers: {
		setRankTabNo(state, action) {
			return action.payload
		},
	},
})
export const { setRankTabNo } = rankTabNo.actions
