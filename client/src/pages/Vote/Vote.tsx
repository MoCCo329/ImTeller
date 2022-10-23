import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'
import { fullDisplay, normalBtn } from 'style/commonStyle'

import rank from 'actions/api/rank'
import vote from 'actions/api/vote'
import art from 'actions/api/art'
import { setRankList, setRankTabNo } from 'store/modules/rank'

import Layout from 'layout/layout'
import VoteCard from 'pages/Vote/voteCard'

import { useModal } from 'actions/hooks/useModal'
import { setVoteList, setPaintList } from 'store/modules/art'
import { setMainTab } from 'store/modules/util'

export interface voteListProps {
	vote: vote
	like: boolean
}
interface vote {
	id: number
	createdAt: string
	updatedAt: string
	art: art
	count: number
	isVoting: number
}
interface art {
	id: number
	createdAt: string
	updatedAt: string
	effect: any
	designer: designer
	owner: owner
	ownerNickname: string
	tokenId: any
	url: string
	isVote: number
	title: string
	description: string
	recentPrice: any
	dealList: any[]
}
interface designer {
	id: number
	createdAt: string
	updatedAt: string
	email: string
	nickname: string
	profile: string
	exp: number
	win: number
	lose: number
}
interface owner {
	id: number
	createdAt: string
	updatedAt: string
	email: string
	nickname: string
	profile: string
	exp: number
	win: number
	lose: number
}
export default function Vote() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	dispatch(setMainTab('vote'))

	const voteList: voteListProps[] = useSelector((state: any) => state.voteList)
	const currentUser = useSelector((state: any) => state.currentUser)
	const [setModalState, setModalMsg] = useModal('')

	useEffect(() => {
		vote.paintList().then((result) => {
			dispatch(setVoteList(result.data.response))
		})
		art.paintList({ nickname: currentUser.nickname }).then((result) => {
			// console.log(result)
			dispatch(setPaintList(result.data.response))
		})
	}, [])

	const goRank = () => {
		rank.rankList().then((result) => {
			dispatch(setRankList(result.data.response))
		})
		dispatch(setRankTabNo(3))
		navigate('/rank')
	}

	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={centerCSS}>
					<div css={listWrapper}>
						<div css={voteCSS}>
							<div className="voteIntro">
								<div className="headline">당신의 카드에 투표하세요!</div>
								<div>
									한 달에 한 작품씩 가장 많이 추천받은 작품을 무료로 NFT로 변환해 드립니다.{' '}
									<br></br>
									유저들의 상상력 가득한 그림중에서 가장 매력적인 카드에 투표해 주세요
								</div>
								<div>
									<button css={normalBtn} onClick={goRank}>
										지난 투표 결과 확인
									</button>
									<button css={normalBtn} onClick={() => setModalState('voteRegister')}>
										나도 출품하기
									</button>
								</div>
							</div>
							<div css={paintListCSS}>
								{voteList.length
									? voteList
											.filter((paint) => paint.vote.isVoting !== 2)
											.map((paint, i) => <VoteCard paint={paint} key={i} />)
									: null}
							</div>
						</div>
					</div>
				</div>
			</main>
		</Layout>
	)
}

const voteCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: 'GmarketSansMedium';
	.voteIntro {
		width: 100%;
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		text-align: center;
	}
	.headline {
		font-size: 25px;
		color: white;
		font-family: 'GongGothicMedium';
		margin: 20px 10px 10px 10px;
	}
	button {
		margin: 15px 10px 20px 10px;
	}
`
const paintListCSS = css`
	margin-top: 20px;
	display: grid;
	grid-template-rows: repeat(auto-fill, minmax(370px, 370px));
	grid-template-columns: repeat(auto-fill, minmax(220px, 220px));
	grid-gap: 0.5rem;
	justify-content: center;
	background-color: rgba(239, 238, 245, 0.15);
	border-radius: 1rem;
	width: 100%;
	height: 58vh;
	overflow-y: auto;
	padding: 1rem;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 5px;
		background-color: #3e525f;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ffffff;
		border-radius: 5px;
	}
`
const centerCSS = css`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`
const listWrapper = css`
	width: 60%;
`
