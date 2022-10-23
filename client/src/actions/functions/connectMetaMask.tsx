export default function connectMetaMask() {
	if (!window.ethereum) {
		window.open('https://metamask.io/download.html')
		return false
	}
	return new Promise((resolve, reject) => {
		window.ethereum
			.request({ method: 'eth_requestAccounts' })
			.then((result: any) => {
				resolve(result[0])
			})
			.catch((error) => reject(error))
	})
}
