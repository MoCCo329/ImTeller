import { css } from '@emotion/react'

import { useModal } from 'actions/hooks/useModal'
import setting from 'assets/image/setting.webp'

const Setting = () => {
	const [setModalState, setModalMsg] = useModal('')

	return (
		<div onClick={() => setModalState('setting')}>
			<img css={imgSize} src={setting} alt="setting" />
		</div>
	)
}
export default Setting

const imgSize = css`
	width: 2em;
	margin: 10px;

	&:hover {
		transform: scale(1.1, 1.1) rotate(15deg);
		transition: all ease 0.2s;
	}
`
