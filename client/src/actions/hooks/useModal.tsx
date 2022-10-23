import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setModalState, setModalMsg, setModalResult } from 'store/modules/util'

export const useModal = (modalMsg = '') => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setModalMsg(modalMsg))
		dispatch(setModalResult(0))
	}, [])

	const setState = (action: any) => {
		dispatch(setModalState(action))
	}
	const setMsg = (action: any) => {
		dispatch(setModalMsg(action))
	}
	const setResult = (action: any) => {
		dispatch(setModalResult(action))
	}

	return [setState, setMsg, setResult]
}
