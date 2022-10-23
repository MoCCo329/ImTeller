import { useSelector } from 'react-redux'
import { css } from '@emotion/react'
import Layout from 'layout/layout'
import { normalBtn } from 'style/commonStyle'

export default function profileImage(props: any) {
	const currentUser = useSelector((state: any) => state.currentUser)

	const changeImage = (event) => {
		const image = event.target.files[0]

		const imageTag: any = document.querySelector('#image')
		if (image) {
			imageTag.src = URL.createObjectURL(image)
		} else {
			imageTag.src = ''
		}
	}

	const resetImage = () => {
		const imageInput: any = document.querySelector('#profileImage')
		imageInput.value = ''

		const imageTag: any = document.querySelector('#image')
		imageTag.src = currentUser.profile
	}

	const deleteImage = () => {
		const imageInput: any = document.querySelector('#profileImage')
		imageInput.value = ''

		const imageTag: any = document.querySelector('#image')
		imageTag.src = ''
	}

	return (
		<div css={centerCSS}>
			<img id="image" src={currentUser.profile} alt="" />
			<div css={centerLeftCSS}>
				<label htmlFor="profileImage">프로필 이미지 변경하기</label>
				<input
					id="profileImage"
					type="file"
					accept=".png, .jpg"
					onChange={(event) => {
						changeImage(event)
					}}
				/>
			</div>
			<div>
				<button onClick={resetImage} css={normalBtn}>
					원상복구하기
				</button>
				<button onClick={deleteImage} css={normalBtn}>
					지우기
				</button>
			</div>
		</div>
	)
}
const centerCSS = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	font-family: 'GongGothicMedium';
	#image {
		width: 300px;
		margin-top: 5vh;
		border-radius: 60%;
		margin-bottom: 10px;
	}
	input[type='file'] {
		/* display: none; */
		padding: 10px 10px;
		margin: 10px;
		box-sizing: border-box;
		border: none;
		border-radius: 12px;
		color: black;
		font-family: 'GmarketSansMedium';
		background-color: white;
	}
	label {
		margin-left: 10px;
	}
`
const centerLeftCSS = css`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
`
