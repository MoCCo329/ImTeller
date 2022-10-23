import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { css } from '@emotion/react'

export default function Timer() {
	const time = useSelector((state: any) => state.time)
	const interval = useRef(null)
	const initialTime = useRef(time)
	const [viewTime, setViewTime] = useState(0)

	useEffect(() => {
		interval.current = setInterval(() => {
			initialTime.current -= 1
			setViewTime(initialTime.current)
		}, 1000)
		return () => clearInterval(interval.current)
	}, [])

	useEffect(() => {
		initialTime.current = time
	}, [time])

	return (
		<div css={viewTime >= 0 ? timeCSS : null}>{viewTime >= 0 ? '🕑 ' + viewTime + 's' : null}</div>
	)
}

const timeCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgb(0, 0, 0, 0.4);
	width: 80px;
	background-color: rgb(0, 0, 0, 0.4);
	border-radius: 30px;
	margin-top: 10px;
	padding-bottom: 3px;
	color: white;
	font-family: 'GmarketSansMedium';
`
