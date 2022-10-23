import { coinContract } from './CoinABI'
import { cardAddress, cardContract } from './CardABI'
import { web3, marketContract } from './MarketABI'
import dealABI from './DealABI'

/**
 * 그림을 카드로 민팅 - 유료민팅
 * @params
 * - walletAddress (string)현재 로그인된 유저의 지갑주소
 * - image (string) 민팅할 그림의 s3 url
 * @returns: (int) 민팅된 카드의 token_id (!=art_id)
 */
export const createCard = async (walletAddress: string, image: any) => {
	const wallet = walletAddress
	const tokenURI = image
	/*
	approve(address A, uint amount)
	A가 msg.sender의 지갑에서 SSF를 amount 만큼 옮기는걸 허가
	*/
	const approvalToPay = await coinContract.methods.approve(cardAddress, 10).send({ from: wallet })
	console.log(approvalToPay)

	let tokenId: any //uint256 민팅된 카드의 id(블록체인에서의 index)
	if (approvalToPay.status) {
		tokenId = await cardContract.methods.create(tokenURI).send({ from: wallet })
	}
	console.log(tokenId)
	return tokenId.events.Transfer.returnValues.tokenId
}

/**
 * 그림을 카드로 민팅 - 투표 당선작 무료로 민팅
 * @params
 * - walletAddress (string)현재 로그인된 유저의 지갑주소
 * - image (string) 민팅할 그림의 s3 url
 * @returns: (int) 민팅된 카드의 token_id (!=art_id)
 */
export const mintCard = async (walletAddress: string, image: any) => {
	const wallet = walletAddress
	const tokenURI = image
	console.log('민팅을 시작한다! 무려 무료로!')
	let tokenId = await cardContract.methods.mint(tokenURI).send({ from: wallet })
	console.log(tokenId)
	return tokenId.events.Transfer.returnValues.tokenId
}

/*
신규 거래 등록
@params:
- walletAddress (string) 현재 로그인된 유저의 지갑주소
- tokenId (int)현재 로그인된 유저의 지갑주소
- wantedPrice (int) 민팅할 그림의 s3 url
@returns: (string) 거래주소
 */
export const sellCard = async (walletAddress: string, tokenId: any, instantPrice: any) => {
	const wallet = walletAddress
	const cardId = tokenId
	const price = instantPrice
	console.log('거래 등록 ' + tokenId)
	const dealCA = await marketContract.methods.createDeal(cardId, price).send({ from: wallet })
	console.log('deal', dealCA)
	const contractId = dealCA.events.NewDeal.returnValues.dealAddress
	/*
	setApprovalForAll(address A, true)
	A가 msg.sender의 NFT들을 거래할 수 있게 권한 허용
	*/
	await cardContract.methods.setApprovalForAll(contractId, true).send({ from: wallet })
	return contractId
}

/*
카드 구매하기
@params:
- walletAddress (string) 현재 로그인된 유저의 지갑주소
- dealAddress (string) 내가 선택한 거래의 주소(블록체인상에서의 주소)
- instantPrice (int) 즉시구매가
@returns: (string) 거래주소
 */
export const purchaseCard = async (walletAddress: any, dealAddress: any, instantPrice: any) => {
	const dealCA = dealAddress
	const wallet = walletAddress
	const price = instantPrice
	const dealInstance = new web3.eth.Contract(dealABI, dealCA)
	console.log('구매 시작 market purchase')
	/*
	approve(address A, uint amount)
	A가 msg.sender의 지갑에서 SSF를 amount 만큼 옮기는걸 허가
	*/
	const approvalToPay = await coinContract.methods.approve(dealCA, price).send({ from: wallet })
	if (approvalToPay.status) {
		return await dealInstance.methods.purchase().send({ from: wallet })
	}
}

/*
판매 취소하기
@params:
- walletAddress (string) 현재 로그인된 유저의 지갑주소
- dealAddress (string) 내가 선택한 거래의 주소(블록체인상에서의 주소)
warning: 판매자만 취소 가능.
 */
export const cancelDeal = async (walletAddress: any, dealId: any) => {
	const wallet = walletAddress
	const dealCA = dealId
	const dealInstance = new web3.eth.Contract(dealABI, dealCA)
	/*
	setApprovalForAll(address A, false)
	A가 msg.sender의 NFT들을 거래할 수 있게 권한 취소
	*/
	console.log('취소 시작')
	const disapproval = await cardContract.methods
		.setApprovalForAll(dealCA, false)
		.send({ from: wallet })
	return await dealInstance.methods.cancelDeal().send({ from: wallet })
}
