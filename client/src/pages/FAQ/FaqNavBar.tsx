import { css } from '@emotion/react'

const FaqNavBar = (props: any) => {
	const { faqTab, setFaqTab } = props

	return (
		<div css={box(faqTab)}>
			<div className="tab-items">
				<div
					className="video"
					onClick={() => {
						setFaqTab('video')
					}}
				>
					영상설명
				</div>
				<div
					className="game"
					onClick={() => {
						setFaqTab('game')
					}}
				>
					게임
				</div>
				<div
					className="item"
					onClick={() => {
						setFaqTab('item')
					}}
				>
					아이템
				</div>
				<div
					className="art"
					onClick={() => {
						setFaqTab('art')
					}}
				>
					그림
				</div>
				<div
					className="nft"
					onClick={() => {
						setFaqTab('nft')
					}}
				>
					NFT
				</div>
			</div>
			<div className="hr1" />
		</div>
	)
}

const box = (faqTab: String) => css`
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

		.video,
		.game,
		.item,
		.art,
		.nft {
			font-weight: 200;
			font-size: 1.5rem;
			font-family: 'GongGothicMedium';
		}

		.video {
			color: ${faqTab === 'video' ? 'white' : 'gray'};
		}

		.game {
			color: ${faqTab === 'game' ? 'white' : 'gray'};
		}

		.item {
			color: ${faqTab === 'item' ? 'white' : 'gray'};
		}

		.art {
			color: ${faqTab === 'art' ? 'white' : 'gray'};
		}

		.nft {
			color: ${faqTab === 'nft' ? 'white' : 'gray'};
		}

		.video:hover {
			color: ${faqTab === 'video' ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.game:hover {
			color: ${faqTab === 'game' ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.item:hover {
			color: ${faqTab === 'item' ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.art:hover {
			color: ${faqTab === 'art' ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.nft:hover {
			color: ${faqTab === 'nft' ? 'white' : 'rgba(255, 255, 255, 0.5)'};
		}

		.video:active,
		.game:active,
		.item:active,
		.art:active,
		.nft:active {
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

export default FaqNavBar
