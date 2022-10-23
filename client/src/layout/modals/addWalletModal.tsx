import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { css } from '@emotion/react'

import user from 'actions/api/user'
import { setUserDetail } from 'store/modules/user'
import { setModalState, setModalMsg } from 'store/modules/util'

export default function AddWalletModal(props: any) {
	const navigate: any = useNavigate()
	const dispatch = useDispatch()
	const { nick } = useParams()

	const [wallet, setWallet] = useState([])
	const [error, setError] = useState('')

	window.ethereum.on('accountsChanged', (account) => {
		setWallet(account[0])
	})

	useEffect(() => {
		if (!window.ethereum) {
			setError('메타마스크 설치가 필요합니다')
			window.open('https://metamask.io/download/', '_blank')
		} else {
			setError('')
			connectWallet()
		}
	}, [window.ethereum])

	const connectWallet = async () => {
		window.ethereum.request({ method: 'eth_requestAccounts' }).then((result: any) => {
			setWallet(result[0])
		})
	}

	const onSubmit = () => {
		const result = confirm('한번 계정을 등록하면 다시 바꾸지 못합니다. 등록하시겠습니까?')
		if (!result) return
		setError('')

		user
			.addWallet({ email: localStorage.getItem('email'), wallet })
			.then((result) => {
				// console.log(result)
				if (result.data.response === '지갑 주소를 등록했습니다.') {
					dispatch(setModalMsg(result.data.response))
					dispatch(setModalState('alert'))
				}
			})
			.catch((error) => {
				console.error(error)
				setError(error.data)
			})
	}

	return (
		<div css={addWalletModalCSS}>
			<div className="openModal modal">
				<section>
					<header>지갑 주소 연결하기</header>
					<main>
						{error}
						<label htmlFor="wallet">현재 지갑주소</label>
						<input id="wallet" type="text" value={wallet} disabled placeholder="현재 지갑주소" />
						<div>다른 계정으로 변경하려면 MetaMask에서 계정을 변경해 주세요.</div>
					</main>
					<footer>
						<button onClick={onSubmit}>등록</button>
						<button
							onClick={() => {
								dispatch(setModalState(''))
							}}
						>
							취소
						</button>
					</footer>
				</section>
			</div>
		</div>
	)
}
const addWalletModalCSS = css`
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
		max-width: 550px;
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
		align-items: center;
	}
	input {
		font-family: 'GmarketSansMedium';
		border-radius: 50px;
		border-color: #c9c9c9;
		padding: 8px;
		margin: 3px 10px 10px 10px;
		width: 90%;
	}
	select {
		font-family: 'GmarketSansMedium';
		border-radius: 50px;
		border-color: #c9c9c9;
		padding: 8px;
		margin: 0px 10px 0px 10px;
	}
	.options {
		margin: 20px 20px 3px 20px;
		display: flex;
		justify-content: space-between;
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
