// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./nft.sol";  // Import your NFT contract directly

contract NFTMarketplace is ReentrancyGuard, Ownable {
    uint256 public listingFee = 10 wei;
    uint256 public listingCount;

    struct Listing {
        uint256 tokenId;
        address nftContract;
        address seller;
        uint256 price;
        bool isSold;
    }

    mapping(uint256 => Listing) public listings;

    event ItemListed(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price);
    event ItemSold(uint256 indexed listingId, address indexed buyer);
    event ListingCancelled(uint256 indexed listingId);

    constructor() Ownable(msg.sender) {

    }

    function listItem(address nftContract, uint256 tokenId, uint256 price) external payable nonReentrant {
        require(msg.value == listingFee, "Listing fee required");
        require(price > 0, "Price must be greater than 0");

        MyNFT(nftContract).transferFrom(msg.sender, address(this), tokenId);  // Use MyNFT to transfer the token
        
        
        listingCount++;
        listings[listingCount] = Listing({
            tokenId: tokenId,
            nftContract: nftContract,
            seller: msg.sender,
            price: price,
            isSold: false
        });

        emit ItemListed(listingCount, nftContract, tokenId, msg.sender, price);
    }



    function buyItem(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(!listing.isSold, "Item already sold");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.isSold = true;

        MyNFT(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);  // Use MyNFT to transfer the token
        payable(listing.seller).transfer(listing.price);

        emit ItemSold(listingId, msg.sender);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(!listing.isSold, " ");
        require(listing.seller == msg.sender, "Not your listing");

        listing.isSold = true;
        MyNFT(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);  // Use MyNFT to transfer the token

        emit ListingCancelled(listingId);
    }

    function setListingFee(uint256 newFee) external onlyOwner {
        // You can add Ownable to control this
        listingFee = newFee;
    }
}
