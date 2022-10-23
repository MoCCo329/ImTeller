import api from './api'

const END_POINT = 'rank'

const rank = {
	rankList() {
		return api({
			method: 'get',
			url: `${END_POINT}`,
		})
	},
}

export default rank
