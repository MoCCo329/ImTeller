//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//v.6
contract ClassicNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _cardIds;
    address admin = 0xc37d13B5523C1D80bA15DDFA5Cd3bD1AbB482aaF;

    mapping(uint256 => string) tokenURIs;

    uint256 cost = 10; //민팅비용

    IERC20 public coinContract;

    constructor() ERC721("TellerCard", "ITC") {
        coinContract = IERC20(0x0c54E456CE9E4501D2c43C38796ce3F06846C966);
    }

    /*
    신규 NFT(ERC - 721) 생성 - 민팅 비용지급
    @params: 그림 URI(_tokenURI)
    @return: 민팅된 카드id(db의 token_id)
    *warning: 함수 실행 전 coinContract. approve(cardContract, cost) 필요
    */
    function create(string memory _tokenURI) public payable returns (uint256) {
        address owner = msg.sender;
        //1. 민팅비 지급
        coinContract.transferFrom(owner, admin, cost);
        //2. 민팅
        _cardIds.increment();
        uint256 newCardId = _cardIds.current();
        _mint(owner, newCardId);
        _setTokenURI(newCardId, _tokenURI);
        return newCardId;
    }

    /*
    신규 NFT(ERC - 721) 생성 - 투표 당선작
    @params: 그림 URI(_tokenURI)
    @return: 민팅된 카드id(db의 token_id)
    */
    function mint(string memory _tokenURI) public payable returns (uint256) {
        address owner = msg.sender;
        //1. 민팅
        _cardIds.increment();
        uint256 newCardId = _cardIds.current();
        _mint(owner, newCardId);
        _setTokenURI(newCardId, _tokenURI);
        return newCardId;
    }

    function current() public view returns (uint256) {
        return Counters.current(_cardIds);
    }
}
