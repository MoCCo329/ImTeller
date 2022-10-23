import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import GameCard from 'pages/Game/gameCard'
import Item from 'components/item'
import { useBGM } from 'actions/hooks/useBGM'

import card1 from 'assets/image/card1.webp'
import card2 from 'assets/image/card4.webp'
import card3 from 'assets/image/card11.webp'

export default function GameResult(props: any) {
	const dispatch = useDispatch()
	const { turnResult, submitCards, choiceCards } = props

	const table = useSelector((state: any) => state.table)
	const itemState = useSelector((state: any) => state.itemState)

	useBGM('result')

	const itemUse = (nickname) => {
		const use = []
		itemState.map((item) => {
			if (item.nickname === nickname) {
				use.push(<Item key={item.cardId} item={item} css={itemCSS} />)
			}
		})
		return use
	}

	const cardOwner = (cardId) => {
		let nickname
		let isTeller = false
		submitCards.map((subCard: any) => {
			if (cardId === subCard.cardId) {
				nickname = subCard.nickname
				isTeller = subCard.isTeller
			}
		})
		return (
			<div>
				<div
					css={nickCSS}
					style={
						isTeller ? { border: '2px solid white', padding: '0 5px', borderRadius: '10px' } : null
					}
				>
					{nickname} +{turnResult[nickname]}
				</div>
				<div css={itemCSS}>{itemUse(nickname)}</div>
			</div>
		)
	}

	const bets = (cardId) => {
		let result = []
		for (let nickname in choiceCards) {
			if (choiceCards[nickname] === cardId) {
				result.push(nickname)
			}
		}
		return (
			<div>
				{result.map((player) => (
					<div key={player}>{player}</div>
				))}
			</div>
		)
	}

	return (
		<div css={tableCSS}>
			<div css={cardCSS}>
				{table.map((card) => (
					<div css={cardOneCSS} key={card.cardId}>
						{/* 카드 주인 */}
						<div css={cardOwnerCSS}>{cardOwner(card.cardId)}</div>
						<GameCard cardUrl={card.cardUrl} />
						{/* 누가 배팅했었는지, 얻는 점수와 함께 */}
						<div css={betsCSS}>{bets(card.cardId)}</div>
					</div>
				))}
			</div>
		</div>
	)
}
const tableCSS = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
	fontFamily: 'GmarketSansMedium',
	color: 'white',
})
const cardOwnerCSS = css`
	height: 50px;
	> div {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-bottom: 5%;
	}
`
const cardCSS = css({
	display: 'flex',
	justifyContent: 'space-evenly',
	alignItems: 'start',
	flexWrap: 'wrap',
	width: '90%',
})
const cardOneCSS = css({
	width: '23%',
})
const nickCSS = css({
	maxWidth: '55%',
	height: '100%',
	overflow: 'hidden',
	margin: '0 5px',
})
const itemCSS = css({
	display: 'flex',
	overflow: 'hidden',
	width: '35px',
})
const betsCSS = css``
