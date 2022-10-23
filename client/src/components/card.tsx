import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'
import { imgBigIcon } from 'style/commonStyle'
import check from 'assets/image/check.webp'
import gradeS from 'assets/image/gradeS.webp'
import gradeA from 'assets/image/gradeA.webp'
import gradeB from 'assets/image/gradeB.webp'

import { setSelectedCards } from 'store/modules/game'
import { setSelectedCard } from 'store/modules/art'
import itemDetail from 'actions/functions/itemDetail'

export default function Card(props: any) {
	const {
		cardId,
		cardTitle,
		cardImageURL,
		description,
		grade,
		effect,
		effectNum,
		createdDT,
		recentPrice,
	} = props.card
	const type = props.type
	const dispatch = useDispatch()

	const selectedCards = useSelector((state: any) => state.selectedCards)
	const selectedCard = useSelector((state: any) => state.selectedCard)
	const [selected, setSelected] = useState(false)
	const [effectPre, effectPost, effectName] = itemDetail(effect, effectNum)

	useEffect(() => {
		if (type === 1 && selectedCards.includes(cardId)) {
			setSelected(true)
		} else if (type === 2 && selectedCard === cardId) {
			setSelected(true)
		} else {
			setSelected(false)
		}
	}, [selectedCards])

	// 기본적으로 호버시 카드 능력 나오게
	// type 0: 선택 불가능하게
	// type 1: 카드 선택 모달에서 사용.
	// type 2: 딜 등록에서 사용

	const select = () => {
		if (type === 1) {
			dispatch(setSelectedCards(cardId))
		}
		if (type === 2) {
			dispatch(setSelectedCard(cardId))
		}
	}

	return (
		<div css={cardWrapperCSS}>
			<div css={type === 1 && selected ? type1CSS : type0CSS} onClick={select}>
				<img css={cardImageCSS} src={cardImageURL} alt="" />
				<div css={!selected ? type0InfoCSS : displayNoneCSS}>
					<div className="buttons">
						<div>{grade}</div>
						<div>{effectName}</div>
						<div>{`${effectNum} ${effectPost}`}</div>
					</div>
				</div>
			</div>
			<div css={type === 1 && selected ? type1InfoCSS : displayNoneCSS}>
				<img src={check} alt="" css={imgBigIcon} />
			</div>
			{type === 0 ? (
				<div className="cardInfo">
					<div className="textInfo">
						<div>{description}</div>
						<div className="cardTitle">{cardTitle}</div>
						<div>{createdDT.slice(0, 10)}</div>
						{recentPrice ? <div>{recentPrice} SSF</div> : null}
					</div>
					{grade == 'S' ? <img src={gradeS} alt="" /> : null}
					{grade == 'A' ? <img src={gradeA} alt="" /> : null}
					{grade == 'B' ? <img src={gradeB} alt="" /> : null}
				</div>
			) : null}
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
		justify-content: space-between;
		align-items: center;
	}
	.textInfo div {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		width: 90px;
	}
	.cardInfo img {
		margin-top: 10px;
	}
	.cardTitle {
		font-family: 'GongGothicMedium';
		font-size: 20px;
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
	&:hover {
		> div {
			display: block;
		}
		> img {
			filter: brightness(0.4);
		}
	}
`
const cardImageCSS = css`
	height: 222px;
	background-color: white;
	border-radius: 12px;
`
const type0InfoCSS = css`
	display: none;
	position: absolute;
	/* top: -240px; // 부모인 paintImgCSS 높이만큼 올려주면 됨 */
	width: 100%;
	height: 100%;
	color: white;
	font-family: 'GongGothicMedium';
	.buttons {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
`
const type1CSS = css`
	filter: brightness(0.5);
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
const type1InfoCSS = css`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 190px;
	/* top: -9vh; */
	/* left: 4.5vh; */
`
const displayNoneCSS = css`
	display: none;
`
