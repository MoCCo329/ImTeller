import { css } from '@emotion/react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import DealHistory from 'pages/DealDetail/dealHistory'
import Layout from 'layout/layout'

import deal from 'actions/api/deal'
import itemDetail from 'actions/functions/itemDetail'
import Loading from 'components/loading'
import { setDealDetail } from 'store/modules/art'
import { setModalMsg, setModalState } from 'store/modules/util'

import connectMetaMask from 'actions/functions/connectMetaMask'

import gradeS from 'assets/image/gradeS.webp'
import gradeA from 'assets/image/gradeA.webp'
import gradeB from 'assets/image/gradeB.webp'
import { purchaseCard, cancelDeal } from 'contract/API'

export default function DealDetail() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { dealId } = useParams()

	const dealDetail = useSelector((state: any) => state.dealDetail)
	const currentUser = useSelector((state: any) => state.currentUser)

	const [dealInfo, setDealInfo] = useState<any>({})
	const [cardInfo, setCardInfo] = useState<any>({})
	const [dealHistoryList, setDealHistoryList] = useState<any>([])

	const interval = useRef(null)
	const diffTime = useRef(0)
	const [day, setDay] = useState(0)
	const [hour, setHour] = useState(0)
	const [min, setMin] = useState(0)
	const [sec, setSec] = useState(0)
	const [loading, setLoading] = useState(false)
	const [dealType, setDealType] = useState('')

	const [effectPre, effectPost] = itemDetail(cardInfo.effect, cardInfo.effectNum)

	useEffect(() => {
		deal
			.dealDetail(dealId)
			.then((result) => {
				// console.log(result.data)
				dispatch(setDealDetail(result.data.response))
			})
			.catch((err) => {
				console.error(err)
			})
	}, [])

	useEffect(() => {
		if (dealDetail) {
			setDealInfo(dealDetail.dealInfo)
			setCardInfo(dealDetail.cardInfo)
			setDealHistoryList(dealDetail.dealHistoryList)
		}
	}, [dealDetail])

	useEffect(() => {
		interval.current = setInterval(() => {
			const now = new Date()
			const finish = new Date(dealInfo.finishedAt.replace(' ', 'T'))
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
	}, [dealInfo])

	const buyNft = async (walletAddress: any, dealAddress: any, instantPrice: any) => {
		return purchaseCard(currentUser.wallet, dealAddress, instantPrice)
	}

	const cancelNft = async (walletAddress: any, dealAddress: any) => {
		return cancelDeal(currentUser.wallet, dealAddress)
	}

	const onCancel = async () => {
		if (loading) return
		setDealType('취소')
		setLoading(true)
		const check: any = await connectMetaMask()
		if (!check) {
			setModalMsg('지갑을 연결하세요')
			setModalState('alert')
			setLoading(false)
			return
		}
		if (check !== currentUser.wallet) {
			setModalMsg('등록된 지갑주소와 동일한 메타마스크 지갑주소를 연결해야 합니다')
			setModalState('alert')
			setLoading(false)
			return
		}
		setLoading(true)
		cancelNft(currentUser.wallet, dealInfo.dealAddress)
			.then((result) => {
				// console.log(result)
				deal
					.cancelDeal(dealInfo.dealId)
					.then((result) => {
						setModalMsg('취소가 성공적으로 이루어졌습니다.')
						setModalState('alert')
						// console.log(result)
						navigate('/deal')
					})
					.catch((error) => {
						setModalMsg('예기치 못한 오류로 취소가 이루어지지 않았습니다.')
						setModalState('alert')
						navigate(`/deal/${dealId}`)
						console.error(error)
					})
			})
			.catch((error) => {
				setModalMsg('예기치 못한 오류로 취소가 이루어지지 않았습니다.')
				setModalState('alert')
				navigate(`/deal/${dealId}`)
				console.error(error)
			})
	}

	const onBuy = async () => {
		if (loading) return
		setDealType('거래')
		setLoading(true)
		const check: any = await connectMetaMask()
		if (!check) {
			setModalMsg('지갑을 연결하세요')
			setModalState('alert')
			setLoading(false)
			return
		}
		if (check !== currentUser.wallet) {
			setModalMsg('등록된 지갑주소와 동일한 메타마스크 지갑주소를 연결해야 합니다')
			setModalState('alert')
			setLoading(false)
			return
		}
		setLoading(true)
		// bid type 0은 입찰, 1은 즉시구매 - 근데 뭐든지 넣어도 상관없음
		const data = {
			bidPrice: dealInfo.instantPrice,
			bidType: 1,
			bidderNickname: currentUser.nickname,
		}
		deal
			.bid(dealId, data)
			.then((result) => {
				// console.log(result)
				// console.log('bid 성공적으로 보냄')
			})
			.catch((err) => {
				console.error(err)
				setLoading(false)
				setModalMsg('예기치 못한 오류로 구매가 이루어지지 않았습니다.')
				setModalState('alert')
			})
		await buyNft(currentUser.wallet, dealInfo.dealAddress, dealInfo.instantPrice)
			.then((result) => {
				// console.log(result)
				deal
					.dealEnd(dealInfo.dealId, {
						bidderNickname: currentUser.nickname,
						tokenId: cardInfo.tokenId,
					})
					.then((result) => {
						// console.log(result.data)
						setLoading(false)
						setModalMsg('거래가 성공적으로 이루어졌습니다')
						setModalState('alert')
					})
					.catch((err) => {
						setLoading(false)
						setModalMsg('예기치 못한 오류로 구매가 이루어지지 않았습니다.')
						setModalState('alert')
					})
			})
			.catch((err) => {
				console.error(err)
				deal
					.dealEnd(null, null)
					.then((result) => {
						// console.log(result)
					})
					.catch((err) => {
						console.error(err)
					})
				setLoading(false)
				setModalMsg('예기치 못한 오류로 구매가 이루어지지 않았습니다.')
				setModalState('alert')
			})
		setLoading(false)
		setDealType('')
	}
	return (
		<Layout>
			<main css={centerCSS}>
				<div css={box}>
					<div css={rowFelxCSS}>
						<div css={type0CSS}>
							<img src={cardInfo.cardImageURL} alt="" css={cardImageCSS} />
						</div>
						<div css={explain}>
							{dealInfo.tag && <span id="tag">#{dealInfo.tag}</span>}
							<div css={spaceTitle}>
								<div id="title">{cardInfo.cardTitle}</div>
								<div id="designer">Designed by. {cardInfo.designerNickname}</div>
								<div id="name">Owner. {cardInfo.ownerNickname}</div>
							</div>
							<hr />
							<div css={descriptionCSS}>{cardInfo.description}</div>
							<div css={space}>
								{cardInfo.grade == 'S' ? <img src={gradeS} alt="" css={grade} /> : null}
								{cardInfo.grade == 'A' ? <img src={gradeA} alt="" css={grade} /> : null}
								{cardInfo.grade == 'B' ? <img src={gradeB} alt="" css={grade} /> : null}
								{cardInfo.effectNum ? (
									<span>{effectPre + ' ' + String(cardInfo.effectNum) + effectPost}</span>
								) : (
									<span>{effectPre}</span>
								)}
							</div>
							{diffTime.current < 0 ? (
								<div>종료된 경매</div>
							) : (
								<div>
									{day}일 {hour}시간 {min}분 {sec}초 남음
								</div>
							)}
							<div>
								{cardInfo.ownerNickname === currentUser.nickname ? (
									<div>
										<button onClick={onCancel} css={bigBtn}>
											판매 취소
										</button>
									</div>
								) : diffTime.current < 0 ? null : (
									<div css={purchase}>
										<button onClick={onBuy} css={bigBtn}>
											{dealInfo.instantPrice} SSF 즉시 구매
										</button>
									</div>
								)}
								{/* <div>
							최고 입찰가 {dealInfo.finalBidPrice}SSF
							<button>입찰</button>
						</div> */}
							</div>
						</div>
					</div>
					<div id="history">
						<DealHistory dealHistoryList={dealHistoryList} />
					</div>
				</div>
				{loading ? (
					<Loading msg={`체인에서 ${dealType}가 진행중입니다.  잠시만 기다려주세요`} />
				) : null}
			</main>
		</Layout>
	)
}
const centerCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 90vh;
`
const rowFelxCSS = css`
	display: flex;
`
const box = css`
	width: 700px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
	margin: 30px;
	font-family: 'GmarketSansMedium';
	#history {
		width: 100%;
		margin: 20px 0px 0px 0px;
	}
`
const purchase = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-radius: 5px;
	margin: 10px 0px 0px 0px;
	#priceTitle {
		font-size: 13px;
	}
`
const spaceTitle = css`
	display: flex;
	flex-direction: column;
	margin: 10px 0px 10px 0px;
`
const space = css`
	display: flex;
	align-items: center;
	margin: 10px 0px 10px 0px;
`
const explain = css`
	margin: 40px 40px 0px 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	hr {
		width: 100%;
	}
	#title {
		font-size: 20px;
		font-family: 'GongGothicMedium';
	}
	#designer {
		margin-top: 10px;
		font-size: 13px;
	}
	#name {
		font-size: 13px;
	}
	#tag {
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 50px;
		padding: 4px 5px 4px 5px;
		font-size: 13px;
		margin-bottom: 10px;
		width: max-content;
	}
`

const grade = css`
	width: 40px;
	margin: 0px 10px 5px 5px;
`
const type0CSS = css`
	position: relative;
	width: 248px;
	height: 365px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 20px solid #f4f4f4;
	margin: 40px 10px 20px 40px;
`
const cardImageCSS = css`
	width: 250px;
	height: 370px;
	background-color: white;
	border-radius: 6px;
`
const descriptionCSS = css`
	white-space: pre-line;
	width: 300px;
	margin: 20px 0px 10px 0px;
`
const bigBtn = css`
	outline: 'none';
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	border: 0px;
	padding: 10px 20px 10px 20px;
	margin: 0px 10px 5px 10px;
	color: #1b5198;
	background-color: #d1e4ff;
	border-radius: 12px;
	font-size: 18px;
	width: 280px;
	font-family: 'GongGothicMedium';

	&:hover {
		color: #d1e4ff;
		background-color: #112137;
	}
`
