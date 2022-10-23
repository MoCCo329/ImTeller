/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rankListProps, winningRateRankProps } from './Rank'
export default function rankListDealWin({ rankList }: { rankList: rankListProps }) {
	const winningRateRankList: winningRateRankProps[] = rankList.winningRateRankList
	// console.log('rankList', typeof rankList)
	// console.log(rankList[0])
	return (
		<div css={box}>
			<div css={list}>
				<table>
					<thead>
						<tr>
							<th>순위</th>
							<th>닉네임</th>
							<th>승률</th>
							<th>승리</th>
							<th>패배</th>
						</tr>
					</thead>
					<tbody>
						{winningRateRankList ? (
							winningRateRankList.map((rank, i) => (
								<tr key={i}>
									<td width="20%">{i + 1}위</td>
									<td width="40%">{rank.nickname}</td>
									<td width="20%">{rank.winningRate}</td>
									<td width="10%">{rank.win}</td>
									<td width="10%">{rank.lose}</td>
								</tr>
							))
						) : (
							<tr>해당하는 데이터가 없습니다</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
const box = css`
	display: flex;
	flex-direction: column;
	margin: 2rem;
`

const list = css`
	width: 100%;
	height: 65vh;
	/* background-color: rgba(239, 238, 245, 0.3); */
	border-radius: 1rem;
	box-shadow: 2px 2px 16px;
	margin-bottom: 1rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
	color: white;
	table {
		margin-top: 5px;
		width: 100%;
	}
	th {
		line-height: 5vh;
		border-bottom: 1px solid #aaa;
		font-family: 'GmarketSansMedium';
		font-size: 20px;
	}
	tbody {
		font-family: 'GmarketSansMedium';
	}
	td {
		line-height: 5.5vh;
		text-align: center;
		font-size: 15px;
	}
`
