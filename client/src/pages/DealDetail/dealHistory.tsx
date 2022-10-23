import { useState, useEffect } from 'react'
import { css } from '@emotion/react'
export default function DealHistory(props: any) {
	const { dealHistoryList } = props
	return (
		<div css={box}>
			<div css={list}>
				{dealHistoryList.length ? (
					<div>
						<table>
							<thead>
								<tr>
									<th>거래 일시</th>
									<th>판매자</th>
									<th>구매자</th>
									<th>거래 가격</th>
								</tr>
							</thead>
							<tbody>
								{dealHistoryList.map((history, idx) => (
									<tr key={idx}>
										<td>{history.dealedAt.slice(0, 10)}</td>
										<td>{history.sellerNickname}</td>
										<td>{history.buyerNickname}</td>
										<td>{history.price}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : null}
			</div>
		</div>
	)
}
const box = css`
	display: flex;
	justify-content: flex-start;
	color: white;
	width: 400px;
`

const list = css`
	width: 100%;
	margin-bottom: 1rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
	table {
		margin-top: 10px;
		width: 100%;
	}
	th {
		border-bottom: 1px solid #aaa;
		font-family: 'GmarketSansMedium';
		font-size: 15px;
	}
	tbody {
		font-family: 'GmarketSansMedium';
	}
	td {
		line-height: 27px;
		font-size: 13px;
		text-align: center;
	}
`
