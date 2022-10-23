import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function BgmLayer(props: any) {
	const bgm: any = useRef()
	const effect: any = useRef()

	const bgmSrc = useSelector((state: any) => state.bgmSrc)
	const bgmVolume = useSelector((state: any) => state.bgmVolume)
	const isBgmOn = useSelector((state: any) => state.isBgmOn)

	const effectSrc = useSelector((state: any) => state.effectSrc)
	const effectVolume = useSelector((state: any) => state.effectVolume)
	const isEffectOn = useSelector((state: any) => state.isEffectOn)

	const isMouseEffectOn = useSelector((state: any) => state.isMouseEffectOn)

	useEffect(() => {
		if (isBgmOn) {
			bgm.current.load()
		} else {
			bgm.current.pause()
		}
	}, [isBgmOn])

	useEffect(() => {
		bgm.current.volume = bgmVolume / 100
	}, [bgmVolume])

	useEffect(() => {
		bgm.current.src = bgmSrc
	}, [bgmSrc])

	useEffect(() => {
		if (isEffectOn) {
			effect.current.load()
		} else {
			effect.current.pause()
		}
	}, [isEffectOn])

	useEffect(() => {
		effect.current.volume = effectVolume / 100
	}, [effectVolume])

	useEffect(() => {
		effect.current.src = effectSrc
	}, [effectSrc])

	useEffect(() => {
		setTimeout(() => {
			bgm.current.load()
		}, 3000)
		return () => {
			if (bgm.current) {
				bgm.current.pause()
			}
			if (effect.current) {
				effect.current.pause()
			}
		}
	}, [])

	const clickSound = () => {
		if (!isMouseEffectOn) return
		const audio = new Audio('assets/audio/click.wav')
		audio.play()
	}

	return (
		<div onClick={clickSound}>
			{props.children}
			<audio ref={bgm} autoPlay loop></audio>
			<audio ref={effect} autoPlay></audio>
		</div>
	)
}
