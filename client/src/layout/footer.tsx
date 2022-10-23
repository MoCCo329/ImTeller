import { css } from '@emotion/react'

export default function Footer() {
	return <div css={footerCss}>Team Classic</div>
}
const footerCss = css({
	display: 'flex',
	justifyContent: 'center',
	color: 'white',
	fontFamily: 'Yeongdo-Rg',
	fontSize: '1.25rem',
	paddingBottom: '1rem',
})
