import { css } from '@emotion/react'
import spinner from 'assets/image/spinner.gif'

const Loading = (props: any) => {
	const msg = props.msg
	return (
		<div css={loadingCSS}>
			<div className="backgorund">
				<img src={spinner} alt="스피너" />
				<div className="msg">{msg}</div>
			</div>
		</div>
	)
}
export default Loading
const loadingCSS = css`
	.backgorund {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.msg {
		color: white;
		font-family: 'GongGothicMedium';
		white-space: pre;
		text-align: center;
	}
	img {
		width: 400px;
	}
`
