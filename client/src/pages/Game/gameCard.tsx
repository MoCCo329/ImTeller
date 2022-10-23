import { useState, useEffect } from 'react'
import { css } from '@emotion/react'

import poo from 'assets/image/blind.webp'

export default function GameCard(props: any) {
	// 아이템 효과있으면 적용시키기
	const { cardUrl, darkmode, blind, blindDetail, choice } = props

	return (
		<div style={{ position: 'relative' }}>
			<img
				style={{ filter: darkmode ? 'grayscale(100%)' : null }}
				css={cardImgCSS(choice)}
				src={cardUrl}
			/>
			{blind && blindDetail >= 20 ? (
				<div>
					<img css={poo1CSS} src={poo} title="똥" />
				</div>
			) : null}
			{blind && blindDetail >= 40 ? (
				<div>
					<img css={poo2CSS} src={poo} title="똥" />
				</div>
			) : null}
			{blind && blindDetail >= 60 ? (
				<div>
					<img css={poo3CSS} src={poo} title="똥" />
				</div>
			) : null}
		</div>
	)
}

const cardImgCSS = (choice) => css`
	width: ${choice ? '30px' : '100%'};
	border-radius: 5%;
`
const poo1CSS = css`
	position: absolute;
	width: 35%;
	left: 9%;
	top: 5%;
`
const poo2CSS = css`
	position: absolute;
	width: 35%;
	left: 32%;
	top: 35%;
`
const poo3CSS = css`
	position: absolute;
	width: 35%;
	left: 55%;
	top: 65%;
`
