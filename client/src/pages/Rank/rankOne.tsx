import { css } from '@emotion/react'

import PolygonLeft from 'assets/image/PolygonLeft.webp'
import PolygonRight from 'assets/image/PolygonRight.webp'
// export default function rankOne({ rankList }: { rankList: bestPaintProps | null }) {
export default function rankOne(props: any) {
	let paintTitle = ''
	let paintImageURL = ''
	let designerNickname = ''
	if (props.rankList && props.rankList.bestPaint) {
		paintTitle = props.rankList.bestPaint.paintTitle
		paintImageURL = props.rankList.bestPaint.paintImageURL
		designerNickname = props.rankList.bestPaint.designerNickname
	}

	return (
		<div css={box}>
			<div css={list}>
				<img src={PolygonLeft} alt="" css={left} />
				{props.rankList && props.rankList.bestPaint && props.rankList.bestPaint.paintTitle ? (
					<div css={cardCSS}>
						<div css={type0CSS}>
							<img src={paintImageURL} alt="" css={imgCSS} />
						</div>
						<div className="cardInfo">
							<div id="title">{paintTitle}</div>
							<div id="designer">{designerNickname}</div>
						</div>
					</div>
				) : null}
				<img src={PolygonRight} alt="" css={right} />
			</div>
		</div>
	)
}
const box = css`
	display: flex;
	flex-direction: column;
	margin: 10px;
`

const list = css`
	width: 100%;
	height: 70vh;
	border-radius: 1rem;
	margin-bottom: 1rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
`
const cardCSS = css`
	font-family: 'GmarketSansMedium';
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 20px;
	color: white;
	margin-bottom: 20px;
	#title {
		margin-top: 30px;
		font-family: 'GongGothicMedium';
		font-size: 30px;
	}
	.cardInfo {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.cardInfo div {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		width: 300px;
		text-align: center;
	}
`
const imgCSS = css`
	position: relative;
	width: 300px;
	height: 444px;
	background-color: white;
	border-radius: 1px;
`
const type0CSS = css`
	position: relative;
	width: 300px;
	height: 444px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 20px solid #f4f4f4;
	margin: 10px;
	box-shadow: 2px 2px 16px;
`
const left = css`
	width: 500px;
	position: absolute;
	transform: translate(-70px, 30px);
`
const right = css`
	width: 500px;
	position: absolute;
	transform: translate(70px, 30px);
`
