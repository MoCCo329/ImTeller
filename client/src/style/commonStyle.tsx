import { css } from '@emotion/react'

// 와이어프레임에 나온 기본 버튼
const normalBtn = css`
	outline: 'none';
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	border: 0px;
	padding: 6px 20px 6px 20px;
	margin: 0px 10px 5px 10px;
	color: #1b5198;
	background-color: #d1e4ff;
	border-radius: 12px;
	font-size: 13px;
	width: '8em';
	font-family: 'GongGothicMedium';

	&:hover {
		color: #d1e4ff;
		background-color: #112137;
	}
`
// text만 적혀있는 버튼
const textBtn = css`
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
`
const input = css({
	padding: '10px 10px',
	margin: 10,
	boxSizing: 'border-box',
	border: 'none',
	borderRadius: '12px',
	width: '95%',
	fontFamily: 'GongGothicMedium',
})
const textarea = css`
	padding: 10px 10px;
	margin: 10px;
	box-sizing: border-box;
	border: none;
	border-radius: 12px;
	width: 95%;
	font-family: 'GongGothicMedium';
	resize: vertical;
`
// 아이콘용 이미지 크기 조절
const imgIcon = css({
	width: 20,
	height: 20,
	cursor: `url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;`,
})
// 아이콘용 이미지 크기 조절
const imgBigIcon = css({
	width: 40,
	height: 40,
})

// 페이지 풀 사이즈로 키우기
const fullDisplay = css`
	height: calc(100vh - 95px - 43px);
`

// 증간으로 배치 세로로
const centerColCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`
// 중간으로 배치 가로로
const centerRowCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export {
	normalBtn,
	textBtn,
	input,
	textarea,
	imgIcon,
	fullDisplay,
	centerColCSS,
	centerRowCSS,
	imgBigIcon,
}
