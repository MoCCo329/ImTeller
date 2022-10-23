import { css } from '@emotion/react'
import { rankListProps, dealRankProps } from './Rank'
export default function rankListDeal({ rankList }: { rankList: rankListProps }) {
	// export default function rankListDeal(props: any[]) {
	let dealRankList: dealRankProps[] = rankList.dealRankList
	if (rankList.dealRankList) dealRankList = dealRankList.slice(0, 3)
	// console.log('rankList', typeof rankList)
	// console.log(rankList[0])
	return (
		<div css={box}>
			<div css={list}>
				{dealRankList ? (
					dealRankList.map((rank, i) => (
						<div key={i} css={cardCSS}>
							<div className="cardInfo">
								<div id="rank">{i + 1}.</div>
								<div id="title">{rank.cardTitle}</div>
								<div className="buyer">Buyer</div>
								<div className="buyer-content">
									<p>{rank.buyerNickname}</p>
								</div>
								<div className="price">Price</div>
								<div className="price-content">
									<p>{rank.price.toLocaleString()} SSF</p>
								</div>
							</div>
							<div css={type0CSS}>
								<img src={rank.cardImageURL} alt="" css={imgCSS} />
							</div>
						</div>
					))
				) : (
					<div className="not-found">해당하는 데이터가 없습니다</div>
				)}
			</div>
		</div>
	)
}
const box = css`
	display: flex;
	flex-direction: column;
	margin: 2rem;
`

const list = css`
	width: 100%;
	height: 65vh;
	border-radius: 1rem;
	box-shadow: 2px 2px 16px white;
	margin-bottom: 1rem;
	display: flex;
	justify-content: 'safe center';
	align-items: center;
	overflow: auto;

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

	.not-found {
		font-family: 'GongGothicMedium';
		color: white;
	}
`
const cardCSS = css`
	margin: 10px;
	font-family: 'GmarketSansMedium';
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: auto;
	#title {
		font-family: 'GongGothicMedium';
		font-size: 1.75rem;
		text-align: center;
	}
	#designer {
		font-size: 13px;
	}
	.cardInfo {
		display: flex;
		flex-direction: column;
		margin: 2rem;

		div {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 160px;
			min-width: 0;
			flex-basis: 50%;
			display: flex;
			justify-content: right;
			color: white;
		}

		.buyer,
		.price {
			display: block;
			padding-left: 1rem;
			width: 144px;
		}

		.buyer-content {
			display: flex;
			justify-content: right;

			p {
				text-align: right;
				width: 130px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin: 10px 0;
			}
		}

		.price-content {
			display: flex;
			justify-content: right;
			text-overflow: ellipsis;

			p {
				margin: 10px 0;
			}
		}

		#rank {
			display: flex;
			justify-content: left;
			font-size: 2rem;
			font-weight: 600;
		}

		#title {
			margin-bottom: 1rem;
		}
	}
`
const imgCSS = css`
	width: 200px;
	height: 296px;
	background-color: white;
	border-radius: 6px;
`
const type0CSS = css`
	position: relative;
	height: 296px;
	width: 200px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 13px solid #f4f4f4;
	margin: 10px;
`
