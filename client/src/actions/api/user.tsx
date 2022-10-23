import api from 'actions/api/api'

const END_POINT = 'user'

const user = {
	login(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/check/pw`,
			data: data,
		})
	},
	signup(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/signup`,
			data: data,
		})
	},
	currentUser() {
		return api({
			method: 'get',
			url: `${END_POINT}/currentUser`,
		})
	},
	profileEdit(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/edit`,
			data: data,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	userDetail(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/detail`,
			data: data,
		})
	},
	checkEmail(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/check/email`,
			data: data,
		})
	},
	checkNickname(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/check/nickname`,
			data: data,
		})
	},
	addWallet(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/wallet`,
			data: data,
		})
	},
	sendPassword(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/pwmail`,
			data: data,
		})
	},
}

export default user
