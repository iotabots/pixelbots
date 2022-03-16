// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PIXELBOTS is ERC721Enumerable, Ownable {
    // PIXELBOTS battle start
    uint256 attackFee = 0.0 ether;

    uint256 randNonce = 0;
    uint256 attackVictoryProbability = 75;
    mapping(uint256 => uint256) public winCount;
    mapping(uint256 => uint256) public lossCount;

    function randMod(uint256 _modulus) internal returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function attack(uint256 _botId) external payable {
        require(ownerOf(_botId) == msg.sender, "You don't own that bot!");
        require(msg.value == attackFee);
        // Choose a random bot opponent
        uint256 targetId = randMod(500);
        // botId may not be the targetId
        while (targetId == _botId) {
            targetId = randMod(500);
        }
        // The random win number - like roll a dice
        uint256 rand = randMod(100);
        if (rand <= attackVictoryProbability) {
            winCount[_botId]++;
            lossCount[targetId]++;
        } else {
            winCount[targetId]++;
            lossCount[_botId]++;
        }
    }

    struct LeaderboardEntry {
        uint256 id;
        uint256 wins;
        uint256 losses;
    }

    function getLeaderboard()
        external
        view
        returns (uint[] memory, uint[] memory)
    {
        uint[] memory id = new uint[](500);
        uint[] memory wins = new uint[](500);
        uint count = 0;
        for (uint i = 1; i <= maxSupply; i++) {
            if (winCount[i] > 0) {
                wins[count] = winCount[i];
                id[count] = i;
            }
            count++;
        }

        return (id, wins);
    }

    // PIXELBOTS battle end

    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0 ether;
    uint256 public maxSupply = 500;
    uint256 public maxMintAmount = 5;
    bool public paused = false;
    mapping(address => bool) public whitelisted;

    // Keeps track of a airdrop has been made to a particular address
    //   mapping (address => bool) public airdrops;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        // require(balanceOf(_to) == 0, 'Each address may only own one nft');

        if (msg.sender != owner()) {
            if (whitelisted[msg.sender] != true) {
                require(msg.value >= cost * _mintAmount);
            }
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function whitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = true;
    }

    function removeWhitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = false;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
}
