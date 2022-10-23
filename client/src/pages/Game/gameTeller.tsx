import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import Items from 'pages/Game/items'
import GameCard from 'pages/Game/gameCard'

import { useModal } from 'actions/hooks/useModal'
import { setTime } from 'store/modules/game'

import card from 'assets/image/card1.webp'

export default function GameTeller(props: any) {
	const dispatch = useDispatch()
	const { nickname, client, roomId } = props

	const gameCards = useSelector((state: any) => state.gameCards)
	const teller = useSelector((state: any) => state.teller)
	const tellerMsg = useSelector((state: any) => state.tellerMsg)
	const players = useSelector((state: any) => state.players)
	const phase = useSelector((state: any) => state.phase)

	const [setModalState, setModalMsg] = useModal('')
	const [isImteller, setIsImteller] = useState(false)
	const [tellerCard, setTellerCard] = useState<any>({})
	const [descrip, setDescrip] = useState('')

	const [isSubmit, setIsSubmit] = useState(false)

	useEffect(() => {
		if (teller === nickname) {
			setIsImteller(true)
		} else {
			setIsImteller(false)
		}
	}, [teller, nickname])

	// phase 1에선 텔러만 카드 선택 및 묘사어 적기 다른 인원은 그냥 본인 카드만 보이게
	// phase 2에선 텔러는 그냥 구경하기, 다른 인원은 본인 카드에서 낚시 카드 선택하기
	const onSubmit = () => {
		if (!tellerCard.cardId) {
			setModalMsg('선택된 카드가 없습니다.')
			setModalState('alert')
			return
		}
		if (isImteller && !descrip) {
			setModalMsg('작성한 설명이 없습니다.')
			setModalState('alert')
			return
		}

		setIsSubmit(true)
		if (isImteller) {
			client.publish({
				destination: `/pub/room/${roomId}/teller`,
				body: JSON.stringify({
					nickname,
					cardId: tellerCard.cardId,
					cardUrl: tellerCard.cardUrl,
					cardMsg: descrip,
				}),
			})
			dispatch(setTime(0))
			return
		} else {
			client.publish({
				destination: `/pub/room/${roomId}/others`,
				body: JSON.stringify({
					nickname,
					cardId: tellerCard.cardId,
					cardUrl: tellerCard.cardUrl,
				}),
			})
			dispatch(setTime(0))
		}
	}

	return (
		<div css={tellerContainerCSS}>
			<div css={msgCSS}>
				{isImteller && phase === 'phase1' ? (
					!isSubmit ? (
						<div>당신은 텔러입니다. 한장의 카드를 고르고 작품명을 적어주세요.</div>
					) : (
						<div>다른 인원이 선택중입니다.</div>
					)
				) : phase === 'phase1' ? (
					<div>텔러가 카드를 선택중입니다.</div>
				) : !isImteller ? (
					<div>텔러의 작품명과 비슷한 카드를 골라주세요.</div>
				) : null}
			</div>

			<div css={selectCSS}>
				{(phase === 'phase1' && isImteller) || (phase === 'phase2' && !isImteller) ? (
					<>
						{tellerCard && !isSubmit ? (
							<div>
								<img css={selectedCardCSS} src={tellerCard.cardUrl} alt="" />
							</div>
						) : null}
					</>
				) : null}

				{phase === 'phase1' && isImteller && (
					<div>
						<label htmlFor="description"></label>
						<input
							css={submitInputCSS}
							id="description"
							type="text"
							value={descrip}
							onChange={(e) => setDescrip(e.target.value.slice(0, 20))}
						/>
					</div>
				)}
				{phase === 'phase2' ? (
					!isImteller ? (
						<div>{tellerMsg}</div>
					) : (
						<div>다른 인원이 비슷한 카드를 고르는 중입니다.</div>
					)
				) : null}

				{isSubmit ? null : (phase === 'phase1' && isImteller) ||
				  (phase === 'phase2' && !isImteller) ? (
					<button css={submitBtnCSS} onClick={onSubmit}>
						제출하기
					</button>
				) : null}
			</div>

			<div css={tableCSS}>
				<div css={cardCSS}>
					{gameCards.map((card) => (
						<div css={cardOneCSS} key={card.cardId} onClick={() => setTellerCard(card)}>
							<GameCard cardUrl={card.cardUrl} />
						</div>
					))}
				</div>

				<div css={itemCSS}>
					<Items client={client} roomId={roomId} />
				</div>
			</div>
		</div>
	)
}

const tellerContainerCSS = css({
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
const submitInputCSS = css`
	width: 100%;
	height: 30px;
	border: 0;
	border-radius: 12px;
	border: none;
	padding-left: 5px;
	margin: 5%;
	font-family: GongGothicMedium;
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

const itemCSS = css({
	width: '18%',
	maxWidth: '3em',
})
