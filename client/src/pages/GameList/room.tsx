import { css } from '@emotion/react'

const Room = (props: any) => {
	const { roomId, roomName, locked, peopleNum, maxPeopleNum, type, typeNum } = props.room

	return (
		<div css={roomCSS}>
			<div css={outBox}>
				<div css={sideBox}>
					<div css={roomNum}>{roomId}</div>
					<div>{locked ? '비공개' : '공개'}</div>
				</div>
				<div css={main}>
					<div css={title}>
						<div css={name}>{roomName}</div>
					</div>
					<div css={line}>
						<div>
							{type === 'score' ? '점수 ' : '라운드'} | {typeNum}{' '}
							{type === 'score' ? '점' : '라운드'}
						</div>
						<div>
							{peopleNum} / {maxPeopleNum}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Room

const roomCSS = css({
	width: '300px',
	boxSizing: 'border-box',
	background: '#a9a9a9',
	borderRadius: 15,
	border: '5px solid rgb(163, 151, 198)',
	margin: '1em',
	padding: '1em',
	flexGrow: 1,
	flexShrink: 1,
	flexBasis: '40%',
	cursor: `url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto`,
	'&:hover': {
		boxShadow: '2px 2px 2px 2px rgba(255, 255, 255, 0.2)',
	},
})

const outBox = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

const sideBox = css`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	font-family: 'GongGothicMedium';
`

const main = css`
	align-self: stretch;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	width: 200px;
	font-family: 'GongGothicMedium';
`
const title = css`
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 3px solid rgb(83, 72, 116);
`
const name = css`
	font-size: 20px;
	display: flex;
	justify-content: space-between;
	overflow: hidden;
`
const roomNum = css`
	float: left;
	background-color: white;
	margin: 0 auto;
	width: 30px;
	height: 30px;
	border: 5px solid rgb(163, 151, 198);
	border-radius: 50%;
	font-weight: bold;
	color: rgb(83, 72, 116);
	display: flex;
	justify-content: center;
	align-items: center;
`
const line = css`
	font-size: 17px;
	font-family: 'GmarketSansMedium';
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
`
