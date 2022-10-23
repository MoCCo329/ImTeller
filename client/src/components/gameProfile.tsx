import { useSelector } from 'react-redux'
import { css } from '@emotion/react'

import defaultProfile from 'assets/image/defaultProfile.webp'

// 텔러면 왕관 씌우기? 점수도 같이 표시
export default function GameProfile(props: any) {
	const { player } = props
	const phase = useSelector((state: any) => state.phase)

	return (
		<div css={profileCSS}>
			<div>{player.score}</div>
			<img css={imgSizeCSS} src={player.profile || defaultProfile} alt="프로필이미지" />
			<div>{player.nickname}</div>
			<div>{phase !== 'phase4' ? (player.status ? '✔' : '❌') : null}</div>
		</div>
	)
}

const profileCSS = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	fontFamily: 'GongGothicMedium',
	color: 'white',
})
const imgSizeCSS = css`
	border-radius: 100%;
	width: 4em;
	aspect-ratio: 1 / 1;
	object-fit: cover';
`
