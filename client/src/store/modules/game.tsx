import { createSlice } from '@reduxjs/toolkit'

export const isChecked = createSlice({
	name: 'isChecked',
	initialState: false,
	reducers: {
		setIsChecked(state, action) {
			return action.payload
		},
	},
})
export const { setIsChecked } = isChecked.actions

export const roomList = createSlice({
	name: 'roomList',
	initialState: [
		{
			roomId: 1,
			roomName: '아쉽지만 오프라인이군요!',
			isLocked: false,
			peopleNum: 1,
			maxPeopleNum: 5,
			type: 'socre',
			typeNum: 3,
		},
	],
	reducers: {
		setRoomList(state, action) {
			return action.payload
		},
	},
})
export const { setRoomList } = roomList.actions

export const roomInfo = createSlice({
	name: 'roomInfo',
	initialState: {
		// activated: [],
		// cards: {},
		// deck: [],
		// hand: {},
		// id: 0,
		// items: {},
		// laps: 0,
		// leader: '',
		// maxNum: 3,
		// nftDeck: [],
		// players: [],
		// profiles: {},
		// ready: {},
		// roomName: '',
		// score: {},
		// started: false,
		// status: {},
		// table: [],
		// teller: '',
		// timer: {},
		// turn: 0,
		// type: 'score',
		// typeNum: 10,
		// userSessionIds: {},
	},
	reducers: {
		setRoomInfo(state, action) {
			return action.payload
		},
		setReady1(state, action) {
			state.ready = action.payload
		},
	},
})
export const { setRoomInfo, setReady1 } = roomInfo.actions

export const chats = createSlice({
	name: 'chats',
	initialState: [
		// {
		// 	nickname: 'test',
		// 	userMsg: 'testtesttest',
		// 	time: '9/24/2022, 10:10:10 AM',
		// },
	],
	reducers: {
		clearChat(state) {
			return []
		},
		addChat(state, action) {
			state.push(action.payload)
		},
	},
})
export const { clearChat, addChat } = chats.actions

export const players = createSlice({
	name: 'players',
	initialState: [
		// {
		// 	nickname: 'SAMPLE',
		// 	profile: 'https://newsimg.sedaily.com/2020/11/07/1ZABD2GDRF_5.jpg',
		// 	status: false,
		// 	score: 0,
		// },
	],
	reducers: {
		setPlayers(state, action) {
			let copy = []
			for (let key in action.payload.profiles) {
				copy.push({
					nickname: key,
					profile: action.payload.profiles[key],
					score: action.payload.score[key] ? action.payload.score[key] : 0,
					status: action.payload.status[key] ? action.payload.status[key] : false,
				})
			}
			return copy
		},
		setStatus(state, action) {
			for (let key in action.payload) {
				for (let player in state) {
					if (state[player]['nickname'] === key) {
						state[player]['status'] = action.payload[key]
						break
					}
				}
			}
		},
		setScore(state, action) {
			for (let key in action.payload) {
				for (let player in state) {
					if (state[player]['nickname'] === key) {
						state[player]['score'] = action.payload[key]
					}
				}
			}
		},
		clearStatus(state: any) {
			for (let key in state) {
				state[key].status = false
			}
		},
		setReady2(state: any, action) {
			for (let key in state) {
				for (let nickname in action.payload) {
					if (state[key].nickname === nickname) {
						state[key].status = action.payload[nickname]
						break
					}
				}
			}
		},
		setSubmit(state, action) {
			for (let key in state) {
				if (state[key].nickname === action.payload.nickname) {
					state[key].status = action.payload.status
					break
				}
			}
		},
	},
})
export const { setPlayers, setScore, setStatus, clearStatus, setReady2 } = players.actions

export const phase = createSlice({
	name: 'phase',
	initialState: 0,
	reducers: {
		setPhase(state, action) {
			return action.payload
		},
	},
})
export const { setPhase } = phase.actions

export const time = createSlice({
	name: 'time',
	initialState: 0,
	reducers: {
		setTime(state, action) {
			return action.payload
		},
	},
})
export const { setTime } = time.actions

export const items = createSlice({
	name: 'items',
	initialState: [
		// {
		// 	cardId: 1,
		// 	grade: 'S',
		// 	effect: 2,
		// 	effectNum: 60,
		// 	used: false,
		// },
	],
	reducers: {
		setItems(state, action) {
			return action.payload
		},
	},
})
export const { setItems } = items.actions

export const itemState = createSlice({
	name: 'itemState',
	initialState: [
		// { cardId: 2, nickname: 'MoCCo', effect: 2, effectNum: 20 },
		// { cardId: 2, nickname: 'MoCCo', effect: 2, effectNum: 20 },
		// { cardId: 2, nickname: 'MoCCo', effect: 2, effectNum: 20 },
	],
	reducers: {
		setItemState(state, action) {
			const copy = []
			for (let item of action.payload.items) {
				if (item.nickname !== action.payload.nickname) {
					copy.push(item)
				}
			}
			return copy
		},
	},
})
export const { setItemState } = itemState.actions

export const gameCards = createSlice({
	name: 'gameCards',
	initialState: [
		// {
		// 	cardId: 1,
		// 	cardUrl: test,
		// },
	],
	reducers: {
		setGameCards(state, action) {
			return action.payload
		},
	},
})
export const { setGameCards } = gameCards.actions

export const selectedCards = createSlice({
	name: 'selectedCards',
	initialState: [],
	reducers: {
		setSelectedCards(state, action) {
			if (state.includes(action.payload)) {
				const idx = state.indexOf(action.payload)
				state.splice(idx, 1)
			} else {
				if (state.length < 3) {
					state.push(action.payload)
				}
			}
		},
		clearSelectedCards(state) {
			return []
		},
	},
})
export const { clearSelectedCards, setSelectedCards } = selectedCards.actions

export const teller = createSlice({
	name: 'teller',
	initialState: '',
	reducers: {
		setTeller(state, action) {
			return action.payload
		},
	},
})
export const { setTeller } = teller.actions

export const tellerMsg = createSlice({
	name: 'tellerMsg',
	initialState: '',
	reducers: {
		setTellerMsg(state, action) {
			return action.payload
		},
	},
})
export const { setTellerMsg } = tellerMsg.actions

export const table = createSlice({
	name: 'table',
	initialState: [],
	reducers: {
		setTable(state, action) {
			return action.payload
		},
	},
})
export const { setTable } = table.actions

export const result = createSlice({
	name: 'result',
	initialState: {},
	reducers: {
		setResult(state, action) {
			return action.payload
		},
	},
})
export const { setResult } = result.actions
