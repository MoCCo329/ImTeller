import api from './api'

const END_POINT = 'vote'

const vote = {
	paintList() {
		return api({
			method: 'get',
			url: `${END_POINT}/paints`,
		})
	},
	paintSubmit(artId) {
		return api({
			method: 'patch',
			url: `${END_POINT}/onVote/${artId}`,
		})
	},
	vote(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/like`,
			data: data,
		})
	},
}

export default vote
