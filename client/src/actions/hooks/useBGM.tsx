import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBgmSrc } from 'store/modules/util'

export const useBGM = (src: any) => {
	const dispatch = useDispatch()

	const isBgmOn = useSelector((state: any) => state.isBgmOn)

	const bgm = {
		main: 'assets/audio/main.mp3',
		gameList: 'assets/audio/gameList.mp3',
		game: 'assets/audio/game.mp3',
		result: 'assets/audio/result.mp3',
	}

	useEffect(() => {
		if (src && isBgmOn) {
			dispatch(setBgmSrc(bgm[src]))
		}
		return () => {
			dispatch(setBgmSrc(''))
		}
	}, [])
}
