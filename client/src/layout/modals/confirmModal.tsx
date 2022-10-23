import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setModalState, setModalMsg, setModalResult } from 'store/modules/util'

export default function ConfirmModal(props: any) {
	const dispatch = useDispatch()

	const modalMsg = useSelector((state: any) => state.modalMsg)

	useEffect(() => {
		return () => {
			dispatch(setModalMsg(''))
		}
	}, [])

	const onCancle = () => {
		dispatch(setModalResult(2))
		dispatch(setModalState(''))
	}
	const onConfirm = () => {
		dispatch(setModalResult(1))
		dispatch(setModalState(''))
	}

	return (
		<div>
			{modalMsg}
			<button onClick={onCancle}>취소</button>
			<button onClick={onConfirm}>확인</button>
		</div>
	)
}
