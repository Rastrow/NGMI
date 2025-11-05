// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Counters removed in OZ v5; use simple incremental id

/**
 * @title QuoteNFT
 * @dev ERC721 to mint quotes as NFTs with a fixed mint fee.
 */
contract QuoteNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    uint256 public constant MINT_FEE = 0.0001 ether;

    event QuoteMinted(address indexed minter, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("QuoteNFT", "QUOTE") Ownable(msg.sender) {}

    function safeMint(address to, string memory uri) public payable {
        require(msg.value == MINT_FEE, "QuoteNFT: invalid mint fee");

        uint256 newItemId = _nextTokenId++;

        _safeMint(to, newItemId);
        _setTokenURI(newItemId, uri);

        emit QuoteMinted(to, newItemId, uri);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "QuoteNFT: withdraw failed");
    }

    // Overrides required by Solidity
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


