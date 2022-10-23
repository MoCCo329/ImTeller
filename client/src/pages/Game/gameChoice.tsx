import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import GameCard from 'pages/Game/gameCard'

import { setTime } from 'store/modules/game'
import { useModal } from 'actions/hooks/useModal'

export default function GameChoice(props: any) {
	const { nickname, client, roomId } = props
	const dispatch = useDispatch()

	const table = useSelector((state: any) => state.table)
	const teller = useSelector((state: any) => state.teller)
	const tellerMsg = useSelector((state: any) => state.tellerMsg)
	const itemState = useSelector((state: any) => state.itemState)

	const [isImteller, setIsImteller] = useState(false)
	const [choicedCard, setChoicedCard] = useState<any>({})
	const [isSubmit, setIsSubmit] = useState(false)

	const [blind, setBlind] = useState(false)
	const [blindDetail, setBlindDetail] = useState(0)
	const [darkmode, setDarkmode] = useState(false)

	const [setModalState, setModalMsg] = useModal('')

	useEffect(() => {
		if (teller === nickname) {
			setIsImteller(true)
		}
	}, [teller, nickname])

	useEffect(() => {
		itemState.map((item) => {
			if (item.effect === 6) setDarkmode(true)
			if (item.effect === 2) {
				setBlind(true)
				setBlindDetail(Math.max(blindDetail, item.effectNum))
			}
		})
	}, [])

	const onSubmit = () => {
		if (isImteller) return
		if (!choicedCard) {
			setModalMsg('선택된 카드가 없습니다.')
			setModalState('alert')
			return
		}

		setIsSubmit(true)
		client.publish({
			destination: `/pub/room/${roomId}/choice`,
			body: JSON.stringify({
				nickname,
				cardId: choicedCard.cardId,
				cardUrl: choicedCard.cardUrl,
			}),
		})
		dispatch(setTime(0))
	}

	return (
		<div css={choiceContainerCSS}>
			<div css={msgCSS}>
				{isImteller ? (
					<div>다른 사람들이 카드를 맞추는 중입니다.</div>
				) : (
					<div>작품명으로 텔러의 그림을 맞춰주세요.</div>
				)}
			</div>

			<div css={selectCSS}>
				{!isImteller && choicedCard.cardUrl ? (
					<GameCard
						choice={true}
						cardUrl={choicedCard.cardUrl}
						blind={blind}
						blindDetail={blindDetail}
						darkmode={darkmode}
					/>
				) : null}
				<span>{tellerMsg}</span>

				{isSubmit ? null : !isImteller ? (
					<button css={submitBtnCSS} onClick={onSubmit}>
						제출하기
					</button>
				) : null}
			</div>

			<div css={tableCSS}>
				<div css={cardCSS}>
					{table.map((card) => (
						<div css={cardOneCSS} key={card.cardId} onClick={() => setChoicedCard(card)}>
							<GameCard
								cardUrl={card.cardUrl}
								blind={blind}
								blindDetail={blindDetail}
								darkmode={darkmode}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

const choiceContainerCSS = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	fontFamily: 'GmarketSansMedium',
	color: 'white',
	width: '100%',
})

const msgCSS = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 1vh;
`
const selectedCardCSS = css`
	width: 30px;
	margin: 0 10px;
`
const selectCSS = css`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	min-height: 12vh;
`
const submitBtnCSS = css`
	max-width: 120px;
	height: 30px;
	border: 0;
	border-radius: 12px;
	border: none;
	margin: 5%;
	background-color: #d1e4ff;
	font-family: GongGothicMedium;

	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	&:hover {
		color: #d1e4ff;
		background-color: #112137;
	}
`
const tableCSS = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
	height: '60vh',
})
const cardCSS = css({
	display: 'flex',
	justifyContent: 'space-evenly',
	flexWrap: 'wrap',
	width: '90%',
})
const cardOneCSS = css({
	width: '21%',
})
