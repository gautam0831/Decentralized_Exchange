//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./token.sol";
import "hardhat/console.sol";

contract TokenExchange is Ownable {
    string public exchange_name = "GOOT_EXCH";

    // paste token contract address here
    address private tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    Token public token = Token(tokenAddr);

    // Liquidity pool for the exchange
    uint private token_reserves = 0;
    uint private eth_reserves = 0;
    uint private eth_lps = 0;

    mapping(address => uint) private lps;

    // Needed for looping through the keys of the lps mapping
    address[] private lp_providers;

    // liquidity rewards
    uint private swap_fee_numerator = 3; // TODO Part 5: Set liquidity providers' returns.
    uint private swap_fee_denominator = 100;

    // Constant: x * y = k
    uint private k;
    uint private decimalBase = 1000;

    constructor() {}

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    function createPool(uint amountTokens) external payable onlyOwner {
        // This function is already implemented for you; no changes needed.

        // require pool does not yet exist:
        require(token_reserves == 0, "Token reserves was not 0");
        require(eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require(msg.value > 0, "Need eth to create pool.");
        uint tokenSupply = token.balanceOf(msg.sender);
        require(
            amountTokens <= tokenSupply,
            "Not have enough tokens to create the pool"
        );
        require(amountTokens > 0, "Need tokens to create pool.");
        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves = token.balanceOf(address(this));
        eth_reserves = msg.value;
        k = token_reserves * eth_reserves;
    }

    // Function removeLP: removes a liquidity provider from the list.
    // This function also removes the gap left over from simply running "delete".
    function removeLP(uint index) private {
        require(
            index < lp_providers.length,
            "specified index is larger than the number of lps"
        );
        lp_providers[index] = lp_providers[lp_providers.length - 1];
        lp_providers.pop();
    }

    // Function getSwapFee: Returns the current swap fee ratio to the client.
    function getSwapFee() public view returns (uint, uint) {
        return (swap_fee_numerator, swap_fee_denominator);
    }

    /* ========================= Liquidity Provider Functions =========================  */

    // Function addLiquidity: Adds liquidity given a supply of ETH (sent to the contract as msg.value).
    // You can change the inputs, or the scope of your function, as needed.
    function addLiquidity(
        uint max_exchange_rate,
        uint min_exchange_rate
    ) external payable {
       
        uint exchange_rate = decimalBase * token_reserves / eth_reserves;
        
        require(
            exchange_rate < max_exchange_rate,
            "Exchange rate must be below max_exchange_rate"
        );
        require(
            exchange_rate >  min_exchange_rate,
            "Exchange rate must be higher than min_exchange_rate"
        );
       
        uint amountTokens = msg.value * exchange_rate / decimalBase;
        
        require(token.balanceOf(msg.sender) > amountTokens, "Insufficient token funds.");
        token.transferFrom(msg.sender, address(this), amountTokens);

        bool userKnown = false;
        uint old_eth_lps = eth_lps;
        eth_lps += msg.value;
        for (uint i = 0; i < lp_providers.length; i++) {
            address addr = lp_providers[i];
            uint eth_curr = (old_eth_lps * lps[addr]) / decimalBase; //Total amount of eth given by addr
            if (addr == msg.sender) {
                eth_curr += msg.value;
                userKnown = true;
            }
            lps[addr] = (eth_curr * decimalBase) / eth_lps;
        }
        if (!userKnown) {
            lp_providers.push(msg.sender);
            lps[msg.sender] = (msg.value * decimalBase) / eth_lps;
        }
        token_reserves = token.balanceOf(address(this));
        eth_reserves = address(this).balance;
        k = token_reserves * eth_reserves;
    }

    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(
        uint amountETH,
        uint max_exchange_rate,
        uint min_exchange_rate
    ) public payable {
       
        require(amountETH < eth_reserves, "Not enough ETH"); 
        uint exchange_rate = (decimalBase * token_reserves) / eth_reserves;
        require(
            exchange_rate < max_exchange_rate,
            "Exchange rate must be below max_exchange_rate"
        );
        require(
            min_exchange_rate < exchange_rate,
            "Exchange rate must be higher than min_exchange_rate"
        );

        uint amountTokens = amountETH * exchange_rate / decimalBase;
        require((lps[msg.sender] * eth_lps) / decimalBase >= amountETH, "Not enough ether for you");
        
        require(amountTokens < token_reserves && amountTokens > 0, "not enough token");
        
        uint old_eth_lps = eth_lps;
        eth_lps -= amountETH;
        for (uint i = 0; i < lp_providers.length; i++) {
            address addr = lp_providers[i];
            uint eth_curr = (old_eth_lps * lps[addr]) / decimalBase; //Total amount of eth given by addr
            
            if (addr == msg.sender) {
                eth_curr -= amountETH;
                token.transfer(msg.sender, amountTokens);
                payable(msg.sender).transfer(amountETH); 
            }
            if (eth_lps == 0){
                lps[addr] = 0;    
            } else {
                lps[addr] = (eth_curr * decimalBase) / eth_lps;
            }
        }
        token_reserves = token.balanceOf(address(this)); 
        eth_reserves = address(this).balance;
        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity(
        uint max_exchange_rate,
        uint min_exchange_rate
    ) external payable {
        
        removeLiquidity(
            (lps[msg.sender] * eth_lps) / decimalBase,
            max_exchange_rate,
            min_exchange_rate
        );
        for (uint i=0; i<lp_providers.length; i++) {
            if (lp_providers[i] == msg.sender) {
                removeLP(i);
            }
        }
        k = token_reserves * eth_reserves;
    }

    

    /* ========================= Swap Functions =========================  */

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(
        uint amountTokens,
        uint max_exchange_rate
    ) external payable {
        
        uint reducedAmt = (amountTokens * (swap_fee_denominator - swap_fee_numerator)) / 100;
        require(token.balanceOf(msg.sender) > amountTokens);

        require((eth_reserves * decimalBase) / token_reserves < max_exchange_rate, "max exchange rate reached");
        uint eth_amount = eth_reserves -  k / (token_reserves + reducedAmt);

        require(eth_amount < eth_reserves, "Not enough liquidity"); 
        payable(msg.sender).transfer(eth_amount);
        eth_reserves -= eth_amount;

        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves += amountTokens;
    }

    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens(uint max_exchange_rate) external payable {
        uint reducedAmt = (msg.value * (swap_fee_denominator - swap_fee_numerator)) / 100;
        uint token_amount = token_reserves -  k / (eth_reserves + reducedAmt);  
        require((token_reserves * decimalBase)/eth_reserves < max_exchange_rate, "max exchange rate reached");
        
        require(token_amount < token_reserves, "Not enough Liquidity"); 
        token.transfer(msg.sender, token_amount);
        eth_reserves += msg.value;
        token_reserves -= token_amount;
    }
}
