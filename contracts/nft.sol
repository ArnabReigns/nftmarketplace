// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCount;
    uint256 public mintFee = 1 wei;

    mapping(uint256 => address) public creatorOf;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        
    }

    function mint(string memory _tokenURI) external payable {
        console.log(msg.value);
        require(msg.value >= mintFee, "Insufficient mint fee");

        tokenCount++;
        uint256 tokenId = tokenCount;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        creatorOf[tokenId] = msg.sender;
    }

    function setMintFee(uint256 _fee) external onlyOwner {
        mintFee = _fee;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
