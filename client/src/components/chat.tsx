import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { css } from '@emotion/react'

import { useWebSocket } from 'actions/hooks/useWebSocket'
import { clearChat, addChat } from 'store/modules/game'

import jenkins from 'assets/image/jenkins.webp'
import Send from 'assets/image/send.png'

export default function Chat() {
	const dispatch = useDispatch()

	const scrollRef = useRef<null | HTMLDivElement>(null)
	const { roomId } = useParams()
	const chats = useSelector((state: any) => state.chats)
	const { nickname } = useSelector((state: any) => state.currentUser)
	const email = useSelector((state: any) => state.email) || localStorage.getItem('email')
	const roomInfo = useSelector((state: any) => state.roomInfo)

	const [msgInput, setMsgInput] = useState('')
	const [ws, setWs] = useState<any>('')

	useEffect(() => {
		dispatch(clearChat())
	}, [])

	useEffect(() => {
		const client = useWebSocket({ email })
		client.onConnect = (frame) => {
			client.subscribe(`/sub/room/${roomId}/chat`, (response) => {
				const content = JSON.parse(response.body)
				const time = new Date()
				content.time = time.toLocaleString()
				dispatch(addChat(content))
			})
		}
		client.activate()
		setWs(client)
		return () => {
			client.deactivate()
		}
	}, [])
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [chats])
	const send = () => {
		if (!msgInput) return
		ws.publish({
			destination: `/pub/room/${roomId}/chat`,
			body: JSON.stringify({
				nickname,
				userMsg: msgInput,
			}),
		})
		setMsgInput('')
	}

	const isMyMsg = (nick) => {
		if (nick === nickname) return true
		return false
	} // 이 값에 따라서 style 다르게. 카톡처럼 내꺼면 오른쪽

	const getProfile = (nickname) => {
		return roomInfo.profiles[nickname]
	} // 프로필 url 가져오기

	return (
		<div css={chatCSS}>
			<div className="box">
				<div className="chat">
					{chats.length
						? chats.map((chat, idx) => (
								<div
									className="msg"
									key={String(idx) + chat.time}
									style={
										isMyMsg(chat.nickname) ? { backgroundColor: 'rgb(255,255,255,0.5)' } : null
									}
								>
									<div className="profileBox">
										<img
											className="profile"
											src={chat.nickname === '겜비서' ? jenkins : getProfile(chat.nickname)}
											title={chat.time}
										/>
									</div>
									<div className="vertical">
										<div className="name">{chat.nickname}</div>
										<p className="content">{chat.userMsg}</p>
									</div>
									{/* <div>{chat.time ? chat.time : null}</div> */}
								</div>
						  ))
						: null}
					<div ref={scrollRef}></div>
				</div>
			</div>
			<div className="line">
				<input
					className="input"
					type="text"
					onChange={(e) => {
						setMsgInput(e.target.value)
					}}
					value={msgInput}
					onKeyDown={(e) => {
						if (e.key === 'Enter') send()
					}}
					autoFocus
				/>
				<div className="btn" onClick={send}>
					<img src={Send} alt="전송버튼" />
				</div>
			</div>
		</div>
	)
}

const chatCSS = css`
	display: flex;
	flex-direction: column;
	/* justify-content: space-between; */
	align-items: center;
	border-radius: 15px;
	background-color: rgb(0, 0, 0, 0.4);
	width: 100%;
	height: 100%;
	color: white;
	position: relative;
	.box {
		position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		border-radius: 10px;
	}
	.chat {
		width: 100%;
		height: 100%;
		overflow: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		height: 90%;
		overflow: auto;
		border-radius: 10px;

		&::-webkit-scrollbar {
			width: 8px;
			height: 8px;
			border-radius: 3px;
			background-color: #3e525f;
		}
		&::-webkit-scrollbar-thumb {
			background-color: #ffffff;
			border-radius: 3px;
		}
	}

	.msg {
		/* padding: 3px; */
		margin: 2px;
		border-radius: 15px;
		display: flex;
		flex-direction: row;
		align-items: center;

		.profileBox {
			display: flex;
			width: 40px;
			height: 40px;
			border-radius: 60%;
			overflow: hidden;
			margin: 5px;
			.profile {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		.vertical {
			display: flex;
			flex-direction: column;
			max-width: 80%;

			.name {
				font-family: 'GmarketSansMedium';
				font-size: 1rem;
				margin-top: 1rem;
			}
			.content {
				font-family: 'GmarketSansMedium';
				white-space: pre-line;
				word-break: break-all;
				position: relative;
				padding: 3px 0;
				margin: 0.5rem 0;
			}
		}
		.profile {
		}
	}

	.line {
		display: flex;
		justify-content: space-around;
		position: absolute;
		bottom: 0;
		align-items: center;
		width: 96%;
		height: 8%;
		margin: 10px;

		.input {
			align-items: stretch;
			padding-left: 0.5rem;
			width: 88%;
			height: 30px;
			border-radius: 20px;
			background-color: white;
			border: 0px;
			font-family: 'GmarketSansMedium';
		}

		.btn {
			display: flex;
			justify-content: center;
			align-items: center;

			img {
				height: 2rem;
				width: 2rem;
			}

			img:hover {
				transform: scale(1.2, 1.2) rotate(15deg);
				transition: all ease 0.1s;
			}
		}
	}
`
