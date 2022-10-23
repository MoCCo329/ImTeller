import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { css } from '@emotion/react'

import GameHeader from 'pages/Game/gameHeader'
import GameTeller from 'pages/Game/gameTeller'
import GameChoice from 'pages/Game/gameChoice'
import GameResult from 'pages/Game/gameResult'
import GameRoom from 'pages/Game/gameRoom'
import GameEnd from 'pages/Game/gameEnd'
import Chat from 'components/chat'
import GameProfile from 'components/gameProfile'

import { useWebSocket } from 'actions/hooks/useWebSocket'
import { useModal } from 'actions/hooks/useModal'
import {
	setIsChecked,
	setRoomInfo,
	setReady1,
	setReady2,
	setPlayers,
	addChat,
	setScore,
	setStatus,
	clearStatus,
	setGameCards,
	setTime,
	setPhase,
	setTable,
	setResult,
	setTeller,
	setTellerMsg,
	setItems,
	setItemState,
	clearSelectedCards,
} from 'store/modules/game'
import art from 'actions/api/art'

export default function Game() {
	const dispatch = useDispatch()
	const { roomId } = useParams()

	const { nickname } = useSelector((state: any) => state.currentUser)
	const email = useSelector((state: any) => state.email)
	const isChecked = useSelector((state: any) => state.isChecked)
	const players = useSelector((state: any) => state.players)
	const selectedCard = useSelector((state: any) => state.selectedCards)
	const roomInfo = useSelector((state: any) => state.roomInfo)
	const phase = useSelector((state: any) => state.phase) // state가 1일때 작동. 1: 텔러 2: 낚시그림선택 3: 텔러맞추기 4: 결과
	const items = useSelector((state: any) => state.items)
	const itemState = useSelector((state: any) => state.itemState)
	const isBgmOn = useSelector((state: any) => state.isBgmOn)
	const bgmVolume = useSelector((state: any) => state.bgmVolume)

	const [ws, setWs] = useState<any>('')
	const [state, setState] = useState(0) // 0 이면 gameRoom, 1이면 gameTeller, gameChoice, gameResult, 2이면 gameEnd
	const [turnResult, setTurnResult] = useState<any>([])
	const [submitCards, setSubmitCards] = useState<any>([])
	const [choiceCards, setChoiceCards] = useState<any>([])
	const [userSessionIds, setUserSessionIds] = useState('')
	const [bgm, setBgm] = useState<any>('')

	const [setModalState, setModalMsg] = useModal('')

	// 게임화면에선 useBGM이 안먹힌다...
	useEffect(() => {
		const newBgm = new Audio(require('assets/audio/game.mp3'))
		newBgm.loop = true
		setBgm(newBgm)
		return () => {
			if (newBgm) newBgm.pause()
		}
	}, [])
	useEffect(() => {
		if (!bgm) return
		if (isBgmOn) bgm.play()
		if (!isBgmOn) bgm.pause()
		bgm.volume = bgmVolume / 100
	}, [bgm, isBgmOn, bgmVolume])

	// 새로고침 방지
	const blockRefresh = (event) => {
		event.preventDefault()
		event.returnValue = ''
	}
	useEffect(() => {
		window.addEventListener('beforeunload', blockRefresh)
		art
			.cardList({ nickname })
			.then((result) => {
				dispatch(setGameCards(result.data.response))
			})
			.catch((error) => {
				console.error(error)
			})
		return () => {
			window.removeEventListener('beforeunload', blockRefresh)
			setState(0)
			dispatch(setPhase(0))
			dispatch(clearSelectedCards())
		}
	}, [])

	useEffect(() => {
		if (!isChecked) {
			setModalState('joinRoom')
		}
		return () => {
			dispatch(setIsChecked(false))
		}
	}, [roomId])

	// 웹소켓
	useEffect(() => {
		if (!isChecked) return
		const client = useWebSocket({ email })
		client.onConnect = () => {
			client.publish({
				destination: `/pub/room/${roomId}/join`,
				body: JSON.stringify({ nickname }),
			})
			// 출입에 따라 방정보 변경
			client.subscribe(`/sub/room/${roomId}/join`, (action) => {
				const content = JSON.parse(action.body)
				dispatch(setRoomInfo(content))
				dispatch(setPlayers(content))
				setUserSessionIds(content.userSessionIds[nickname])
				// console.log('join', content)
			})
			client.subscribe(`/sub/room/${roomId}/exit`, (action) => {
				const content = JSON.parse(action.body)
				dispatch(setRoomInfo(content))
				dispatch(setPlayers(content))
				setUserSessionIds(content.userSessionIds[nickname])
				// console.log('exit', content)
			})
			// 레디 상태 변경
			client.subscribe(`/sub/room/${roomId}/ready`, (action) => {
				const content = JSON.parse(action.body)
				dispatch(setReady1(content))
				dispatch(setReady2(content))
				// console.log('ready', content)
			})
			// 페이즈 전환
			client.subscribe(`/sub/room/${roomId}/phase`, (action) => {
				dispatch(setTime(0))
				dispatch(setPhase(action.body))
				// console.log(action.body)
			})
			// 유저 상태 변화
			client.subscribe(`/sub/room/${roomId}/status`, (action) => {
				const content = JSON.parse(action.body)
				dispatch(setStatus(content))
			})
			// 텔러 누군지 받기
			client.subscribe(`/sub/room/${roomId}/newteller`, (action: any) => {
				// console.log('newTeller', action.body)
				dispatch(setTeller(action.body))
			})
			// 텔러 문구 받기
			client.subscribe(`/sub/room/${roomId}/teller`, (action) => {
				// console.log('teller', action.body)
				dispatch(setTellerMsg(action.body))
			})
			// 테이블 받기
			client.subscribe(`/sub/room/${roomId}/table`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('table', content)
				dispatch(setTable(content))
			})
			// 누군가 아이템 사용
			client.subscribe(`/sub/room/${roomId}/item`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('item', content)
				dispatch(setItemState({ items: content, nickname }))
			})
			// 결과 받기
			client.subscribe(`/sub/room/${roomId}/result`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('result', content)
				setTurnResult(content)
			})
			client.subscribe(`/sub/room/${roomId}/totalresult`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('totalresult', content)
				dispatch(setScore(content))
				dispatch(setResult(content))
			})
			client.subscribe(`/sub/room/${roomId}/submitcards`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('submitcards', content)
				setSubmitCards(content)
			})
			client.subscribe(`/sub/room/${roomId}/choicecards`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('choice', content)
				setChoiceCards(content)
			})
			// 새로고침
			client.subscribe(`/sub/room/${roomId}/roominfo`, (action) => {
				const content = JSON.parse(action.body)
				dispatch(setRoomInfo(content))
				dispatch(setPlayers(content))
				setUserSessionIds(content.userSessionIds[nickname])
				// console.log('roominfo', content)
			})
		}
		client.activate()
		setWs(client)
		return () => {
			client.publish({
				destination: `/pub/room/${roomId}/exit`,
				body: JSON.stringify({ nickname }),
			})
			client.deactivate()
		}
	}, [isChecked])

	// userSessionId 최신화가 필요한 구독
	let mycards
	let item
	useEffect(() => {
		try {
			// 카드패 받기
			mycards = ws.subscribe(`/user/${userSessionIds}/room/${roomId}/mycards`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('mycards', content)
				dispatch(setGameCards(content))
			})
			// 내 아이템 받기
			item = ws.subscribe(`/user/${userSessionIds}/room/${roomId}/item`, (action) => {
				const content = JSON.parse(action.body)
				// console.log('myitem', content)
				dispatch(setItems(content))
			})
		} catch {}
		return () => {
			if (mycards) {
				mycards.unsubscribe()
			}
			if (item) {
				item.unsubscribe()
			}
		}
	}, [userSessionIds, roomId])

	// selectedCard 최신화가 필요한 구독
	let start
	useEffect(() => {
		try {
			// 시작시 선택카드 제출
			start = ws.subscribe(`/sub/room/${roomId}/start`, (action) => {
				// console.log('start', action.body)
				const content = JSON.parse(action.body)
				if (!content) return
				ws.publish({
					destination: `/pub/room/${roomId}/select`,
					body: JSON.stringify({
						nickname,
						selectedCard,
					}),
				})
			})
		} catch {}
		return () => {
			if (start) {
				start.unsubscribe()
			}
		}
	}, [selectedCard, roomInfo.ready])

	// // 페이즈별 상태 최신화
	useEffect(() => {
		if (phase === 'phase1') {
			setState(1)
			dispatch(setTeller(''))
			dispatch(setTellerMsg(''))
			dispatch(clearStatus())
			dispatch(setItemState({ items: [], nickname }))
			dispatch(setTime(30))
			if (items.length) {
				dispatch(addChat({ nickname: '겜비서', userMsg: '더블클릭해 아이템을 사용해보세요' }))
			}
		} else if (phase === 'phase2') {
			setState(1)
			dispatch(setTime(30))
		} else if (phase === 'phase3') {
			setState(1)
			dispatch(clearStatus())
			dispatch(setTime(30))
			dispatch(setTime(calculateTime()))
		} else if (phase === 'phase4') {
			setState(1)
			dispatch(setTime(10))
		} else if (phase === 'end') {
			setState(2)
			dispatch(setTime(10))
			dispatch(setItemState({ items: [], nickname }))
			dispatch(addChat({ nickname: '겜비서', userMsg: '게임이 종료되었습니다' }))
		}
	}, [phase])

	// 아이템 유무에 따른 시간 계산
	const calculateTime = () => {
		let timeItem = 0
		itemState.map((item) => {
			if (item.effect === 1) {
				timeItem = Math.max(timeItem, item.effectNum)
			}
		})
		return 30 - timeItem
	}

	return (
		<main css={roomBg}>
			<div>
				<GameHeader />
			</div>

			<div css={playerBoxCSS}>
				<div css={playersCSS}>
					{players.map((player: any) => (
						<div key={player.nickname} css={playerOne}>
							<GameProfile player={player} />
						</div>
					))}
				</div>
			</div>

			<div css={gameContainerCSS}>
				<div css={mainComponentCSS}>
					{state === 0 ? (
						<GameRoom nickname={nickname} client={ws} roomId={roomId} />
					) : state === 1 ? (
						phase === 'phase1' || phase === 'phase2' ? (
							<GameTeller nickname={nickname} client={ws} roomId={roomId} />
						) : phase === 'phase3' ? (
							<GameChoice nickname={nickname} client={ws} roomId={roomId} />
						) : (
							<GameResult
								turnResult={turnResult}
								submitCards={submitCards}
								choiceCards={choiceCards}
							/>
						)
					) : (
						<GameEnd setState={setState} client={ws} roomId={roomId} />
					)}
				</div>

				<div css={chatCSS}>
					<Chat />
				</div>
			</div>
		</main>
	)
}

const roomBg = css({
	backgroundImage: 'linear-gradient(-225deg, #5271C4 0%, #B19FFF 48%, #ECA1FE 100%)',
	backgroundSize: 'cover',
	height: '100vh',
})

const playerBoxCSS = css({
	display: 'flex',
	justifyContent: 'space-evenly',
	width: '100%',
})

const playersCSS = css({
	display: 'flex',
	justifyContent: 'space-evenly',
	flexWrap: 'wrap',
	width: '100%',
})

const playerOne = css({
	margin: '0.5%',
	flexGrow: 1,
	flexShrink: 1,
	flexBasis: '14%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
})

const gameContainerCSS = css({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	width: '100%',
	height: '75vh',
})

const mainComponentCSS = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	justifyContent: 'center',
	width: '62%',
	margin: '1.5%',
})

const chatCSS = css({
	width: '32%',
	margin: '1.5%',
})
