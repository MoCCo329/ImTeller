import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { css } from '@emotion/react'

import back from 'assets/image/arrow.webp'

const RoomInfo = (props: any) => {
	const navigate = useNavigate()
	const { id, roomName, leader, players, maxNum, type, typeNum } = useSelector(
		(state: any) => state.roomInfo,
	)

	const onOut = () => {
		const result = confirm('게임에서 나가시겠습니까?')
		if (result) {
			navigate(-1)
		}
	}

	return (
		<div css={infos}>
			<div css={backBtn} onClick={onOut}>
				<img src={back} alt="뒤로 가기" css={imgSize} />
			</div>
			<div css={roomInfoCSS}>
				<div css={roomInfoBlockCSS}>
					<div>
						{id} {roomName}
					</div>
				</div>
				<div>
					<div css={roomInfoBlockCSS}>
						{typeNum}
						{type === 'score' ? '점' : '라운드'}
					</div>
					<div css={roomInfoBlockCSS}>
						{players.length}명 / {maxNum}명
					</div>
				</div>
			</div>
		</div>
	)
}
export default RoomInfo

const infos = css({
	display: 'flex',
})

const backBtn = css({
	cursor: `url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto`,
})

const imgSize = css`
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	width: 2em;
	margin: 15px 9px 9px 9px;
`
const roomInfoCSS = css`
	display: flex;
	align-items: center;
	background-color: rgb(0, 0, 0, 0.4);
	border-radius: 30px;
	margin-top: 10px;
	> div {
		display: flex;
		align-items: end;
	}
`
const roomInfoBlockCSS = css`
	margin: 0 4vw;
	font-family: 'GmarketSansMedium';
	color: white;
`
