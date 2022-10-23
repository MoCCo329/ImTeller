import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Layout from 'layout/layout'
import { useModal } from 'actions/hooks/useModal'
import user from 'actions/api/user'
import Loading from 'components/loading'
import { fullDisplay } from 'style/commonStyle'

export default function Signup(props: any) {
	const navigate = useNavigate()

	const [nickValid, setNickValid] = useState('')
	const [authError, setAuthError] = useState('')
	const [emailChecked, setEmailChecked] = useState(false)
	const [nickChecked, setNickChecked] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [setModalState, setModalMsg] = useModal('')

	const nickFilter = (event) => {
		setNickChecked(false)

		let nickname = event.target.value
		nickname = nickname.replace(/[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣]/g, '')
		if (nickname.length < 5) {
			setNickValid('5자 이상의 닉네임을 지어주세요')
		} else if (nickname.length > 20) {
			nickname = nickname.slice(0, 20)
		} else {
			setNickValid('')
		}
		event.target.value = nickname
	}

	const emailFilter = () => {
		setEmailChecked(false)
	}

	const checkEmail = () => {
		const email: any = document.querySelector('#email')
		if (!email.value) {
			setModalMsg('이메일을 입력해 주세요')
			setModalState('alert')
			return
		}

		const data = { email: email.value }
		user
			.checkEmail(data)
			.then((result) => {
				// console.log(result)
				if (result.data.response === '사용가능한 이메일입니다.') {
					setEmailChecked(true)
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const checkNick = () => {
		if (nickValid) {
			setModalMsg('닉네임은 5글자 이상이어야 합니다')
			setModalState('alert')
			return
		}
		const nickname: any = document.querySelector('#nickname')
		if (!nickname.value) {
			setModalMsg('닉네임을 입력해 주세요')
			setModalState('alert')
			return
		}

		const data = { nickname: nickname.value }
		user
			.checkNickname(data)
			.then((result) => {
				// console.log(result)
				if (result.data.response === '사용가능한 닉네임입니다.') {
					setNickChecked(true)
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const onSubmit = (event) => {
		event.preventDefault()
		if (isLoading) return
		setIsLoading(true)

		const email: any = document.querySelector('#email')
		const nickname: any = document.querySelector('#nickname')
		if (!emailChecked) {
			setModalMsg('이메일 중복을 체크해주세요')
			setModalState('alert')
			setIsLoading(false)
			return
		}
		if (!nickChecked) {
			setModalMsg('닉네임 중복을 체크해주세요')
			setModalState('alert')
			setIsLoading(false)
			return
		}

		const credentials = {
			email: email.value,
			nickname: nickname.value,
		}

		user
			.signup(credentials)
			.then((result) => {
				if (result.data.response === '가입 성공') {
					alert('회원가입에 성공했습니다. 이메일을 확인해 주세요')
					setIsLoading(false)
					navigate('/', { replace: true })
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.error(error)
			})
	}

	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={box}>
					<div>
						<div css={line}>
							<label css={label} htmlFor="email">
								이메일
							</label>
							<input
								css={singUpInput}
								id="email"
								type="email"
								autoFocus
								onChange={emailFilter}
								placeholder="이메일"
							/>
							<button css={checkBtn} onClick={checkEmail}>
								{' '}
								중복 체크
							</button>
							{emailChecked ? '✔' : null}
						</div>
					</div>
					<div>
						<div css={line}>
							<label css={label} htmlFor="nickname">
								닉네임
							</label>
							<input
								css={singUpInput}
								id="nickname"
								type="text"
								placeholder="닉네임 (5자 이상 입력)"
								onChange={(event) => {
									nickFilter(event)
								}}
							/>
							<button css={checkBtn} onClick={checkNick}>
								중복 체크
							</button>
							{nickChecked ? '✔' : null}
						</div>
						{nickValid}
					</div>
					<button css={Btn} onClick={onSubmit}>
						회원가입
					</button>
					{isLoading ? <Loading msg={'전송중입니다.'} /> : null}
					{authError}
				</div>
			</main>
		</Layout>
	)
}
const box = css`
	margin: auto;
	margin-top: 50px;
	border-radius: 20px;
	background-color: rgb(255, 255, 255, 0.5);
	box-shadow: 5px 5px 5px #6a679e;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 600px;
	height: 400px;
`
const singUpInput = css`
	border: none;
	border-bottom: 2px solid #d1d1d4;
	border-radius: 20px;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 100%;
	transition: 0.2s;
	margin: 10px;
`
const Btn = css`
	background: #fff;
	font-size: 14px;
	margin-top: 20px;
	padding: 10px 20px;
	border-radius: 26px;
	border: 1px solid #d4d3e8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	color: #4c489d;
	box-shadow: 0px 2px 2px #5c5696;
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	transition: 0.2s;
	margin-bottom: 30px;
`
const line = css`
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
	align-items: center;
	font-weight: bold;
`

const label = css`
	margin-right: 10px;
	width: 100px;
`
const checkBtn = css`
	background: #5c5696;
	font-size: 12px;
	padding: 10px 12px;
	border-radius: 26px;
	border: 1px solid #d4d3e8;
	text-transform: uppercase;
	display: flex;
	align-items: center;
	color: #dddce8;
	margin-left: 10px;
	width: 80px;
	box-shadow: 0px 2px 2px #d7d6e1;
`
