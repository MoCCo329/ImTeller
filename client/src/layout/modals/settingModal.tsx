import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from '@emotion/react'

import {
	setIsBgmOn,
	setBgmVolume,
	setIsEffectOn,
	setEffectVolume,
	setIsMouseEffectOn,
	setModalState,
} from 'store/modules/util'

export default function SettingModal(props: any) {
	const dispatch = useDispatch()

	const isChecked = useSelector((state: any) => state.isChecked) // 게임 진행중인지
	const isBgmOn = useSelector((state: any) => state.isBgmOn)
	const bgmVolume = useSelector((state: any) => state.bgmVolume)
	const isEffectOn = useSelector((state: any) => state.isEffectOn)
	const effectVolume = useSelector((state: any) => state.effectVolume)
	const isMouseEffectOn = useSelector((state: any) => state.isMouseEffectOn)

	const [settings, setSettings] = useState<any>({})

	useEffect(() => {
		setSettings({
			isBgmOn,
			bgmVolume,
			isEffectOn,
			effectVolume,
			isMouseEffectOn,
		})
	}, [])

	const onCancle = () => {
		dispatch(setIsBgmOn(settings.isBgmOn))
		dispatch(setBgmVolume(settings.bgmVolume))
		dispatch(setIsEffectOn(settings.isEffectOn))
		dispatch(setEffectVolume(settings.effectVolume))
		dispatch(setIsMouseEffectOn(settings.isMouseEffectOn))
		dispatch(setModalState(''))
	}

	return (
		<div css={makeRoomModalCSS}>
			<div className="openModal modal">
				<section>
					<header>사이트 설정</header>
					<main>
						<label htmlFor="isBgmOn">배경음악 재생</label>
						<div id="isBgmOn">
							<div
								onClick={() => dispatch(setIsBgmOn(true))}
								style={isBgmOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								On
							</div>
							<div
								onClick={() => dispatch(setIsBgmOn(false))}
								style={!isBgmOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								Off
							</div>
						</div>
						<label htmlFor="bgmVolume">배경음악 볼륨</label>
						<input
							type="range"
							id="bgmVolume"
							min="0"
							max="100"
							step="1"
							value={bgmVolume}
							onChange={(e) => {
								dispatch(setBgmVolume(e.target.value))
							}}
						/>
						{/* <hr />
						<label htmlFor="isEffectOn">효과음 재생</label>
						<div id="isEffectOn">
							<div
								onClick={() => dispatch(setIsEffectOn(true))}
								style={isEffectOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								On
							</div>
							<div
								onClick={() => dispatch(setIsEffectOn(false))}
								style={!isEffectOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								Off
							</div>
						</div>
						<label htmlFor="effectVolume">효과음 볼륨</label>
						<input
							type="range"
							id="effectVolume"
							min="0"
							max="100"
							step="1"
							value={effectVolume}
							onChange={(e) => {
								dispatch(setEffectVolume(e.target.value))
							}}
						/> */}
						<hr />
						<label htmlFor="isMouseEffectOn">마우스 효과음</label>
						<div id="isMouseEffectOn">
							<div
								onClick={() => dispatch(setIsMouseEffectOn(true))}
								style={isMouseEffectOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								On
							</div>
							<div
								onClick={() => dispatch(setIsMouseEffectOn(false))}
								style={!isMouseEffectOn ? { backgroundColor: '#d1e4ff', color: '#1b5198' } : null}
							>
								Off
							</div>
						</div>
					</main>
					<footer>
						<button onClick={onCancle}>취소</button>
						<button onClick={() => dispatch(setModalState(''))}>확인</button>
					</footer>
				</section>
			</div>
			<hr />
		</div>
	)
}
const makeRoomModalCSS = css`
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
		max-width: 500px;
		margin: 0 auto;
		border-radius: 25px;
		background-color: #fff;
		/* 팝업이 열릴때 스르륵 열리는 효과 */
		animation: modal-show 0.3s;
		overflow: hidden;
	}
	header {
		position: relative;
		padding: 25px 16px 16px 16px;
		display: flex;
		justify-content: center;
		font-family: 'GongGothicMedium';
		font-size: 25px;
	}
	main {
		padding: 16px;
		font-family: 'GmarketSansMedium';
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	#isBgmOn {
		display: flex;
	}
	#isBgmOn div {
		margin: 1px 2px 1px 2px;
		padding: 4px;
		border-radius: 10px;
	}
	#isEffectOn {
		display: flex;
	}
	#isEffectOn div {
		margin: 1px 2px 1px 2px;
		padding: 4px;
		border-radius: 10px;
	}
	#isMouseEffectOn {
		display: flex;
	}
	#isMouseEffectOn div {
		margin: 1px 2px 1px 2px;
		padding: 4px;
		border-radius: 10px;
	}
	label {
		margin-top: 3px;
	}
	input[type='range'] {
		height: 27px;
		-webkit-appearance: none;
		margin: 10px 0;
		width: 20%;
	}
	input[type='range']:focus {
		outline: none;
	}
	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		box-shadow: 0px 0px 0px #000000;
		background: #d1e4ff;
		border-radius: 50px;
		border: 0px solid #010101;
	}
	input[type='range']::-webkit-slider-thumb {
		box-shadow: 1px 1px 1px #000031;
		border: 0px solid #00001e;
		height: 20px;
		width: 20px;
		border-radius: 50px;
		background: #d1e4ff;
		cursor: pointer;
		-webkit-appearance: none;
		margin-top: -5px;
	}
	input[type='range']:focus::-webkit-slider-runnable-track {
		background: #d1e4ff;
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		box-shadow: 0px 0px 0px #000000;
		background: #d1e4ff;
		border-radius: 50px;
		border: 0px solid #010101;
	}
	input[type='range']::-moz-range-thumb {
		box-shadow: 1px 1px 1px #000031;
		border: 0px solid #00001e;
		height: 20px;
		width: 20px;
		border-radius: 50px;
		background: #d1e4ff;
		cursor: pointer;
	}
	input[type='range']::-ms-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
	input[type='range']::-ms-fill-lower {
		background: #d1e4ff;
		border: 0px solid #010101;
		border-radius: 100px;
		box-shadow: 0px 0px 0px #000000;
	}
	input[type='range']::-ms-fill-upper {
		background: #d1e4ff;
		border: 0px solid #010101;
		border-radius: 100px;
		box-shadow: 0px 0px 0px #000000;
	}
	input[type='range']::-ms-thumb {
		margin-top: 1px;
		box-shadow: 1px 1px 1px #000031;
		border: 0px solid #00001e;
		height: 20px;
		width: 20px;
		border-radius: 50px;
		background: #d1e4ff;
		cursor: pointer;
	}
	input[type='range']:focus::-ms-fill-lower {
		background: #d1e4ff;
	}
	input[type='range']:focus::-ms-fill-upper {
		background: #d1e4ff;
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
	hr {
		color: black;
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
