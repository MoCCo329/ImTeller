import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import { setTime } from 'store/modules/game'

import podium from 'assets/image/podium.webp'

export default function GameEnd(props: any) {
	const dispatch = useDispatch()

	const { setState, client, roomId } = props

	const result = useSelector((state: any) => state.result)
	const roomInfo = useSelector((state: any) => state.roomInfo)

	const [endResult, setEndResult] = useState<any>([])

	useEffect(() => {
		setTimeout(() => {
			setState(0)
			dispatch(setTime(0))
		}, 10000)
	}, [])

	useEffect(() => {
		const confirm = client.subscribe(`/sub/room/${roomId}/roominfo`, (action) => {
			const content = JSON.parse(action.body)
			if (!content.started) {
				setState(0)
			}
		})
		client.publish({ destination: `/pub/room/${roomId}/roominfo` })
		return () => {
			confirm.unsubscribe()
		}
	}, [])

	useEffect(() => {
		for (let nickname in result) {
			endResult.push([result[nickname], nickname])
		}
		endResult.sort((a: any, b: any) => a[0] - b[0]).reverse()
		console.log(endResult)
		return () => {
			setEndResult([])
		}
	}, [])

	const getProfile = (nickname) => {
		return roomInfo.profiles[nickname]
	}

	// 1, 2, 3 등은 시상대에 올리기
	// endresult 0에는 점수, 1에는 닉네임
	return (
		<div>
			<div css={gameResultCSS}>
				<img src={podium} alt="" css={podiumCSS} />
				<div css={resultInfoCSS}>
					<div>
						{endResult[0] && (
							<div css={profileInfo2CSS}>
								<img src={getProfile(endResult[1][1])} alt="" css={profileImgCSS} />
								<div>
									{endResult[1][1]} : {endResult[1][0]}점
								</div>
							</div>
						)}
					</div>
					<div>
						{endResult[0] && (
							<div css={profileInfo1CSS}>
								<img src={getProfile(endResult[0][1])} alt="" css={profileImgCSS} />
								<div>
									{endResult[0][1]} : {endResult[0][0]}점
								</div>
							</div>
						)}
					</div>
					<div>
						{endResult[2] && (
							<div css={profileInfo3CSS}>
								<img src={getProfile(endResult[2][1])} alt="" css={profileImgCSS} />
								<div>
									{endResult[2][1]} : {endResult[2][0]}점
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div>
				{endResult.slice(3).length ? (
					<div css={remainCSS}>
						{endResult.slice(3).map((result, idx) => (
							<div key={result[1]} css={verticalCenterCSS}>
								<div>{idx + 4}등</div>
								<img src={getProfile(result[1])} alt="" />
								<div>
									{result[1]} : {result[0]}점
								</div>
							</div>
						))}
					</div>
				) : null}
			</div>
		</div>
	)
}

const gameResultCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: 'GongGothicMedium';
	color: white;
`
const profileImgCSS = css`
	width: 150px;
	height: 150px;
	border-radius: 50%;
	aspectratio: 1 / 1;
`
const podiumCSS = css`
	position: relative;
	margin-top: 300px;
`
const resultInfoCSS = css`
	position: absolute;
	display: flex;
`
const profileInfo1CSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0px 45px 0px 45px;
	transform: translateY(-120px);
`
const profileInfo2CSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0px 45px 0px 45px;
	transform: translateY(-20px);
`
const profileInfo3CSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0px 45px 0px 45px;
	transform: translateY(10px);
`
const remainCSS = css`
	display: flex;
	justify-content: space-evenly;
	font-family: 'GongGothicMedium';
	color: white;
`
const verticalCenterCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;

	img {
		width: 8vw;
		height: 8vw;
		border-radius: 50%;
	}
`
