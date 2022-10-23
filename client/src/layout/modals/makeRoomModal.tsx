import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import game from 'actions/api/game'
import { setIsChecked } from 'store/modules/game'
import { setModalState } from 'store/modules/util'

export default function MakeRoomModal(props: any) {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const currentUser = useSelector((state: any) => state.currentUser)

	const [roomName, setRoomName] = useState('')
	const [isLocked, setIsLocked] = useState(false)
	const [maxNum, setMaxNum] = useState(6)
	const [type, setType] = useState('times')
	const [typeNumRound, setTypeNumRound] = useState(2)
	const [typeNumScore, setTypeNumScore] = useState(50)
	const [roomPw, setRoomPw] = useState('')

	const roomNameFilter = (event) => {
		if (event.target.value.length > 30) {
			event.target.value = event.target.value.slice(0, 30)
		}
		setRoomName(event.target.value)
	}

	const onSubmit = (event) => {
		event.preventDefault()
		if (!roomName || !maxNum) return

		const roomInfo: any = {
			roomName,
			roomPw,
			maxNum,
			type,
			leader: currentUser.nickname,
		}
		if (type === 'score') {
			roomInfo.typeNum = typeNumScore
		} else {
			roomInfo.typeNum = typeNumRound
		}
		if (!isLocked) {
			roomInfo.roomPw = ''
		}
		game
			.make(roomInfo)
			.then((result) => {
				dispatch(setIsChecked(true))
				dispatch(setModalState(''))
				navigate(`/game/${result.data.response}`)
			})
			.catch((error) => {
				console.error(error)
			})
	}

	// 라디오 말고 버튼으로 만들면 더 꾸미기 좋을듯. radio 기본값 선택
	return (
		<div css={makeRoomModalCSS}>
			<div className="openModal modal">
				<section>
					<header>방 만들기</header>
					<main>
						<form>
							<input
								onChange={roomNameFilter}
								placeholder="방 제목"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === 'Enter') onSubmit(e)
									if (e.key === 'Escape') {
										dispatch(setModalState(''))
									}
								}}
							></input>
							<label htmlFor="max">최대 인원수</label>
							<select id="max" defaultValue={6} onChange={(e: any) => setMaxNum(e.target.value)}>
								<option value={3}>3명</option>
								<option value={4}>4명</option>
								<option value={5}>5명</option>
								<option value={6}>6명</option>
							</select>
							<div className="options">
								<label>게임 타입</label>
								<label>
									<input
										onChange={() => setType('score')}
										type="radio"
										name="type"
										checked={type == 'score'}
									></input>
									점수
								</label>
								<label>
									<input
										onChange={() => setType('times')}
										type="radio"
										name="type"
										checked={type == 'times'}
									></input>
									라운드
								</label>
							</div>
							{type == 'score' ? (
								<input
									onChange={(e: any) => setTypeNumScore(e.target.value)}
									placeholder="승리 점수"
									defaultValue={typeNumScore}
								></input>
							) : (
								<>
									<label htmlFor="round">라운드 수</label>
									<select
										id="round"
										onChange={(e: any) => setTypeNumRound(e.target.value)}
										defaultValue={typeNumRound}
									>
										<option value={2}>2라운드</option>
										<option value={3}>3라운드</option>
										<option value={4}>4라운드</option>
										<option value={5}>5라운드</option>
									</select>
								</>
							)}
							<div className="options">
								<label>공개 여부</label>
								<label>
									<input
										onChange={(e) => setIsLocked(false)}
										type="radio"
										name="lock"
										value={'공개'}
										checked={!isLocked}
									></input>
									공개
								</label>
								<label>
									<input
										onChange={(e) => setIsLocked(true)}
										type="radio"
										name="lock"
										checked={isLocked}
									></input>
									비공개
								</label>
							</div>
							{isLocked ? (
								<input onChange={(e) => setRoomPw(e.target.value)} placeholder="비밀번호"></input>
							) : null}
						</form>
					</main>
					<footer>
						<button
							onClick={() => {
								dispatch(setModalState(''))
							}}
						>
							취소
						</button>
						<button onClick={onSubmit}>생성</button>
					</footer>
				</section>
			</div>
		</div>
	)
}

const makeRoomModalCSS = css`
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
		max-width: 450px;
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
	}
	form {
		display: flex;
		flex-direction: column;
	}
	input {
		font-family: 'GmarketSansMedium';
		border-radius: 50px;
		border-color: #c9c9c9;
		padding: 8px;
		margin: 3px 10px 10px 10px;
	}
	select {
		font-family: 'GmarketSansMedium';
		border-radius: 50px;
		border-color: #c9c9c9;
		padding: 8px;
		margin: 0px 10px 0px 10px;
	}
	.options {
		margin: 20px 20px 3px 20px;
		display: flex;
		justify-content: space-between;
	}
	.options input {
		border: none;
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
