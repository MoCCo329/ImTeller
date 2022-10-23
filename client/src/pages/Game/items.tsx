import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import Item from 'components/item'
import { addChat } from 'store/modules/game'
import itemDetail from 'actions/functions/itemDetail'

export default function Items(props: any) {
	const dispatch = useDispatch()
	const { client, roomId } = props
	const { nickname } = useSelector((state: any) => state.currentUser)
	const items = useSelector((state: any) => state.items)

	const onClick = (event, item) => {
		if (event.detail !== 2) return

		client.publish({
			destination: `/pub/room/${roomId}/item`,
			body: JSON.stringify({
				nickname,
				cardId: item.cardId,
				grade: item.grade,
				effect: item.effect,
				effectNum: item.effectNum,
			}),
		})
		const [effectPre, effectPost, effectName] = itemDetail(item.effect, item.effectNum)
		dispatch(
			addChat({
				nickname: '겜비서',
				userMsg: `${effectName} 아이템을 사용했습니다. (${effectPre}${
					item.effectNum ? item.effectNum : ''
				}${effectPost})`,
			}),
		)
	}

	return (
		<div css={itemsCSS}>
			{items
				.filter((item) => !item.used)
				.map((item) => (
					<div
						onClick={(e) => {
							onClick(e, item)
						}}
						key={item.cardId}
					>
						<Item item={item} />
					</div>
				))}
		</div>
	)
}

const itemsCSS = css`
	background-color: rgb(0, 0, 0, 0.2);
	border-radius: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	height: 60vh;
`
