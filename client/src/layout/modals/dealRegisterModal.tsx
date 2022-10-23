import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import Card from 'components/card'
import { useState } from 'react'
import { setModalState } from 'store/modules/util'
import { setSelectedCard } from 'store/modules/art'

export default function DealRegisterModal(props: any) {
	const dispatch = useDispatch()

	const cardList = useSelector((state: any) => state.cardList)

	const onSelect = (card) => {
		dispatch(setSelectedCard(card))
		dispatch(setModalState(''))
	}

	// 카드 carousel
	let limit = 3
	const numPages = Math.ceil(cardList.length / limit) || 1
	const [page, setPage] = useState(0)
	// 왼쪽
	const moveLeft = () => {
		let num: number = Math.floor(page / limit)
		if (num === 0) {
			setPage((numPages - 1) * limit)
		} else {
			setPage((num - 1) * limit)
		}
	}
	// 오른쪽
	const moveRight = () => {
		let num: number = Math.floor(page / limit)
		if (num === numPages - 1) {
			setPage(0)
		} else {
			setPage((num + 1) * limit)
		}
	}

	return (
		<div css={registerModalCSS}>
			<div className="openModal modal">
				<section>
					<header>판매할 카드 선택</header>
					<main>
						<div className="window">
							<button onClick={moveLeft}>&lt;</button>
							<div className="container" css={paintListCSS}>
								{cardList.length ? (
									cardList.slice(page, page + limit).map((card) => (
										<div onClick={() => onSelect(card)} key={card.cardId} className="cardOne">
											<Card card={card} type={1} />
										</div>
									))
								) : (
									<p>소유중인 카드가 없습니다</p>
								)}
							</div>
							<button onClick={moveRight}>&gt;</button>
						</div>
					</main>
					<footer>
						<button onClick={() => dispatch(setModalState(''))}>취소</button>
					</footer>
				</section>
			</div>
		</div>
	)
}

const registerModalCSS = css`
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
	.window button {
		outline: none;
		cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
		border: 0;
		padding: 6px 12px;
		margin: 0px 10px 5px 10px;
		color: #1b5198;
		background-color: #d1e4ff;
		border-radius: 12px;
		font-size: 13px;
		width: 30px;
		font-family: 'GongGothicMedium';
		height: 30px;
	}
	.container {
		width: 500px;
	}
	.window {
		/* overflow: hidden; */
		/* position: relative; */
		/* width: 500px; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	footer {
		padding: 12px 16px;
		text-align: right;
		display: flex;
		justify-content: center;
	}
	button {
		outline: none;
		cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
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

const paintListCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
`
