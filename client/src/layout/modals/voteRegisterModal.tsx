import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'

import CardList from 'components/cardList'

import { setModalState, setModalMsg } from 'store/modules/util'
import { setVoteList } from 'store/modules/art'
import art from 'actions/api/art'
import vote from 'actions/api/vote'

export default function VoteRegisterModal(props: any) {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const paintList = useSelector((state: any) => state.paintList)
	const selectedPaint = useSelector((state: any) => state.selectedPaint)

	const onSubmit = () => {
		if (!selectedPaint) {
			dispatch(setModalMsg('선택된 작품이 없습니다.'))
			dispatch(setModalState('alert'))
			return
		}

		art
			.paintRegist(selectedPaint)
			.then((result) => {
				if (result.data.response === '제출 성공') {
					vote.paintList().then((result) => {
						dispatch(setVoteList(result.data.response))
					})
					dispatch(setModalMsg('출품이 완료되었습니다.'))
					dispatch(setModalState('alert'))
				} else {
					dispatch(setModalMsg('등록에 실패했습니다.'))
					dispatch(setModalState('alert'))
				}
			})
			.catch((error) => {
				console.error(error)
				dispatch(setModalMsg('출품에 실패했습니다.'))
				dispatch(setModalState('alert'))
			})
		vote.paintList().then((result) => {
			dispatch(setVoteList(result.data.response))
		})
	}

	return (
		<div css={makeRoomModalCSS}>
			<div className="openModal modal">
				<section>
					<header>출품할 작품 선택</header>
					<main>
						<div>
							<CardList cardList={paintList} isCard={false} type={1} />
						</div>
					</main>
					<footer>
						<button onClick={() => dispatch(setModalState(''))}>취소</button>
						<button onClick={onSubmit}>출품</button>
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
		max-width: 800px;
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
