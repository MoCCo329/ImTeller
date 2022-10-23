import Card from 'components/card'
import Paint from 'components/paint'
import { css } from '@emotion/react'

import { useState } from 'react'

interface CardListProps {
	cardList: any[]
	isCard?: boolean
	type?: number
}

export default function CardList(props: CardListProps) {
	const { cardList, isCard, type } = props
	const [page, setPage] = useState(0)

	// 카드 carousel
	let limit = 3
	const numPages = Math.ceil(cardList.length / limit) || 1
	// console.log('numPages', numPages)
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
		// console.log('page', page)
		if (num === numPages - 1) {
			setPage(0)
		} else {
			setPage((num + 1) * limit)
		}
	}

	return (
		<div css={centerCSS}>
			{cardList.length ? (
				isCard ? (
					type ? (
						<div className="window">
							<button onClick={moveLeft}>&lt;</button>
							<div className="container">
								<div css={type ? paintList1CSS : paintList0CSS}>
									{cardList.slice(page, page + limit).map((card) => {
										return <Card card={card} type={type} key={card.cardId} />
									})}
								</div>
							</div>
							<button onClick={moveRight}>&gt;</button>
						</div>
					) : (
						<div css={type ? paintList1CSS : paintList0CSS}>
							{cardList.map((card) => {
								return <Card card={card} type={type} key={card.cardId} />
							})}
						</div>
					)
				) : type ? (
					<div className="window">
						<button onClick={moveLeft}>&lt;</button>
						<div className="container">
							<div css={type ? paintList1CSS : paintList0CSS}>
								{cardList.slice(page, page + limit).map((paint) => {
									return <Paint paint={paint} type={type} key={paint.paintId} />
								})}
							</div>
						</div>
						<button onClick={moveRight}>&gt;</button>
					</div>
				) : (
					<div css={type ? paintList1CSS : paintList0CSS}>
						{cardList.map((paint) => {
							return <Paint paint={paint} type={type} key={paint.paintId} />
						})}
					</div>
				)
			) : (
				<div className="not-found">{isCard ? 'NFT' : '그림'} 작품이 없습니다</div>
			)}
		</div>
	)
}
const centerCSS = css`
	display: flex;
	justify-content: center;
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
		width: 100%;
	}

	.not-found {
		font-family: 'GongGothicMedium';
		color: white;
	}
`
const paintList0CSS = css`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
`
const paintList1CSS = css`
	display: flex;
	justify-content: center;
	/* flex-wrap: wrap; */
`
