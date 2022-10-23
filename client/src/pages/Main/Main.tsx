import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Layout from 'layout/layout'
import { css } from '@emotion/react'
import { fullDisplay } from 'style/commonStyle'
import { setMainTab } from 'store/modules/util'

export default function Main() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	dispatch(setMainTab(''))

	const goToGameList = () => {
		navigate('/game')
	}

	return (
		<Layout>
			<div css={fullDisplay}>
				<div className="cardLoc" css={cardCss}>
					<div className="card">ImTeller</div>
					<div className="text">
						<p>내가 직접 그린 NFT카드와 함께</p>
						<p>자신만의 독특한 방법으로</p>
						<p>그림을 설명해보세요!</p>

						<br />
						<p>그렇지만!!</p>
						<p>너무 쉽게 설명하면 안돼요!!</p>
						<button css={button} onClick={goToGameList}>
							시작하기
						</button>
					</div>
				</div>
			</div>
		</Layout>
	)
}
const cardCss = css`
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-evenly;
	box-sizing: border-box;

	.card {
		background: #191c29;
		width: var(--card-width);
		height: var(--card-height);
		padding: 3px;
		position: relative;
		border-radius: 32px;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 4rem;
		color: rgb(88 199 250 / 0%);
		cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
		font-family: Yeongdo-Rg;
		transform-style: preserve-3d;
	}

	.card:hover {
		color: rgb(88 199 250 / 100%);
		transition: color 1s;
	}

	.card:hover:after {
		animation: none;
		opacity: 0;
	}

	.card::after {
		position: absolute;
		content: '';
		top: calc(var(--card-height) / 6);
		left: 0;
		right: 0;
		z-index: 1;
		height: 100%;
		width: 100%;
		margin: 0 auto;
		transform: scale(0.8);
		filter: blur(calc(var(--card-height) / 6));
		background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
		opacity: 1;
		transition: opacity 0.5s;
		animation: spin 2.5s linear infinite;
		transform: translateZ(-1px);
	}

	.text {
		text-align: center;
		color: white;
		font-family: 'GongGothicMedium';
		font-size: 1.5rem;
		line-height: 1rem;
	}
`

const button = css`
	outline: 'none';
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	border: 0px;
	padding: 6px 20px 6px 20px;
	margin: 20px;
	color: #1b5198;
	background-color: #d1e4ff;
	border-radius: 40px;
	font-size: 1.5rem;
	width: 160px;
	height: 55px;
	font-family: 'GongGothicMedium';

	&:hover {
		color: #d1e4ff;
		background-color: #112137;
	}
`
