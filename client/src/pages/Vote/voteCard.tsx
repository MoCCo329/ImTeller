import { useSelector, useDispatch } from 'react-redux'

import { css } from '@emotion/react'
import liked from 'assets/image/like.webp'
import unliked from 'assets/image/unlike.webp'

import voteApi from 'actions/api/vote'
import art from 'actions/api/art'
import { setVoteList } from 'store/modules/art'
import { voteListProps } from './Vote'
import { useModal } from 'actions/hooks/useModal'
import axios from 'axios'

export default function VoteCard({ paint }: { paint: voteListProps }) {
	const dispatch = useDispatch()
	const { vote, like } = paint
	const currentUser = useSelector((state: any) => state.currentUser)
	const [setModalState, setModalMsg] = useModal('')

	const onClick = () => {
		setModalMsg(paint)
		setModalState('vote')
	}

	const onVote = () => {
		voteApi
			.vote({
				userNickname: currentUser.nickname,
				artId: vote.art.id,
			})
			.then((result) => {
				voteApi.paintList().then((result) => {
					dispatch(setVoteList(result.data.response))
				})
			})
	}
	const cancelRegiser = () => {
		art
			.cancelRegist(vote.art.id)
			.then((result) => {
				voteApi.paintList().then((result) => {
					dispatch(setVoteList(result.data.response))
				})
				setModalMsg('출품이 성공적으로 취소되었습니다.')
				setModalState('alert')
			})
			.catch((err) => {
				console.error(err)
			})
	}
	return (
		<div>
			<div>
				<div css={cardWrapperCSS}>
					<div css={type0CSS} onClick={onClick}>
						<img src={vote.art.url} alt="그림" css={paintImageCSS} />
					</div>
					<div className="cardInfo">
						<div className="cardHeader">
							<div className="cardTitle">{vote.art.title}</div>
							<div className="likeInfo">
								<img src={like ? liked : unliked} alt="" css={imgIconSmall} />
								<div>{vote.count}</div>
							</div>
						</div>
						<div className="description">{vote.art.description}</div>
						<div className="buttons">
							{like ? (
								<button onClick={onVote}>추천취소</button>
							) : (
								<button onClick={onVote}>추천하기</button>
							)}
							{vote.art.owner.nickname === currentUser.nickname ? (
								<button className="btn" onClick={cancelRegiser}>
									출품취소
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
const cardWrapperCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.6);
	border-radius: 15px;
	padding: 3px;
	margin: 10px;
	.cardInfo {
		font-size: 13px;
		margin: 0px 10px 10px 10px;
		font-family: 'GmarketSansMedium';
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}
	.cardInfo .description {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		width: 160px;
	}
	.cardHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 160px;
	}
	.likeInfo {
		display: flex;
		justify-content: center;
	}
	.likeInfo div {
		margin: 3px 0px 0px 3px;
	}
	.cardTitle {
		font-family: 'GongGothicMedium';
		font-size: 20px;
	}
	.buttons {
		display: flex;
		justify-content: center;
		width: 170px;
	}
	button {
		outline: 'none';
		cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
		border: 0px;
		padding: 6px 10px 6px 10px;
		margin: 5px 5px 5px 5px;
		color: #1b5198;
		background-color: #d1e4ff;
		border-radius: 12px;
		font-size: 13px;
		width: '8em';
		font-family: 'GongGothicMedium';

		&:hover {
			color: #d1e4ff;
			background-color: #112137;
		}
	}
`
const type0CSS = css`
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
`
const paintImageCSS = css`
	height: 222px;
	background-color: white;
	border-radius: 12px;
`
// 아이콘용 이미지 크기 조절
const imgIconSmall = css`
	width: 15px;
	height: 15px;
	margin: 3px;
`
