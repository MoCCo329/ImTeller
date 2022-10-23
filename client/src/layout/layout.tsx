import { css } from '@emotion/react'

import Header from 'layout/header'
import Footer from 'layout/footer'
export default function Layout(props: any) {
	return (
		<div css={backgroundCSS}>
			<Header />
			{props.children}
			<Footer />
		</div>
	)
}

const backgroundCSS = css`
	background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
	// backgroundImage: linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%);
	background-size: cover;
`
