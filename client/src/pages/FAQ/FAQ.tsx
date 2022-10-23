import { css } from '@emotion/react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import Layout from 'layout/layout'
import FaqNavBar from 'pages/FAQ/FaqNavBar'
import GameVideo from 'pages/FAQ/GameVideo'
import GameDetail from 'pages/FAQ/GameDetail'
import ItemDetail from 'pages/FAQ/ItemDetail'
import ArtDetail from 'pages/FAQ/ArtDetail'
import NFTDetail from 'pages/FAQ/NFTDetail'
import { setMainTab } from 'store/modules/util'
import { fullDisplay } from 'style/commonStyle'

export default function FAQ() {
	const [faqTab, setFaqTab] = useState('video')
	const dispatch = useDispatch()
	dispatch(setMainTab('faq'))
	return (
		<Layout>
			<main css={Main}>
				<div css={fullDisplay}>
					<div css={box}>
						<FaqNavBar faqTab={faqTab} setFaqTab={setFaqTab} />
						{faqTab === 'video' && <GameVideo />}
						{faqTab === 'game' && <GameDetail />}
						{faqTab === 'item' && <ItemDetail />}
						{faqTab === 'art' && <ArtDetail />}
						{faqTab === 'nft' && <NFTDetail />}
					</div>
				</div>
			</main>
		</Layout>
	)
}

const Main = css`
	height: 100%;
	display: flex;
	justify-content: center;
`

const box = css`
	display: flex;
	flex-direction: column;
	width: 80vw;
`
