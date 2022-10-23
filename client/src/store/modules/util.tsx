import { createSlice } from '@reduxjs/toolkit'

export const bgmSrc = createSlice({
	name: 'bgmSrc',
	initialState: 'assets/audio/main.mp3',
	reducers: {
		setBgmSrc(state, action) {
			return action.payload
		},
	},
})
export const { setBgmSrc } = bgmSrc.actions

export const isBgmOn = createSlice({
	name: 'isBgmOn',
	initialState: true,
	reducers: {
		setIsBgmOn(state, action) {
			return action.payload
		},
	},
})
export const { setIsBgmOn } = isBgmOn.actions

export const bgmVolume = createSlice({
	name: 'bgmVolume',
	initialState: 50,
	reducers: {
		setBgmVolume(state, action) {
			return action.payload
		},
	},
})
export const { setBgmVolume } = bgmVolume.actions

export const effectSrc = createSlice({
	name: 'effectSrc',
	initialState: '',
	reducers: {
		setEffectSrc(state, action) {
			return action.payload
		},
	},
})
export const { setEffectSrc } = effectSrc.actions

export const isEffectOn = createSlice({
	name: 'isEffectOn',
	initialState: true,
	reducers: {
		setIsEffectOn(state, action) {
			return action.payload
		},
	},
})
export const { setIsEffectOn } = isEffectOn.actions

export const effectVolume = createSlice({
	name: 'effectVolume',
	initialState: 50,
	reducers: {
		setEffectVolume(state, action) {
			return action.payload
		},
	},
})
export const { setEffectVolume } = effectVolume.actions

export const isMouseEffectOn = createSlice({
	name: 'isMouseEffectOn',
	initialState: true,
	reducers: {
		setIsMouseEffectOn(state, action) {
			return action.payload
		},
	},
})
export const { setIsMouseEffectOn } = isMouseEffectOn.actions

export const modalState = createSlice({
	name: 'modalState',
	initialState: '',
	reducers: {
		setModalState(state, action) {
			return action.payload
		},
	},
})
export const { setModalState } = modalState.actions

export const modalMsg = createSlice({
	name: 'modalMsg',
	initialState: '',
	reducers: {
		setModalMsg(state, action) {
			return action.payload
		},
	},
})
export const { setModalMsg } = modalMsg.actions

// 0이면 응답받지 않음, 1이면 확인, 2면 취소
export const modalResult = createSlice({
	name: 'modalResult',
	initialState: 0,
	reducers: {
		setModalResult(state, action) {
			return action.payload
		},
	},
})
export const { setModalResult } = modalResult.actions

export const loading = createSlice({
	name: 'loading',
	initialState: false,
	reducers: {
		setLoading(state, action) {
			return action.payload
		},
	},
})
export const { setLoading } = loading.actions

export const mainTab = createSlice({
	name: 'mainTab',
	initialState: '',
	reducers: {
		setMainTab(state, action) {
			return action.payload
		},
	},
})
export const { setMainTab } = mainTab.actions
