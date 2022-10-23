import { css } from '@emotion/react'
import React, { useState } from 'react'

export default function rankList(props: any) {
	const { tabNo, tabs } = props

	return (
		<div css={box}>
			<div css={list}></div>
		</div>
	)
}
const box = css`
	display: flex;
	flex-direction: column;
	margin: 2rem;
`

const list = css`
	width: 100%;
	height: 70vh;
	background-color: rgba(239, 238, 245, 0.3);
	border-radius: 1rem;
	box-shadow: 2px 2px 16px;
	margin-bottom: 1rem;
`
