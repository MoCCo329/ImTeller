import { css } from '@emotion/react'
import drawFAQ1 from 'assets/image/drawFAQ1.webp'
import drawFAQ2 from 'assets/image/drawFAQ2.webp'
import drawFAQ3 from 'assets/image/drawFAQ3.webp'
import drawFAQ4 from 'assets/image/drawFAQ4.webp'
import drawFAQ5 from 'assets/image/drawFAQ5.webp'
import drawFAQ6 from 'assets/image/drawFAQ6.webp'

const ArtDetail = () => {
	return (
		<div css={Box}>
			<div css={Data}>
				<p>&nbsp;</p>
				<h3>[그림 그리기]</h3>
				<p>플레이어는 게임에 사용할 수 있는 NFT 카드를 직접 그린 후 민팅할 수 있습니다.</p>
				<p>
					<span style={{ color: 'yellow' }}>주의!</span> 게임에 사용할 수 있는 카드는{' '}
					<u>민팅이 된 NFT 카드</u> 입니다!
				</p>
				<p>&nbsp;</p>
				<img src={drawFAQ1} />
				<p>&nbsp;</p>
				<p>로그인 후 화면 상단의 내 닉네임을 클릭하세요!</p>
				<p>그리고 우측의 그림그리기 버튼을 클릭합니다.</p>
				<p>&nbsp;</p>
				<img src={drawFAQ2} />
				<p>&nbsp;</p>

				<p>이 곳에서 마음껏 여러분만의 카드를 직접 그릴 수 있습니다!</p>
				<p>열심히 그리고 제목과 설명을 작성하고 저장해줍니다!</p>

				<p>&nbsp;</p>
				<img src={drawFAQ3} />
				<p>&nbsp;</p>

				<p>내 그림 창에 새로운 그림이 추가되었습니다!</p>
				<p>마우스를 올리면 그림으로 할 수 있는 다양한 기능들을 사용할 수 있습니다!</p>
				<p>
					<span style={{ color: 'yellow' }}>수정하기</span>를 통해 그림을 수정할 수 있고,
				</p>
				<p>
					<span style={{ color: 'skyblue' }}>출품하기</span>를 통해 그림을 출품할 수 있고,
				</p>
				<p>
					<span style={{ color: 'yellowgreen' }}>민팅하기</span>를 통해 SSF를 사용해서 게임에 사용할
					수 있는 NFT 카드를 만들고 아이템 효과를 부여할 수 있고,
				</p>
				<p>
					<span style={{ color: 'red' }}>삭제하기</span>를 통해 그림을 삭제할 수 있습니다!
				</p>
				<p>민팅하기의 경우 FAQ[NFT]를 참고하세요!</p>
				<p>&nbsp;</p>
				<img src={drawFAQ4} />
				<p>&nbsp;</p>

				<h3>[출품하기]</h3>
				<p>플레이어는 한 번에 최대 1개의 그림을 출품할 수 있습니다.</p>
				<p>&nbsp;</p>
				<img src={drawFAQ5} />
				<p>&nbsp;</p>
				<p>
					출품된 그림은 매달 투표를 받아 매 월 1일에 최다 득표작은{' '}
					<span style={{ color: 'yellow' }}>무료 민팅 기회</span>를 얻게 됩니다.
				</p>
				<p>매 월 우수 작품으로 선정되면 랭킹 탭에서도 여러분의 작품을 볼 수 있게 됩니다!</p>

				<p>&nbsp;</p>
				<img src={drawFAQ6} width={'400px'} />
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

export default ArtDetail
