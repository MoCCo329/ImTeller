import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import rank from 'actions/api/rank'
import { setRankList, setRankTabNo } from 'store/modules/rank'
import { setMainTab } from 'store/modules/util'

import Layout from 'layout/layout'
import RankTabNav from 'pages/Rank/rankTabNav'
import RankListDeal from 'pages/Rank/rankListDeal'
import RankListDealWin from 'pages/Rank/rankListDealWin'
import RankListDealLevel from 'pages/Rank/rankListDealLevel'
import RankOne from 'pages/Rank/rankOne'
import { fullDisplay } from 'style/commonStyle'

export interface rankListProps {
	dealRankList: dealRankProps[]
	winningRateRankList: winningRateRankProps[]
	levelRankList: levelRankListProps[]
	bestPaint?: bestPaintProps
}
export interface dealRankProps {
	cardTitle: string
	cardImageURL: string
	designerNickname: string
	buyerNickname: string
	price: string
	dealedAt: string
}
export interface winningRateRankProps {
	nickname: string
	winningRate: string
	win: number
	lose: number
}
export interface levelRankListProps {
	nickname: string
	level: number
	totalGame: number
}
export interface bestPaintProps {
	paintTitle: string
	paintImageURL: string
	designerNickname: string
}

export default function Rank() {
	const dispatch = useDispatch()
	const [tabList, setTabList] = useState()
	const tabs = ['오늘의 거래', '승률', '레벨', '이달의 NFT']
	const rankTabNo = useSelector((state: any) => state.rankTabNo)

	dispatch(setMainTab('rank'))

	const tempDummy = {
		paintTitle: '핑크백조',
		paintImageURL:
			'https://imtellercard.s3.ap-northeast-2.amazonaws.com/20220204170255-blobtofile.png',
		designerNickname: '전문가준비생',
	}
	const rankList: rankListProps = useSelector((state: any) => state.rankList)
	// console.log('랭크리스트', rankList)

	useEffect(() => {
		const getRank = async () => {
			await rank
				.rankList()
				.then((result) => {
					// console.log('랭킹 목록 불러옴')
					// console.log('반환값', result.data.response)
					dispatch(setRankList(result.data.response))
				})
				.catch((err) => console.error(err))
		}
		getRank()
	}, [rankTabNo])

	const tabsList = {
		0: <RankListDeal rankList={rankList} />,
		1: <RankListDealWin rankList={rankList} />,
		2: <RankListDealLevel rankList={rankList} />,
		3: <RankOne rankList={rankList} />,
	}

	return (
		<Layout>
			<main css={main}>
				<div css={fullDisplay}>
					<div css={box}>
						<RankTabNav tabNo={rankTabNo} tabs={tabs}></RankTabNav>
						{rankTabNo !== 4 && rankList && tabsList[rankTabNo]}
						{rankTabNo === 4 &&
							rankList &&
							rankList.bestPaint &&
							rankList.bestPaint.paintTitle &&
							tabsList[rankTabNo]}
					</div>
				</div>
			</main>
		</Layout>
	)
}

const main = css`
	height: 100%;
	display: flex;
	justify-content: center;
`

const box = css`
	display: flex;
	flex-direction: column;
	width: 80vw;
	//background-color: #854e4e;
`
