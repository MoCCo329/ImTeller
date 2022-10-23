import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import { setModalState, setModalMsg } from 'store/modules/util'

export default function AlertModal(props: any) {
	const dispatch = useDispatch()
	const modalMsg = useSelector((state: any) => state.modalMsg)

	return (
		<div css={alertModalCSS}>
			<div className="openModal modal">
				<section>
					<main>
						<div>{modalMsg}</div>
					</main>
					<footer>
						<button
							onClick={() => {
								dispatch(setModalState(''))
							}}
						>
							확인
						</button>
					</footer>
				</section>
			</div>
		</div>
	)
}
const alertModalCSS = css`
	.modal {
		display: none;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.6);
	}
	section {
		width: 90%;
		max-width: 450px;
		margin: 0 auto;
		border-radius: 25px;
		background-color: #fff;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-show 0.3s;
		overflow: hidden;
	}
	main {
		padding: 16px;
		font-family: 'GmarketSansMedium';
	}
	main div {
		text-align: center;
	}
	footer {
		padding: 12px 16px;
		text-align: right;
		display: flex;
		justify-content: center;
	}
	button {
		outline: none;
		cursor: pointer;
		border: 0;
		padding: 6px 12px;
		margin: 0px 10px 5px 10px;
		color: #1b5198;
		background-color: #d1e4ff;
		border-radius: 12px;
		font-size: 13px;
		width: 8em;
		font-family: 'GongGothicMedium';
	}
	.openModal {
		display: flex;
		align-items: center;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-bg-show 0.3s;
	}
	@keyframes modal-show {
		from {
			opacity: 0;
			margin-top: -50px;
		}
		to {
			opacity: 1;
			margin-top: 0;
		}
	}
	@keyframes modal-bg-show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`
