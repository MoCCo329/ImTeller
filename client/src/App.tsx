import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Main from 'pages/Main/Main'
import Mypage from 'pages/Mypage/Mypage'
import Signup from 'pages/Signup/Signup'
import ProfileEdit from 'pages/ProfileEdit/ProfileEdit'
import Login from 'pages/Login/Login'
import Paint from 'pages/Paint/Paint'
import GameList from 'pages/GameList/GameList'
import Game from 'pages/Game/Game'
import DealList from 'pages/DealList/DealList'
import DealDetail from 'pages/DealDetail/DealDetail'
import DealRegister from 'pages/DealRegister/DealRegister'
import Rank from 'pages/Rank/Rank'
import Vote from 'pages/Vote/Vote'
import FAQ from 'pages/FAQ/FAQ'
import NotFound404 from 'pages/NotFound404/NotFound404'

import BgmLayer from 'layout/bgmLayer'
import ModalLayer from 'layout/modalLayer'

import 'style/fonts.css'

export default function App() {
	const currentUser = useSelector((state: any) => state.currentUser)

	return (
		<div>
			<BrowserRouter>
				<BgmLayer>
					<ModalLayer>
						<Routes>
							<Route path="/" element={<Main />} />
							<Route path="/mypage/:nick" element={<Mypage />} />

							<Route path="/game" element={<GameList />} />
							<Route path="/deal" element={<DealList />} />
							<Route path="/deal/:dealId" element={<DealDetail />} />
							<Route path="/rank" element={<Rank />} />
							<Route path="/vote" element={<Vote />} />
							<Route path="/faq" element={<FAQ />} />
							{currentUser.nickname ? (
								<>
									<Route path="/profileEdit" element={<ProfileEdit />} />
									<Route path="/game/:roomId" element={<Game />} />
									<Route path="/deal/register" element={<DealRegister />} />
									<Route path="/paint" element={<Paint />} />
								</>
							) : (
								<>
									<Route path="/login" element={<Login />} />
									<Route path="/signup" element={<Signup />} />
								</>
							)}
							<Route path="/*" element={<NotFound404 />} />
						</Routes>
					</ModalLayer>
				</BgmLayer>
			</BrowserRouter>
		</div>
	)
}
