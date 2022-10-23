import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import game from 'actions/api/game'
import { setModalState } from 'store/modules/util'
import { setIsChecked } from 'store/modules/game'

export default function JoinRoomModal(props: any) {
	const navigate: any = useNavigate()
	const dispatch = useDispatch()

	const [password, setPassword] = useState('')
	const [authError, setAuthError] = useState('')

	const path = window.location.pathname
	let roomId
	if (!path.includes('/game/')) {
		roomId = 0
	} else {
		roomId = path.split('/').slice(-1)[0]
	}

	useEffect(() => {
		if (!roomId) {
			dispatch(setModalState(''))
			navigate(-1, { replace: true })
		} else {
			onSubmit()
		}
	}, [roomId])

	const onSubmit = () => {
		setAuthError('')
		game
			.join(roomId, { password })
			.then((result) => {
				if (!result.data.response) return setAuthError('잘못된 비밀번호입니다')
				dispatch(setIsChecked(true))
				dispatch(setModalState(''))
			})
			.catch((error) => {
				setAuthError('잘못된 접근입니다')
			})
	}

	return (
		<div css={joinRoomModalCSS}>
			<div className="openModal modal">
				<section>
					<header>방 입장하기</header>
					<main>
						<div>{authError}</div>
						<input
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') onSubmit()
								if (e.key === 'Escape') {
									dispatch(setModalState(''))
									navigate(-1, { replace: true })
								}
							}}
							type="password"
							autoFocus
						/>
					</main>
					<footer>
						<button
							onClick={() => {
								dispatch(setModalState(''))
								navigate(-1, { replace: true })
							}}
						>
							취소
						</button>
						<button onClick={onSubmit}>입장</button>
					</footer>
				</section>
			</div>
		</div>
	)
}
const joinRoomModalCSS = css`
	.modal {
		display: none;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.6);
	}
	section {
		width: 90%;
		max-width: 500px;
		margin: 0 auto;
		border-radius: 25px;
		background-color: #fff;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-show 0.3s;
		overflow: hidden;
	}
	header {
		position: relative;
		padding: 25px 16px 16px 16px;
		display: flex;
		justify-content: center;
		font-family: 'GongGothicMedium';
		font-size: 25px;
	}
	main {
		padding: 16px;
		font-family: 'GmarketSansMedium';
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	input {
		font-family: 'GmarketSansMedium';
		border-radius: 50px;
		border-color: #c9c9c9;
		padding: 8px;
		margin: 3px 10px 10px 10px;
		width: 60%;
	}
	footer {
		padding: 12px 16px;
		text-align: right;
		display: flex;
		justify-content: center;
	}
	button {
		outline: none;
		cursor: pointer;
		border: 0;
		padding: 6px 12px;
		margin: 0px 10px 5px 10px;
		color: #1b5198;
		background-color: #d1e4ff;
		border-radius: 12px;
		font-size: 13px;
		width: 8em;
		font-family: 'GongGothicMedium';
	}
	.openModal {
		display: flex;
		align-items: center;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-bg-show 0.3s;
	}
	@keyframes modal-show {
		from {
			opacity: 0;
			margin-top: -50px;
		}
		to {
			opacity: 1;
			margin-top: 0;
		}
	}
	@keyframes modal-bg-show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`
