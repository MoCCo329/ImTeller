import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/react'

import Profile from 'components/profile'
import Setting from 'components/setting'

import { setCurrentUser, setEmail, setLogout } from 'store/modules/user'
import user from 'actions/api/user'

import { textBtn } from 'style/commonStyle'

export default function Header() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const currentUser = useSelector((state: any) => state.currentUser)
	const mainTab = useSelector((state: any) => state.mainTab)

	const logout = () => {
		dispatch(setLogout())
		dispatch(setEmail(''))
		localStorage.setItem('email', '')
	}

	useEffect(() => {
		user
			.currentUser()
			.then((result) => {
				dispatch(setCurrentUser(result.data.response))
			})
			.catch((error) => {
				console.error(error)
			})
		let email = localStorage.getItem('email')
		if (email) {
			dispatch(setEmail(email))
		}
	}, [])

	return (
		<div css={headerCss}>
			<div css={logoTitleContainer}>
				{/* <img src={logo} alt="로고" css={logoIconCss} /> */}
				<div css={logoTitleCss} onClick={() => navigate('/')}>
					ImTeller
				</div>
			</div>
			<div css={navBarCss(mainTab)}>
				<div className="game" onClick={() => navigate('/game')} css={textBtn}>
					게임
					<div className="game-underline" />
				</div>
				<div className="deal" onClick={() => navigate('/deal')} css={textBtn}>
					거래소
					<div className="deal-underline" />
				</div>
				<div className="vote" onClick={() => navigate('/vote')} css={textBtn}>
					출품
					<div className="vote-underline" />
				</div>
				<div className="rank" onClick={() => navigate('/rank')} css={textBtn}>
					랭킹
					<div className="rank-underline" />
				</div>
				<div className="faq" onClick={() => navigate('/faq')} css={textBtn}>
					FAQ
					<div className="faq-underline" />
				</div>
				{currentUser.nickname ? (
					<div css={loginCss}>
						<Profile nickname={currentUser.nickname} profile={currentUser.profile} />
						<div className="logout" onClick={logout} css={textBtn}>
							로그아웃
						</div>
					</div>
				) : (
					<div css={loginCss}>
						<div className="login" onClick={() => navigate('/login')} css={loginBtnCss}>
							로그인
						</div>
						<div className="signup" onClick={() => navigate('/signup')} css={loginBtnCss}>
							회원가입
						</div>
					</div>
				)}
				<Setting />
			</div>
		</div>
	)
}
const headerCss = css({
	display: 'flex',
	color: 'white',
	alignItems: 'center',
	fontFamily: 'LeferiBaseType-RegularA',
	justifyContent: 'space-between',
	height: '95px',
	textAlign: 'center',
})

const navBarCss = (mainTab: String) => css`
	display: flex;
	width: 800px;
	height: 95px;
	margin-right: 20px;
	justify-content: space-between;
	align-items: center;

	.game {
		position: relative;
		color: ${mainTab === 'game' || mainTab === '' ? 'white' : 'gray'};

		.game-underline {
			${mainTab === 'game' &&
			'position:absolute; height: 3px; width: 150%; background-color: #ffffff; left:50%; transform: translateX(-50%); '};
		}
	}

	.game:hover {
		transform: scale(1.1, 1.1) rotate(10deg);
		transition: all ease 0.2s;
	}

	.deal {
		position: relative;
		color: ${mainTab === 'deal' || mainTab === '' ? 'white' : 'gray'};
		.deal-underline {
			${mainTab === 'deal' &&
			'position:absolute; height: 3px; width: 150%; background-color: #ffffff; left:50%; transform: translateX(-50%); '};
		}
	}

	.deal:hover {
		transform: scale(1.1, 1.1) rotate(10deg);
		transition: all ease 0.2s;
	}

	.vote {
		position: relative;
		color: ${mainTab === 'vote' || mainTab === '' ? 'white' : 'gray'};
		.vote-underline {
			${mainTab === 'vote' &&
			'position:absolute; height: 3px; width: 150%; background-color: #ffffff; left:50%; transform: translateX(-50%); '};
		}
	}

	.vote:hover {
		transform: scale(1.1, 1.1) rotate(10deg);
		transition: all ease 0.2s;
	}

	.rank {
		position: relative;
		color: ${mainTab === 'rank' || mainTab === '' ? 'white' : 'gray'};
		.rank-underline {
			${mainTab === 'rank' &&
			'position:absolute; height: 3px; width: 150%; background-color: #ffffff; left:50%; transform: translateX(-50%); '};
		}
	}

	.rank:hover {
		transform: scale(1.1, 1.1) rotate(10deg);
		transition: all ease 0.2s;
	}

	.faq {
		position: relative;
		color: ${mainTab === 'faq' || mainTab === '' ? 'white' : 'gray'};
		.faq-underline {
			${mainTab === 'faq' &&
			'position:absolute; height: 3px; width: 150%; background-color: #ffffff; left:50%; transform: translateX(-50%); '};
		}
	}

	.faq:hover {
		transform: scale(1.1, 1.1) rotate(10deg);
		transition: all ease 0.2s;
	}
`
const loginCss = css`
	display: flex;
	align-items: center;
	margin-right: 20px;

	.login {
		margin-right: 20px;
	}

	.logout:hover,
	.login:hover,
	.signup:hover {
		transform: scale(1.1, 1.1) rotate(-5deg);
		transition: all ease 0.2s;
	}
`

const loginBtnCss = css({
	margin: 5,
	cursor: "url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto",
})
const logoTitleCss = css`
	line-height: 85px;
	top: 50%;
	margin-top: 10px;
	margin-left: 40px;
	cursor: url('https://imtellercard.s3.ap-northeast-2.amazonaws.com/brushClick.png'), auto;
	font-family: Yeongdo-Rg;
	font-size: 36px;

	&:hover {
		transform: rotate(-10deg);
		transition: all ease-in-out 0.5s;
	}

	&:active {
		color: gray;
		transition: all ease-in-out 0.05s;
	}
`

const logoTitleContainer = css`
	height: 100%;
`
