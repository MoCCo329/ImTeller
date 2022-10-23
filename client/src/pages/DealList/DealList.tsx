import { useSelector, useDispatch } from 'react-redux'
import { css } from '@emotion/react'
import Search from 'pages/DealList/search'
import Layout from 'layout/layout'
import Deal from 'components/deal'
import { fullDisplay } from 'style/commonStyle'
import { setMainTab } from 'store/modules/util'

export default function DealList() {
	const dealList = useSelector((state: any) => state.dealList)
	const currentUser = useSelector((state: any) => state.currentUser)
	const dispatch = useDispatch()
	dispatch(setMainTab('deal'))

	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={centerCSS}>
					<div css={listWrapper}>
						<div css={nav}>
							<Search />
						</div>

						<div css={centerListCSS}>
							{dealList.map((deal: any) => (
								<Deal deal={deal} key={deal.dealId} />
							))}
						</div>
					</div>
				</div>
			</main>
		</Layout>
	)
}
const centerCSS = css`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	font-family: 'GongGothicMedium';
`

const centerListCSS = css`
	margin-top: 1rem;
	width: 100%;
	height: 65vh;
	background-color: rgba(239, 238, 245, 0.15);
	border-radius: 1rem;
	display: grid;
	grid-template-rows: repeat(auto-fill, minmax(320px, 320px));
	grid-template-columns: repeat(auto-fill, minmax(400px, 400px));
	grid-gap: 0.5rem;
	justify-content: center;
	font-family: 'GongGothicMedium';
	overflow-y: auto;

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

const nav = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 10px;
	width: 90%;
`
const listWrapper = css`
	width: 70%;
	display: flex;
	flex-direction: column;
	align-items: center;
`
