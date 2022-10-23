import { css } from '@emotion/react'
import Layout from 'layout/layout'
import { fullDisplay, centerColCSS } from 'style/commonStyle'

import Image404 from 'assets/image/404.gif'

export default function NotFound404() {
	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={notfoundCSS}>
					<div css={centerColCSS}>
						<img src={Image404} alt="" />
						<div>존재하지 않는 페이지입니다</div>
					</div>
				</div>
			</main>
		</Layout>
	)
}
const notfoundCSS = css`
	color: white;
	font-family: 'GongGothicMedium';
	font-size: 20px;
	img {
		width: 500px;
	}
`
