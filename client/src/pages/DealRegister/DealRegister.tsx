import { css } from '@emotion/react'
import { normalBtn } from 'style/commonStyle'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Layout from 'layout/layout'
import Loading from 'components/loading'

import art from 'actions/api/art'
import deal from 'actions/api/deal'
import { setCardList } from 'store/modules/art'
import { useModal } from 'actions/hooks/useModal'
import { setSelectedCard } from 'store/modules/art'

import connectMetaMask from 'actions/functions/connectMetaMask'
import { useAppSelector } from 'store/store'
import { sellCard } from 'contract/API'

export default function DealRegister() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const currentUser = useAppSelector((state) => state.currentUser)
	const selectedCard = useAppSelector((state) => state.selectedCard)

	// console.log('selectedCard', selectedCard)

	const [lowPrice, setLowPrice] = useState(0)
	const [instantPrice, setInstantPrice] = useState(10)
	const [day, setDay] = useState(1)
	const [tag, setTag] = useState('')

	const [isLoading, setIsLoading] = useState(false)

	const [setModalState, setModalMsg] = useModal()

	useEffect(() => {
		art.cardList({ nickname: currentUser.nickname }).then((result) => {
			// console.log(result)
			dispatch(setCardList(result.data.response))
		})
	}, [])

	const lowPriceFilter = (event) => {
		if (event.target.value > instantPrice) {
			event.target.value = instantPrice
		}
		setLowPrice(event.target.value)
	}

	const instantPriceFilter = (event) => {
		if (event.target.value < lowPrice) {
			event.target.value = lowPrice
		}
		setInstantPrice(event.target.value)
	}
	const onSubmit = async () => {
		if (isLoading) {
			setModalMsg('로딩중입니다')
			setModalState('alert')
			return
		}
		setIsLoading(true)
		if (!selectedCard) {
			setModalMsg('카드를 선택하세요')
			setModalState('alert')
			return setIsLoading(false)
		}
		const check: any = await connectMetaMask()
		if (!check) {
			setModalMsg('지갑을 연결하세요')
			setModalState('alert')
			setIsLoading(false)
			return
		}
		if (check !== currentUser.wallet) {
			setModalMsg('등록된 지갑주소와 동일한 메타마스크 지갑주소를 연결해야 합니다')
			setModalState('alert')
			setIsLoading(false)
			return
		}
		setIsLoading(true)
		const contractId = await sellCard(check, selectedCard.tokenId, instantPrice).catch((err) => {
			setIsLoading(false)
		})

		const now = new Date()
		let date: any = new Date(now.setDate(now.getDate() + day))
		date = date.toISOString().substring(0, 19)
		const data = {
			artId: selectedCard.cardId,
			dealAddress: contractId,
			finishedAt: date,
			instantPrice,
			lowPrice,
			tag,
		}

		deal
			.register(data)
			.then((result) => {
				// console.log(result.data.response)
				navigate(`/deal/${result.data.response}`)
				setIsLoading(false)
			})
			.catch((error) => {
				console.error(error)
				setIsLoading(false)
			})

		dispatch(setSelectedCard({}))
		setIsLoading(false)
	}

	return (
		<Layout>
			<main css={main}>
				<div css={box}>
					<div>
						<div css={rowFelxCSS}>
							<div css={card}>
								<div>{selectedCard ? <img src={selectedCard.cardImageURL} alt="" /> : null}</div>
							</div>
							<div>
								<button onClick={() => setModalState('dealRegister')} css={bigBtn}>
									카드 선택하기
								</button>
								{/* <label htmlFor="lowPrice">최저입찰가</label>
							<input
								id="lowPrice"
								type="number"
								max={instantPrice}
								onChange={lowPriceFilter}
								value={lowPrice}
							/> */}
								<div>
									<label htmlFor="instantPrice">즉시구매가</label>
									<input
										id="instantPrice"
										type="number"
										min={lowPrice}
										onChange={instantPriceFilter}
										value={instantPrice}
									/>
								</div>
								<div className="options">
									<label>판매기간</label>
									<label>
										<input
											onChange={() => setDay(1)}
											type="radio"
											name="day"
											value="1"
											checked={day === 1}
										/>
										1일
									</label>
									<label>
										<input
											onChange={() => setDay(2)}
											type="radio"
											name="day"
											value="2"
											checked={day === 2}
										/>
										2일
									</label>
								</div>
								<div>
									<label htmlFor="tag">태그</label>
									<input
										type="text"
										onChange={(e) => setTag(e.target.value)}
										placeholder="태그를 입력해주세요"
									/>
								</div>
								<button onClick={onSubmit} css={bigBtn}>
									등록하기
								</button>
							</div>
						</div>
						<div>
							<button
								id="back"
								onClick={() => {
									navigate(-1), dispatch(setSelectedCard({}))
								}}
								css={normalBtn}
							>
								뒤로가기
							</button>
						</div>
					</div>
				</div>

				{isLoading ? (
					<Loading msg={'체인에 거래를 등록하는 중입니다. 잠시만 기다려주세요'} />
				) : null}
			</main>
		</Layout>
	)
}
const rowFelxCSS = css`
	display: flex;
	align-items: center;
`
const main = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 90vh;
`
const box = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 40px 20px 20px 20px;
	color: white;
	input[type='text'] {
		/* display: none; */
		padding: 10px 10px;
		margin: 10px;
		box-sizing: border-box;
		border: none;
		border-radius: 12px;
		color: black;
		font-family: 'GmarketSansMedium';
		background-color: white;
		width: 100%;
	}
	input[type='number'] {
		/* display: none; */
		padding: 10px 10px;
		margin: 10px;
		box-sizing: border-box;
		border: none;
		border-radius: 12px;
		color: black;
		font-family: 'GmarketSansMedium';
		background-color: white;
		width: 100%;
	}
	label {
		font-family: 'GongGothicMedium';
		margin: 10px 0px 0px 10px;
	}
	.options {
		display: flex;
		justify-content: space-between;
		margin: 10px 0px 15px 0px;
	}
	.options label {
		font-family: 'GongGothicMedium';
	}
	#back {
		margin-top: 40px;
	}
`
const card = css`
	position: relative;
	width: 248px;
	height: 365px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 20px solid #f4f4f4;
	margin: 10px;
	img {
		width: 250px;
		height: 370px;
		background-color: white;
		border-radius: 5px;
	}
`
const bigBtn = css`
	outline: 'none';
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	border: 0px;
	padding: 10px 20px 10px 20px;
	margin: 30px 10px 25px 10px;
	color: #1b5198;
	background-color: #d1e4ff;
	border-radius: 12px;
	font-size: 18px;
	width: 100%;
	font-family: 'GongGothicMedium';

	&:hover {
		color: #d1e4ff;
		background-color: #112137;
	}
`
