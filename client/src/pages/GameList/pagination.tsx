import { css } from '@emotion/react'

function Pagination({ total, limit, page, setPage }: any) {
	const numPages = Math.ceil(total / limit) || 1

	return (
		<div css={Nav}>
			<button css={Button} onClick={() => setPage(page - 1)} disabled={page === 0}>
				<div css={left}></div>
			</button>
			{Array(numPages)
				.fill(0)
				.map((_, i) => (
					<div
						css={ButtonNum}
						key={i + 1}
						onClick={() => setPage(i)}
						aria-current={page === i ? 'page' : null}
					>
						{i + 1}
					</div>
				))}
			<button css={Button} onClick={() => setPage(page + 1)} disabled={page === numPages - 1}>
				<div css={right}></div>
			</button>
		</div>
	)
}

const Nav = css`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	margin: 16px;
`

const Button = css({
	border: 'none',
	borderRadius: '50px',
	height: '2em',
	width: '2em',
	margin: 0,
	background: 'none',
	color: 'white',
	fontSize: '1rem',
	fontFamily: 'Pretendard-Regular',

	'&:hover': {
		background: '#fff7e7',
		cursor: `url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto`,
	},

	'&[disabled]': {
		background: 'transparent',
		cursor: 'revert',
		transform: 'revert',
	},
})
const ButtonNum = css({
	border: 'none',
	borderRadius: '50px',
	width: '1.5em',
	height: '1.5em',
	background: 'none',
	color: 'black',
	fontSize: '1rem',
	textAlign: 'center',
	fontFamily: 'Pretendard-Regular',

	'&:hover': {
		background: '#fff7e7',
		opacity: 0.5,
		cursor: `url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto`,
	},

	'&[aria-current]': {
		background: 'white',
		opacity: 1,
		cursor: 'revert',
		transform: 'revert',
	},
})
const left = css({
	width: 0,
	height: 0,
	borderLeft: '5px solid transparent',
	borderRight: '10px solid white',
	borderTop: '5px solid transparent',
	borderBottom: '5px solid transparent',
	opacity: 0.3,
})
const right = css({
	width: 0,
	height: 0,
	marginLeft: '5px',
	borderLeft: '10px solid white',
	borderRight: '5px solid transparent',
	borderTop: '5px solid transparent',
	borderBottom: '5px solid transparent',
	opacity: 0.3,
})
export default Pagination
