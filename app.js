const { ethers } = require('ethers');
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

async function sendMessageToTelegramChannel(message) {
    
    const botToken =process.env.BOT_TOKEN ;
    
    const channelId = '@Base_New_Pairs';
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: channelId,
            text: message,
            parse_mode: 'HTML',
        }),
    });

    const responseData = await response.json();
    if (!responseData.ok) {
        console.error('Error sending message to Telegram:', responseData.description);
    }
}

async function setupEventListener() {
    
    const factoryContractAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/a3f452e6cee74c58a5611d003c0c09f8");
    const factoryContractABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_feeToSetter",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "token0",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "token1",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "PairCreated",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "allPairs",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "allPairsLength",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
          }
        ],
        "name": "createPair",
        "outputs": [
          {
            "internalType": "address",
            "name": "pair",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "feeTo",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "feeToSetter",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "getPair",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "_feeTo",
            "type": "address"
          }
        ],
        "name": "setFeeTo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "_feeToSetter",
            "type": "address"
          }
        ],
        "name": "setFeeToSetter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const factoryContract = new ethers.Contract(factoryContractAddress, factoryContractABI, provider);

    factoryContract.on("PairCreated", (token0, token1, pair, event) => {
        const excludedToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

        let message = '';

        if (token0 === excludedToken) {
            message = `Token Address:\n${token1}\n\nCharts : <a href="https://www.dexscreener.com/ethereum/${token1}">Dexscreener</a> `;
        } else if(token1===excludedToken) {
            message = `Token Address:\n${token0}\n\nCharts : <a href="https://www.dexscreener.com/ethereum/${token0}">Dexscreener</a>`;
        }
        else{
          message= `New pair created with different token :\n${token0,token1}`;
        }

        console.log(message);
        sendMessageToTelegramChannel(message);
    }, { fromBlock: 1952508 });

    console.log("Listening for new pairs...");
}

async function run() {
  await setupEventListener();
}


run().catch(error => console.error(error));


