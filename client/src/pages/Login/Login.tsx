import { css } from '@emotion/react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Layout from 'layout/layout'
import Loading from 'components/loading'
import { useModal } from 'actions/hooks/useModal'
import user from 'actions/api/user'
import { setEmail } from 'store/modules/user'
import { setCurrentUser } from 'store/modules/user'
import { fullDisplay } from 'style/commonStyle'

export default function Login(props: any) {
	const navigate: any = useNavigate()
	const dispatch = useDispatch()

	const [authError, setAuthError] = useState('')
	const [pwFind, setPwFind] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [setModalState, setModalMsg] = useModal()

	const passwordFilter = (event) => {
		const { value } = event.target
		const filtered = value.replace(/[^0-9a-zA-Z~!@#$%^&*()=|+]/g, '')
		event.target.value = filtered.slice(0, 30)
	}

	const onSubmit = () => {
		setAuthError('')
		const email: any = document.querySelector('#email')
		const password: any = document.querySelector('#password')

		if (!email.value) {
			setModalMsg('이메일을 입력해주세요')
			setModalState('alert')
			return
		}
		if (!password.value) {
			setModalMsg('비밀번호를 입력해주세요')
			setModalState('alert')
			return
		}
		const credentials = {
			email: email.value,
			password: password.value,
		}
		// console.log('실행됨')
		// console.log(credentials)
		user
			.login(credentials)
			.then((result) => {
				if (result.data.response == '올바른 비밀번호입니다.') {
					localStorage.setItem('email', credentials.email)
					dispatch(setEmail(credentials.email))
					user
						.currentUser()
						.then((result) => {
							// console.log(result.data)
							dispatch(setCurrentUser(result.data.response))
							navigate(-1, { replace: true })
						})
						.catch((error) => {
							console.error(error)
						})
				}
			})
			.catch((error) => {
				setAuthError('잘못된 아이디 혹은 비밀번호입니다.')
				console.error(error)
			})
	}

	const sendEmail = () => {
		if (isLoading) return
		const email: any = document.querySelector('#email')

		if (!email.value) {
			setModalMsg('이메일을 입력해주세요')
			setModalState('alert')
			return
		}
		setIsLoading(true)
		const credentials = {
			email: email.value,
		}

		user
			.sendPassword(credentials)
			.then((result) => {
				if (result.data.response == '비밀번호 변경 메일을 전송했습니다.') {
					setModalMsg('이메일 주소로 비밀번호 변경 메일을 전송했습니다. ')
					setModalState('alert')
					setPwFind(false)
				}
				setIsLoading(false)
			})
			.catch((error) => {
				console.error(error)
				setAuthError(error.data)
				setIsLoading(false)
			})
	}

	return (
		<Layout>
			<main css={fullDisplay}>
				<div css={box}>
					<div css={line}>
						<img css={img} src="https://cdn-icons-png.flaticon.com/512/546/546394.png" />
						<input
							css={loginInput}
							type="text"
							id="email"
							autoFocus
							placeholder="이메일를 입력해주세요"
						/>
					</div>
					{pwFind ? (
						<>
							<button css={btn} onClick={sendEmail}>
								임시 비밀번호 전송
							</button>
							{isLoading ? <Loading msg={'전송중입니다.'} /> : null}
						</>
					) : (
						<>
							<div>
								<div css={line}>
									<img css={img} src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" />
									<input
										css={loginInput}
										type="password"
										id="password"
										placeholder="비밀번호를 입력해주세요"
										onChange={(e) => {
											passwordFilter(e)
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter') onSubmit()
										}}
									/>{' '}
								</div>
								{authError ? <p>{authError}</p> : null}
							</div>

							<button css={loginBtn} onClick={onSubmit}>
								로그인
							</button>
						</>
					)}
					{/* <button onClick={() => navigate(-1, { replace: true })}>뒤로가기</button> */}
					<div
						onClick={() => {
							setPwFind(!pwFind)
						}}
					>
						{pwFind ? <button css={loginBtn}>로그인</button> : '비밀번호찾기'}
					</div>
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

const line = css`
	display: flex;
	flex-direction: row;
	align-items: center;
`
const img = css`
	height: 25px;
`

const loginInput = css`
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
const loginBtn = css`
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

const btn = css`
	background: #5c5696;
	font-size: 14px;
	margin-top: 20px;
	padding: 10px 20px;
	border-radius: 26px;
	border: 1px solid #d4d3e8;
	text-transform: uppercase;
	font-weight: 700;
	display: flex;
	align-items: center;
	color: #dddce8;
	box-shadow: 0px 2px 2px #d7d6e1;
`
