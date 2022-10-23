import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { normalBtn } from 'style/commonStyle'
import { css } from '@emotion/react'

export default function Deal(props: any) {
	const navigate = useNavigate()
	const currentUser = useSelector((state: any) => state.currentUser)

	const interval = useRef(null)
	const diffTime = useRef(0)
	const [day, setDay] = useState(0)
	const [hour, setHour] = useState(0)
	const [min, setMin] = useState(0)
	const [sec, setSec] = useState(0)
	const [finished, setFinished] = useState(false)

	const {
		dealId,
		instantPrice,
		finalBidPrice,
		tag,
		finishedAt,
		cardId,
		cardTitle,
		cardImageUrl,
		designerId,
		designerNickname,
		grade,
		effect,
	} = props.deal
	useEffect(() => {
		interval.current = setInterval(() => {
			const now = new Date()
			const finish = new Date(finishedAt.replace(' ', 'T'))
			diffTime.current = Math.floor((finish.getTime() - now.getTime()) / 1000)
			const d = Math.floor(diffTime.current / (24 * 60 * 60))
			const h = Math.floor((diffTime.current - d * 24 * 60 * 60) / (60 * 60))
			const m = Math.floor((diffTime.current - (d * 24 + h) * 60 * 60) / 60)
			const s = diffTime.current - (d * 24 * 60 + h * 60 + m) * 60
			setDay(d)
			setHour(h)
			setMin(m)
			setSec(s)
		}, 1000)
		return () => clearInterval(interval.current)
	}, [])
	const goDetail = () => {
		if (!currentUser.nickname) return navigate('/login')
		navigate(`/deal/${dealId}`)
	}

	return (
		<div css={box}>
			<div css={card}>
				<img src={cardImageUrl} />
			</div>
			<div css={explain}>
				<div css={title}>{cardTitle}</div>
				<br />
				<div css={body}>
					<div id="designer" css={designer}>
						<div>by. {designerNickname}</div>
					</div>
					<div id="price" css={price}>
						<div>{instantPrice} SSF</div>
					</div>
					<div id="date" css={price}>
						<div>
							{diffTime.current < 0 ? (
								<div>종료된 경매</div>
							) : (
								<div>
									{day}일 {hour}시간 {min}분 {sec}초 남음
								</div>
							)}
						</div>
					</div>
				</div>
				<button css={normalBtn} onClick={goDetail}>
					상세보기
				</button>
			</div>
		</div>
	)
}

const box = css`
	width: 390px;
	display: flex;
	align-items: center;
	color: black;
	margin: 10px;
	padding: 5px;
	background-color: rgb(255, 255, 255, 0.6);
	border-radius: 15px;
`

const card = css`
	position: relative;
	height: 214px;
	width: 143px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 13px solid #f4f4f4;
	margin: 10px;

	img {
		height: 222px;
		background-color: white;
		border-radius: 12px;
	}
`

const explain = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10px;
	width: 190px;
`
const title = css`
	font-size: 20px;
`
const body = css`
	width: 100%;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`

const designer = css`
	font-family: 'GmarketSansMedium';
	font-size: 13px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
`
const price = css`
	font-family: 'GmarketSansMedium';
	font-size: 15px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
`
