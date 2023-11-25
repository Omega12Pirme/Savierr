// SPDX-License-Identifier: Unlicensed

pragma solidity >0.7.0 <=0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    uint public requiredAmount;
 uint public receivedAmount;
     event Donation(address indexed from, string name, string message, uint256 timestamp, uint256 amount);

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    event campaignCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imgURI,
        uint indexed timestamp,
        string indexed category
    );

    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }

    Memo[] memos;
    address payable public Rowner;
    address payable public owner;

     constructor() {
       
        Rowner = payable(msg.sender);
        
    }


    

    function createCampaign(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI, 
        string memory category,
        string memory storyURI) public
    {

        Campaign newCampaign = new Campaign(
            campaignTitle, requiredCampaignAmount, imgURI, storyURI, msg.sender);
        

        deployedCampaigns.push(address(newCampaign));

        emit campaignCreated(
            campaignTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newCampaign),
            imgURI,
            block.timestamp,
            category 
        );

    }

    function donate(uint requiredAmount1 ) public payable {
        
        emit donated(msg.sender, requiredAmount1, block.timestamp);
    }



     function buyChai(string memory name, string memory message) public payable {
        require(msg.value > 0, "Please pay something greater than 0");
        Rowner.transfer(msg.value); // Will transfer donator's money to the smart contract owner
        memos.push(Memo(name, message, block.timestamp, msg.sender)); // Now we will add that donator to our donators list

        // Emit the Donation event
        emit Donation(msg.sender, name, message, block.timestamp, msg.value);
        
    }

    // You can get a list of all donators and the total holdings of funds by this function on the frontend
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function getBalance() public view returns (uint256) {
        return Rowner.balance;
    }
}


contract Campaign {
    string public title;
    uint public requiredAmount;
    string public image;
    string public story;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    constructor(
        string memory campaignTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI,
        string memory storyURI,
        address campaignOwner
    ) {
        title = campaignTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(campaignOwner);
    }

    function donate() public payable {
        require(requiredAmount > receivedAmount, "required amount fullfilled");
        owner.transfer(msg.value);
        receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}

