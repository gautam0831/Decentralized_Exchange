// =================== CS251 DEX Project =================== // 

// Set up Ethers.js
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

const exchange_name = 'GOOT_EXCH';            

const token_name = 'goot_token';                
const token_symbol = 'GOOT';              
const decimalBase = 1000;

// =============================================================================
//                          ABIs
// =============================================================================

const token_address = '0x5fbdb2315678afecb367f032d93f642f64180aa3';      
const token_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disable_mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const token_contract = new ethers.Contract(token_address, token_abi, provider.getSigner());

const exchange_address = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';
const exchange_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "max_exchange_rate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "min_exchange_rate",
        "type": "uint256"
      }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      }
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchange_name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSwapFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "max_exchange_rate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "min_exchange_rate",
        "type": "uint256"
      }
    ],
    "name": "removeAllLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max_exchange_rate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "min_exchange_rate",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "max_exchange_rate",
        "type": "uint256"
      }
    ],
    "name": "swapETHForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max_exchange_rate",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract Token",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];               
const exchange_contract = new ethers.Contract(exchange_address, exchange_abi, provider.getSigner());



/*** INIT ***/
async function init() {
    var poolState = await getPoolState();
    console.log("starting init");
    if (poolState['token_liquidity'] === 0
            && poolState['eth_liquidity'] === 0) {
      // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
      const total_supply = 100000;
      
      await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
      await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
      await token_contract.connect(provider.getSigner(defaultAccount)).disable_mint();
      await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, total_supply);
      // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
      await exchange_contract.connect(provider.getSigner(defaultAccount)).createPool(5000, { value: ethers.utils.parseUnits("5000", "wei")});
      console.log("init finished");

       // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
    }
}

async function getPoolState() {
    // read pool balance for each type of liquidity:
    let liquidity_tokens = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(exchange_address);
    let liquidity_eth = await provider.getBalance(exchange_address);
    return {
        token_liquidity: Number(liquidity_tokens),
        eth_liquidity: Number(liquidity_eth),
        token_eth_rate: Number(liquidity_tokens) / Number(liquidity_eth),
        eth_token_rate: Number(liquidity_eth) / Number(liquidity_tokens)
    };
}


async function getMaxMinRates(exchangeRate, maxSlippagePct) {
  let max_amount = Math.floor(10 * exchangeRate * (100 + maxSlippagePct));
  let min_amount = Math.floor(10 * exchangeRate * (100 - maxSlippagePct));
  return [max_amount, min_amount];
}

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
   
    maxSlippagePct = Number(maxSlippagePct);
    var poolState = await getPoolState(); 
    let exchangeRate = poolState["token_eth_rate"];
    const [max_exchange_rate, min_exchange_rate] = await getMaxMinRates(exchangeRate, maxSlippagePct);
    let amountTokens = Math.round(exchangeRate * amountEth);
    
    await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, amountTokens);
    await exchange_contract.connect(provider.getSigner(defaultAccount)).addLiquidity(max_exchange_rate,  min_exchange_rate, { value: ethers.utils.parseUnits(String(amountEth), "wei") });
  }

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
    
    maxSlippagePct = Number(maxSlippagePct);
    var poolState = await getPoolState(); 
    let exchangeRate = poolState["token_eth_rate"];
    const [max_exchange_rate, min_exchange_rate] = await getMaxMinRates(exchangeRate, maxSlippagePct);
    await exchange_contract.connect(provider.getSigner(defaultAccount)).removeLiquidity(ethers.utils.parseUnits(String(amountEth), "wei"), max_exchange_rate,  min_exchange_rate);
  }

async function removeAllLiquidity(maxSlippagePct) {
    
    maxSlippagePct = Number(maxSlippagePct);
    var poolState = await getPoolState(); 
    let exchangeRate = poolState["token_eth_rate"];
    const [max_exchange_rate, min_exchange_rate] = await getMaxMinRates(exchangeRate, maxSlippagePct); 
    await exchange_contract.connect(provider.getSigner(defaultAccount)).removeAllLiquidity(max_exchange_rate,  min_exchange_rate);
  }

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
    
    maxSlippagePct = Number(maxSlippagePct);
    var poolState = await getPoolState(); 
    let exchangeRate = poolState["eth_token_rate"];
    const [max_exchange_rate, min_exchange_rate] = await getMaxMinRates(exchangeRate, maxSlippagePct);

    await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, amountToken);
    await exchange_contract.connect(provider.getSigner(defaultAccount)).swapTokensForETH(amountToken, max_exchange_rate);
}

async function swapETHForTokens(amountEth, maxSlippagePct) {
    
    maxSlippagePct = Number(maxSlippagePct);
    var poolState = await getPoolState(); 
    let exchangeRate = poolState["token_eth_rate"];

    const [max_exchange_rate, min_exchange_rate] = await getMaxMinRates(exchangeRate, maxSlippagePct);
    await exchange_contract.connect(provider.getSigner(defaultAccount)).swapETHForTokens(max_exchange_rate, { value: ethers.utils.parseUnits(String(amountEth), "wei") });
  }

// =============================================================================
//                                      UI
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response)=> {
    defaultAccount = response[0];
    // Initialize the exchange
    init().then(() => {
        // fill in UI with current exchange rate:
        getPoolState().then((poolState) => {
            $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
            $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

            $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
            $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");
        });
    });
});

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response)=>{
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function() {
    console.log("Account: ", $("#myaccount").val());
    defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);


// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}





