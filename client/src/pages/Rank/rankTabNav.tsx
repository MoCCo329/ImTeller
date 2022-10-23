import { css } from '@emotion/react'
import { useDispatch } from 'react-redux'
import { setRankTabNo } from 'store/modules/rank'

export default function RankTabNav(props: any) {
	const { tabs, tabNo } = props
	const dispatch = useDispatch()

	return (
		<div css={box(tabNo)}>
			<div className="tab-items">
				<div
					className="value"
					onClick={() => {
						dispatch(setRankTabNo(0))
					}}
				>
					{tabs[0]}
				</div>
				<div
					className="win-rate"
					onClick={() => {
						dispatch(setRankTabNo(1))
					}}
				>
					{tabs[1]}
				</div>
				<div
					className="level"
					onClick={() => {
						dispatch(setRankTabNo(2))
					}}
				>
					{tabs[2]}
				</div>
				<div
					className="monthly-nft"
					onClick={() => {
						dispatch(setRankTabNo(3))
					}}
				>
					{tabs[3]}
				</div>
			</div>
			<div className="hr1" />
		</div>
	)
}

const box = (tabNo: Number) => css`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	margin: 10px;
	color: white;
	height: 5rem;

	.tab-items {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		height: 3rem;

		.value,
		.win-rate,
		.level,
		.monthly-nft {
			font-weight: 200;
			font-size: 1.5rem;
			font-family: 'GongGothicMedium';
		}

		.value {
			color: ${tabNo === 0 ? 'white' : 'gray'};
		}

		.win-rate {
			color: ${tabNo === 1 ? 'white' : 'gray'};
		}

		.level {
			color: ${tabNo === 2 ? 'white' : 'gray'};
		}

		.monthly-nft {
			color: ${tabNo === 3 ? 'white' : 'gray'};
		}

		.value:hover {
			color: ${tabNo === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.win-rate:hover {
			color: ${tabNo === 1 ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.level:hover {
			color: ${tabNo === 2 ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.monthly-nft:hover {
			color: ${tabNo === 3 ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.value:active,
		.win-rate:active,
		.level:active,
		.monthly-nft:active {
			color: rgba(255, 255, 255, 1);
		}
	}

	.hr1 {
		margin: 0 auto;
		height: 2px;
		width: 70vw;
		background-color: rgba(255, 255, 255, 0.1);
	}
`
