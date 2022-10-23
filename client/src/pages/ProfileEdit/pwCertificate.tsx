/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import user from 'actions/api/user'
import { useModal } from 'actions/hooks/useModal'
import { fullDisplay, normalBtn } from 'style/commonStyle'

export default function PwCertificate(props: any) {
	const email = localStorage.getItem('email')

	const checkPw = () => {
		const passwordTag: any = document.querySelector('#password')
		// const [setModalState, setModalMsg] = useModal('')
		const password = passwordTag.value
		const credentials = {
			email,
			password,
		}
		// console.log(credentials)

		user
			.login(credentials)
			.then((result) => {
				// console.log(result)
				if (result.data.response === '올바른 비밀번호입니다.') {
					props.setPassword(password)
				}
			})
			.catch((error) => {
				// setModalMsg('잘못된 비밀번호입니다')
				// setModalState('alert')
				alert('잘못된 비밀번호입니다')
				console.error(error)
			})
	}

	return (
		<div css={fullDisplay}>
			<div css={box}>
				<label htmlFor="email"></label>
				<input css={input} type="email" value={email} disabled />
				<label htmlFor="password"></label>
				<input
					css={input}
					id="password"
					type="password"
					placeholder="비밀번호를 입력해주세요"
					onKeyDown={(e) => {
						if (e.key === 'Enter') checkPw()
					}}
				/>
				<button css={normalBtn} onClick={checkPw}>
					비밀번호 확인
				</button>
			</div>
		</div>
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
const input = css`
	border: none;
	border-bottom: 2px solid #d1d1d4;
	border-radius: 20px;
	background: none;
	padding: 10px;
	padding-left: 24px;
	font-weight: 700;
	width: 70%;
	transition: 0.2s;
	margin-bottom: 30px;
`
