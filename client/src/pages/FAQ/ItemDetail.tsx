import { css } from '@emotion/react'

const ItemDetail = () => {
	return (
		<div css={Box}>
			<div css={Data}>
				<p>&nbsp;</p>
				<h3>[아이템 정보]</h3>
				<p>&nbsp;</p>
				<table className="item-info" border={1}>
					<th style={{ width: '20%' }}>아이템</th>
					<th style={{ width: '55%' }}>설명</th>
					<th style={{ width: '10%' }}>등급</th>
					<th style={{ width: '15%' }}>디테일</th>
					<tr>
						<td rowSpan={3}>시간단축</td>
						<td rowSpan={3}>사진 선택 시간을 단축시킵니다.</td>
						<td>S</td>
						<td>10초</td>
					</tr>
					<tr>
						<td>A</td>
						<td>7초</td>
					</tr>
					<tr>
						<td>B</td>
						<td>5초</td>
					</tr>
					<tr>
						<td rowSpan={3}>시야방해</td>
						<td rowSpan={3}>작품 선택 시간에 모든 카드들을 가립니다.</td>
						<td>S</td>
						<td>60%</td>
					</tr>
					<tr>
						<td>A</td>
						<td>40%</td>
					</tr>
					<tr>
						<td>B</td>
						<td>20%</td>
					</tr>
					<tr style={{ height: '4rem' }}>
						<td>카드 미리 받기</td>
						<td>사용 시 바로 덱에서 카드 한장을 가져옵니다.</td>
						<td>A</td>
						<td>패 1장</td>
					</tr>
					<tr>
						<td rowSpan={3}>나만 추가점수</td>
						<td rowSpan={3}>이번 턴에 점수를 획득하면 추가로 점수를 획득할 수 있습니다.</td>
						<td>S</td>
						<td>3</td>
					</tr>
					<tr>
						<td>A</td>
						<td>2</td>
					</tr>
					<tr>
						<td>B</td>
						<td>1</td>
					</tr>
					<tr>
						<td rowSpan={3}>전체 추가점수</td>
						<td rowSpan={3}>모든 유저가 자신이 받은 점수에 정해진 %만큼을 더 가져갑니다.</td>
						<td>S</td>
						<td>250%</td>
					</tr>
					<tr>
						<td>A</td>
						<td>200%</td>
					</tr>
					<tr>
						<td>B</td>
						<td>150%</td>
					</tr>
					<tr style={{ height: '4rem' }}>
						<td>모든 카드 흑백</td>
						<td>사용 시 작품 선택 시간에 모든 카드를 흑백으로 만듭니다.</td>
						<td>A</td>
						<td>흑백</td>
					</tr>
				</table>
				<p>&nbsp;</p>
				<h3>[아이템 부여 확률]</h3>
				<p>&nbsp;</p>
				<table className="item-percentage" border={1}>
					<th style={{ width: '20%' }}>등급</th>
					<th style={{ width: '20%' }}>확률</th>
					<th style={{ width: '40%' }}>아이템</th>
					<th style={{ width: '20%' }}>세부확률</th>
					<tr>
						<td rowSpan={4}>S</td>
						<td rowSpan={4}>5%</td>
						<td>시간단축</td>
						<td>30%</td>
					</tr>
					<tr>
						<td>시야방해</td>
						<td>30%</td>
					</tr>
					<tr>
						<td>나만 추가점수</td>
						<td>15%</td>
					</tr>
					<tr>
						<td>전체 추가점수</td>
						<td>25%</td>
					</tr>
					<tr>
						<td rowSpan={6}>A</td>
						<td rowSpan={6}>30%</td>
						<td>시간단축</td>
						<td>15%</td>
					</tr>
					<tr>
						<td>시야방해</td>
						<td>20%</td>
					</tr>
					<tr>
						<td>카드 미리 받기</td>
						<td>5%</td>
					</tr>
					<tr>
						<td>나만 추가점수</td>
						<td>15%</td>
					</tr>
					<tr>
						<td>전체 추가점수</td>
						<td>20%</td>
					</tr>
					<tr>
						<td>모든 카드 흑백</td>
						<td>25%</td>
					</tr>
					<tr>
						<td rowSpan={4}>B</td>
						<td rowSpan={4}>65%</td>
						<td>시간단축</td>
						<td>30%</td>
					</tr>
					<tr>
						<td>시야방해</td>
						<td>30%</td>
					</tr>
					<tr>
						<td>나만 추가점수</td>
						<td>15%</td>
					</tr>
					<tr>
						<td>전체 추가점수</td>
						<td>25%</td>
					</tr>
				</table>
				<p>&nbsp;</p>
			</div>
		</div>
	)
}

const Box = css`
	display: flex;
	flex-direction: column;
	margin: 2rem;
`

const Data = css`
	width: 100%;
	height: 65vh;
	border-radius: 1rem;
	box-shadow: 2px 2px 16px white;
	margin-bottom: 1rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	overflow: auto;
	flex-direction: column;

	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 3px;
		background-color: #3e525f;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ffffff;
		border-radius: 3px;
	}

	p {
		font-family: 'LeferiBaseType-RegularA';
		color: white;
		margin: 0.5rem;
	}

	h3 {
		font-family: LeferiPoint-BlackObliqueA;
		color: #ffff00;
		margin: 0.25rem;
	}

	.item-info {
		min-width: 400px;
		width: 50vw;

		th {
			background-color: #c6c6c6;
			color: black;
		}
	}

	.item-percentage {
		min-width: 300px;
		width: 30vw;

		th {
			background-color: #c6c6c6;
			color: black;
		}
	}

	table,
	th,
	td {
		border: 1px solid white;
		border-collapse: collapse;
		color: white;
		text-align: center;
	}
`

export default ItemDetail
