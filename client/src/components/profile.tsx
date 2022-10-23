import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'

export default function Profile(props: any) {
	const navigate = useNavigate()
	const { nickname, profile } = props

	return (
		<div
			onClick={() => {
				navigate(`/mypage/${nickname}`)
			}}
			css={profileCSS}
		>
			<img src={profile} alt="" css={profileImgCSS} title={nickname} />
			<div>{nickname}</div>
		</div>
	)
}

const profileCSS = css`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px;
	margin-right: 20px;
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;

	&:hover {
		transform: scale(1.1, 1.1) rotate(-5deg);
		transition: all ease 0.2s;
	}
`
const profileImgCSS = css`
	width: 35px;
	height: 35px;
	border-radius: 50%;
	margin: 10px;
	aspectratio: 1 / 1;
`
