import api from './api'

const END_POINT = 'game'

const game = {
	roomList() {
		return api({
			method: 'get',
			url: `${END_POINT}/rooms`,
		})
	},
	join(roomId, data) {
		return api({
			method: 'post',
			url: `${END_POINT}/rooms/${roomId}/join`,
			data: data,
		})
	},
	make(data) {
		return api({
			method: 'post',
			url: `${END_POINT}/make`,
			data: data,
		})
	},
}

export default game
