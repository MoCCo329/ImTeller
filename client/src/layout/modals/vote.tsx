import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'
import liked from 'assets/image/like.webp'
import unliked from 'assets/image/unlike.webp'
import voteApi from 'actions/api/vote'
import art from 'actions/api/art'
import { voteListProps } from 'pages/Vote/Vote'
import { setPaintList, setVoteList } from 'store/modules/art'
import { setModalState, setModalMsg, setModalResult } from 'store/modules/util'

export default function VoteModal(props: any) {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const currentUser = useSelector((state: any) => state.currentUser)
	const paintList = useSelector((state: any) => state.paintList)
	const { vote, like }: voteListProps = useSelector((state: any) => state.modalMsg)

	const [isMyPaint, setIsMyPaint] = useState(false)
	useEffect(() => {
		art.paintList({ nickname: currentUser.nickname }).then((result) => {
			console.log(result)
			dispatch(setPaintList(result.data.response))
		})
	}, [])

	useEffect(() => {
		if (
			paintList.some((paint) => {
				if (paint.paintId === vote.art.id) return true
			})
		) {
			setIsMyPaint(true)
		}
	}, [])

	const onCancel = () => {
		art.cancelRegist(vote.art.id).then((result) => {
			console.log(result.data)
			navigate('/vote')
		})
	}

	const onVote = () => {
		const data = {
			userNickname: currentUser.nickname,
			artId: vote.art.id,
		}
		voteApi
			.vote(data)
			.then((result) => {
				console.log(result)
				voteApi
					.paintList()
					.then((result) => {
						dispatch(setVoteList(result.data.response))
						console.log('출품 목록 새로 불러움')
					})
					.catch((err) => console.log(err))
				dispatch(setModalState(''))
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<div css={voteModalCSS}>
			<div className="openModal modal">
				<section>
					<header>
						<div id="title">{vote.art.title}</div>
					</header>
					<main>
						<div css={type0CSS}>
							<img src={vote.art.url} alt="paintTitle" css={cardImageCSS} />
						</div>
						<div className="infos">
							<div id="nickname">by. {vote.art.designer.nickname}</div>
							<div id="description">{vote.art.description}</div>
							<hr></hr>
							<div id="liked">
								<img src={like ? liked : unliked} alt="" css={imgIconSmall} />
								{vote.count}
							</div>
						</div>
					</main>
					<footer>
						<button onClick={() => dispatch(setModalState(''))}>돌아가기</button>
						<button onClick={onVote}>추천하기</button>
						{isMyPaint ? <button onClick={onCancel}>출품 취소하기</button> : null}
					</footer>
				</section>
			</div>
		</div>
	)
}
const voteModalCSS = css`
	.modal {
		display: none;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.6);
	}
	section {
		max-width: 500px;
		margin: 0 auto;
		border-radius: 25px;
		background-color: #fff;
		animation: modal-show 0.3s;
		overflow: hidden;
	}
	header {
		position: relative;
		padding: 25px 16px 6px 16px;
		display: flex;
		justify-content: center;
		font-family: 'GongGothicMedium';
		font-size: 25px;
	}
	main {
		min-width: 250px;
		font-family: 'GmarketSansMedium';
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0px 16px 0px 16px;
	}
	.infos {
		margin: 5px;
	}
	#nickname {
		margin: 3px 0px 5px 0px;
		font-size: 14px;
	}
	#description {
		margin: 3px 0px 5px 0px;
		white-space: pre-line;
	}
	#liked {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin: 10px 0px 5px 0px;
	}
	footer {
		padding: 12px 16px;
		text-align: right;
		display: flex;
		justify-content: center;
	}
	button {
		outline: none;
		cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
		border: 0;
		padding: 6px 12px;
		margin: 0px 10px 5px 10px;
		color: #1b5198;
		background-color: #d1e4ff;
		border-radius: 12px;
		font-size: 13px;
		width: 8em;
		font-family: 'GongGothicMedium';
	}
	.openModal {
		display: flex;
		align-items: center;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-bg-show 0.3s;
	}
	@keyframes modal-show {
		from {
			opacity: 0;
			margin-top: -50px;
		}
		to {
			opacity: 1;
			margin-top: 0;
		}
	}
	@keyframes modal-bg-show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
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
	margin: 5px;
`
const cardImageCSS = css`
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
