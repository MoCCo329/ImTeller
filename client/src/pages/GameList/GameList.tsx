import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import Layout from 'layout/layout'
import Room from 'pages/GameList/room'

import game from 'actions/api/game'
import { setIsChecked, setRoomList } from 'store/modules/game'
import { setMainTab } from 'store/modules/util'
import { useBGM } from 'actions/hooks/useBGM'
import { useModal } from 'actions/hooks/useModal'
import { fullDisplay } from 'style/commonStyle'

export default function GameList() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [setModalState, setModalMsg] = useModal('')
	dispatch(setMainTab('game'))

	const roomList = useSelector((state: any) => state.roomList)
	const currentUser = useSelector((state: any) => state.currentUser)
	const isBgmOn = useSelector((state: any) => state.isBgmOn)

	useBGM('gameList')

	useEffect(() => {
		refresh()
	}, [])

	const makeRoom = () => {
		if (!currentUser.nickname) {
			return navigate('/login')
		}
		setModalState('makeRoom')
	}

	const joinRoom = (roomId, isLocked) => {
		if (!currentUser.nickname) {
			return navigate('/login')
		}
		dispatch(setIsChecked(!isLocked))
		navigate(`/game/${roomId}`)
		useBGM('game')
	}

	const refresh = () => {
		game.roomList().then((result) => {
			// console.log(result.data.response)
			dispatch(setRoomList(result.data.response))
		})
	}

	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={centerCSS}>
					<div css={listWrapper}>
						<div css={roomListCSS}>
							{roomList.length
								? roomList.map((room: any) => (
										<div
											className="room"
											key={room.roomId}
											onClick={() => joinRoom(room.roomId, room.locked)}
										>
											<Room room={room} />
										</div>
								  ))
								: null}
						</div>
						<div className="btns">
							<button onClick={makeRoom} css={button}>
								방만들기
							</button>
							<button onClick={refresh} css={button}>
								새로고침
							</button>
						</div>
					</div>
				</div>
			</main>
		</Layout>
	)
}

const roomListCSS = css`
	display: grid;
	grid-template-rows: repeat(auto-fill, minmax(145px, 145px));
	grid-template-columns: repeat(auto-fill, minmax(320px, 320px));
	grid-gap: 0.5rem;
	justify-content: center;
	background-color: rgba(239, 238, 245, 0.15);
	border-radius: 1rem;
	width: 100%;
	height: 65vh;
	overflow-y: auto;
	padding: 1rem;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 5px;
		background-color: #3e525f;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ffffff;
		border-radius: 5px;
	}

	.room {
		display: flex;
		justify-content: center;
		align-items: center;
	}
`
const centerCSS = css`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	font-family: 'GongGothicMedium';
`
const listWrapper = css`
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.btns {
		display: flex;
		margin-top: 1rem;
		margin-left: auto;
	}
`
const button = css`
	outline: 'none';
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	border: 5px solid rgb(163, 151, 198);
	padding: 6px 20px 6px 20px;
	margin: 0px 10px 5px 10px;
	color: white;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 20px;
	font-size: 25px;
	width: 160px;
	height: 70px;
	font-family: 'GongGothicMedium';
	:hover {
		box-shadow: 1px 2px 2px 2px rgba(255, 255, 255, 0.2);
	}
	/* font-family: 'GmarketSansMedium';
	outline: none;
	height: 40px;
	text-align: center;
	width: 130px;
	border-radius: 40px;
	border: 1px solid white;
	color: #f9f6f6;
	background: rgb(74, 59, 117);
	letter-spacing: 1px;
	text-shadow: 0;
	font: {
		size: 12px;
		weight: bold;
	}
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	transition: all 0.25s ease;
	&:hover {
		font-family: 'GongGothicMedium';
		color: black;
		background: rgb(255, 255, 255, 0.6);
		border: 2px solid black;
	}
	&:active {
		//letter-spacing: 2px;
		letter-spacing: 2px;
	} */
`
const right = css`
	width: 80%;
	display: flex;
	justify-content: end;
`
