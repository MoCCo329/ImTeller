import api from './api'

const END_POINT = 'art'

const art = {
	cardList(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/cards`,
			data: data,
		})
	},
	paintList(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/paints`,
			data: data,
		})
	},
	createNft(data) {
		return api({
			method: 'patch',
			url: `${END_POINT}/nft`,
			data: data,
		})
	},

	paintCreate(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/paints/save`,
			data: data,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	paintUpdate(data) {
		return api({
			method: 'patch',
			url: `${END_POINT}/paints/edit`,
			data: data,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	paintDelete(paintId) {
		return api({
			method: 'delete',
			url: `${END_POINT}/paints/delete/${paintId}`,
		})
	},
	paintRegist(paintId) {
		return api({
			method: 'patch',
			url: `${END_POINT}/paints/onvote/${paintId}`,
		})
	},
	cancelRegist(paintId) {
		return api({
			method: 'patch',
			url: `${END_POINT}/paints/offvote/${paintId}`,
		})
	},
}

export default art
