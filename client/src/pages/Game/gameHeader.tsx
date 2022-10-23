import { css } from '@emotion/react'

import RoomInfo from 'pages/Game/roomInfo'
import Timer from 'components/timer'
import Setting from 'components/setting'

export default function GameHeader(props: any) {
	return (
		<div css={headerCSS}>
			<RoomInfo />
			<Timer />
			<Setting />
		</div>
	)
}

const headerCSS = css({
	display: 'flex',
	justifyContent: 'space-between',
})
