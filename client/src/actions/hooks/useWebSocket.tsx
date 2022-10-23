import { useEffect, useState } from 'react'
import * as Stomp from '@stomp/stompjs'
import Sockjs from 'sockjs-client'

export const useWebSocket = (params: any) => {
	const stompClient = new Stomp.Client({
		connectHeaders: { Authorization: params.email },
		reconnectDelay: params.reconnectDelay ? params.reconnectDelay : 5000,
		logRawCommunication: false,
	})
	stompClient.webSocketFactory = () => new Sockjs(`https://j7a509.p.ssafy.io:8080/api/v1/socket`)

	return stompClient
}