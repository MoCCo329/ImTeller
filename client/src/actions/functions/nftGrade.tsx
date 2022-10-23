import { useSelector } from 'react-redux'

export default function (selectedCardList) {
	const cardList = useSelector((state: any) => state.cardList)

	let cardGrade = { S: 0, A: 0, B: 0, C: 0 }
	let result: string = ''

	if (!selectedCardList.length) return result

	for (let cardId of selectedCardList) {
		for (let card of cardList) {
			if (card.cardId === cardId) {
				cardGrade[card.grade] += 1
				break
			}
		}
	}

	for (let key in cardGrade) {
		if (cardGrade[key] !== 0) {
			result += key.repeat(cardGrade[key])
		}
	}

	return result
}
