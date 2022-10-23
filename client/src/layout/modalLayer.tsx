import { useSelector } from 'react-redux'
import styled from '@emotion/styled'

import AddWalletModal from 'layout/modals/addWalletModal'
import MakeRoomModal from 'layout/modals/makeRoomModal'
import JoinRoomModal from 'layout/modals/joinRoomModal'
import CardSelectModal from 'layout/modals/cardSelectModal'
import AlertModal from 'layout/modals/alertModal'
import ConfirmModal from 'layout/modals/confirmModal'
import SettingModal from 'layout/modals/settingModal'
import DealRegisterModal from 'layout/modals/dealRegisterModal'
import VoteRegisterModal from 'layout/modals/voteRegisterModal'
import VoteModal from 'layout/modals/vote'

export default function ModalLayer(props: any) {
	const modalState = useSelector((state: any) => state.modalState)

	const Modals = {
		addWallet: <AddWalletModal />,
		makeRoom: <MakeRoomModal />,
		cardSelect: <CardSelectModal />,
		alert: <AlertModal />,
		confirm: <ConfirmModal />,
		joinRoom: <JoinRoomModal />,
		setting: <SettingModal />,
		dealRegister: <DealRegisterModal />,
		voteRegister: <VoteRegisterModal />,
		vote: <VoteModal />,
	}

	return (
		<div>
			{props.children}
			{modalState ? <ModalST>{Modals[modalState]}</ModalST> : null}
		</div>
	)
}

const ModalST = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.6);
`
