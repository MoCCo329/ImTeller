import { css } from '@emotion/react'
import nftFAQ0 from 'assets/image/nftFAQ0.webp'
import nftFAQ1 from 'assets/image/nftFAQ1.webp'
import nftFAQ2 from 'assets/image/nftFAQ2.webp'
import nftFAQ3 from 'assets/image/nftFAQ3.webp'
import nftFAQ4 from 'assets/image/nftFAQ4.webp'
import nftFAQ5 from 'assets/image/nftFAQ5.webp'
import nftFAQ6 from 'assets/image/nftFAQ6.webp'
import nftFAQ7 from 'assets/image/nftFAQ7.webp'

const NFTDetail = () => {
	return (
		<div css={Box}>
			<div css={Data}>
				<p>&nbsp;</p>
				<h3>[민팅하기]</h3>
				<p>
					여러분이 그린 카드를 실제 게임에서 사용하기 위해서는{' '}
					<span style={{ color: 'yellow' }}>민팅</span>이 필요합니다.
				</p>
				<p>민팅은 여러분의 작품을 NFT화시켜서 유일한 디지털자산으로 만드는 과정입니다!</p>
				<p>민팅을 통해 NFT카드를 만들고 아이템을 사용할 수 있는 기회를 얻어보세요!</p>

				<p>마이페이지의 내 그림 탭에서 내 그림 위에 마우스를 올리면 민팅하기 버튼이 보입니다.</p>
				<p>이 버튼을 누르면 바로 민팅을 진행하실 수 있습니다!</p>

				<p>&nbsp;</p>
				<img src={nftFAQ0} />
				<p>&nbsp;</p>

				<p>
					<span style={{ color: 'yellow' }}>주의!</span> 민팅을 위해서는 디지털 자산 보호를 위한
					Metamask 지갑 연결이 필요합니다!
				</p>
				<p>
					여러분들의 게임 데이터 아래쪽에 검은색 버튼을 통해 Metamask 지갑을연결할 수 있으니
					참고하세요!
				</p>

				<p>&nbsp;</p>
				<img src={nftFAQ3} />
				<p>&nbsp;</p>

				<p>지갑이 연결되었다면 자동으로 민팅 과정을 위한 여러 절차가 진행됩니다.</p>
				<p>
					한 번의 민팅에는 <span style={{ color: 'yellow' }}>10SSF</span>가 소모됩니다!{' '}
				</p>
				<p>(무료 민팅 기회를 얻은 그림의 경우 제외)</p>

				<p>&nbsp;</p>
				<img src={nftFAQ1} />
				<p>&nbsp;</p>

				<p>민팅에는 비용과 시간이 다소 소요될 수 있습니다!</p>
				<p>여러분들의 작품이 NFT화 되고있는 것이니 조금만 기다려주세요 :)</p>
				<p>&nbsp;</p>
				<img src={nftFAQ2} />
				<p>&nbsp;</p>
				<p>&nbsp;</p>

				<h3>[NFT 카드]</h3>
				<p>민팅된 카드는 NFT카드라고도 부릅니다.</p>
				<p>이제 실제로 게임에서 해당 카드를 사용할 수도 있고,</p>
				<p>부여된 능력치에 따라 맞는 아이템을 사용할 수도 있게 되었습니다!</p>
				<p>개인이 소유한 NFT카드는 마이페이지 NFT 카드 탭에서 확인할 수 있습니다.</p>
				<p>그림 위에 마우스를 올리면 부여받은 아이템의 속성도 확인할 수 있습니다.</p>

				<p>&nbsp;</p>
				<img src={nftFAQ4} />
				<p>&nbsp;</p>
				<p>&nbsp;</p>

				<h3>[거래소]</h3>
				<p>여러분이 가진 NFT 카드는 거래소에서 플레이어끼리 사고 팔 수 있습니다.</p>
				<p>상단 거래소 탭에서 여러분의 NFT 카드를 팔거나 필요한 NFT 카드를 구매해보세요!</p>

				<p>&nbsp;</p>
				<img src={nftFAQ5} />
				<p>&nbsp;</p>

				<p>카드의 즉시구매가, 판매기간, 태그를 설정하고 거래소에 올릴 수 있습니다.</p>
				<p>카드가 판매되면 자동으로 Metamask 지갑에 SSF가 입금됩니다.</p>

				<p>&nbsp;</p>
				<img src={nftFAQ7} />
				<p>&nbsp;</p>

				<p>각 NFT 카드의 상세보기 버튼을 누르면 카드가 부여받은 아이템을 확인할 수 있습니다.</p>
				<p>즉시 구매 버튼을 통해 내 NFT 카드로 만들어보세요!</p>

				<p>&nbsp;</p>
				<img src={nftFAQ6} />
				<p>&nbsp;</p>

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

	img {
		border: solid 5px;
	}
`

export default NFTDetail
