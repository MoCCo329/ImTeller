import api from './api'

const END_POINT = 'deal'

const deal = {
	register(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/register`,
			data: data,
		})
	},
	dealList(params) {
		return api({
			method: 'get',
			url: `${END_POINT}/search`, // query string
			params: params,
		})
	},
	dealDetail(dealId) {
		return api({
			method: 'get',
			url: `${END_POINT}/${dealId}`,
		})
	},
	cancelDeal(dealId) {
		return api({
			method: 'delete',
			url: `${END_POINT}/${dealId}`,
		})
	},
	bid(dealId, data) {
		return api({
			method: 'post',
			url: `${END_POINT}/${dealId}/bid`,
			data: data,
		})
	},
	cancelBid(dealId, bidId, data) {
		return api({
			method: 'delete',
			url: `${END_POINT}/${dealId}/bid/${bidId}`,
			data: data,
		})
	},
	dealEnd(dealId, data) {
		return api({
			method: 'patch',
			url: `${END_POINT}/${dealId}/complete`,
			data: data,
		})
	},
}

export default deal
