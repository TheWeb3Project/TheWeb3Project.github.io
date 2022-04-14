
'use strict'


function loadScript(url, callback) {
  let body = document.body;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onreadystatechange = callback;
  script.onload = callback;
  script.async = false;

  body.appendChild(script);
}


let isScriptLoaded = 0;
function loadScriptDone() {
	isScriptLoaded += 1;
}

const SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
	"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
	"https://cdn.jsdelivr.net/npm/rangeslider.js@2.3.3/dist/rangeslider.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/web3.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/detect-provider.min.js",
  "https://cdn.jsdelivr.net/gh/upfinity-main/TheWeb3ProjectAssets/js/ethers.umd.min.js",
];

// for (const script of SCRIPTS) {
// 	loadScript(script, loadScriptDone);
// } 

/////////////////////////////////////////////////////////// consts

const BNBDIV = 10**18;
const CHAINID = 56;
const UINT256MAX = 2**256 - 1;

let PROVIDER;
if (window.ethereum) {
	PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
	(async function () {
    let network = await PROVIDER.getNetwork();
    if (network['chainId'] != CHAINID) {
      alert('Network is not BSC. Requesting to change network');
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          rpcUrls: ["https://bsc-dataseed.binance.org"],
        }],
      });
    }
  })();
  
} else {
  PROVIDER = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org", {name: 'binance', 'chainId': 56});
}

const SIGNER = PROVIDER.getSigner();


const ADRS = {};
const ABIS = {};

ADRS['web3'] = "0x333FD139cAeF6Aa31056cC905987b77B1044d259",
ABIS['web3'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",

  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",

  "function manualRebase()",
  "function _isExperi() view returns (bool)",
  "function toggleExperi()",
  "function setBotBlacklists(address[], bool[])",
  "function sellbuy(uint)",
  "function _curcuitBreakerFlag() view returns (uint256)",
  "function _curcuitBreakerTime() view returns (uint256)",
  "function _lastRebaseBlock() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Rebased(uint256 blockNumber, uint256 totalSupply)",
];

ADRS['wweb3'] = "0xE6664F3C20d503beAf78B5B4B059a388fbE9B75f";
ABIS['wweb3'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",
  
  "function deposit(uint)",
  "function withdraw(uint)",
];

ADRS['pweb3'] = "0x877c8140a936ee49cA1DFBaFA58bE6AcB555e569";
ABIS['pweb3'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint256)",
  
  "function approve(address, uint256) returns (bool)",
  "function transfer(address, uint)",
];

ADRS['web3Stake'] = "0xDEF348ebAff60614baF88E9AAAAC1FAaf2113601";
ABIS['web3Stake'] = [
  "function stake(address, uint256)",
  "function unstake()",
  "function emergencyUnstake()",
  "function claimReward()",

  "function _amounts(address) view returns (uint256)",
  "function _rewards(address) view returns (uint256)",
  "function _unlockTimes(address) view returns (uint256)",
  "function _lastClaims(address) view returns (uint256)",
  

  "function calculateReward(uint256, uint256) view returns (uint256)"
];


ADRS['factory'] = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
ABIS['factory'] = [
  "function getPair(address, address) view returns (address)",
];


ADRS['router'] = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
ABIS['router'] = [
  "function getAmountsOut(uint, address[]) view returns (uint[])",
  "function swapExactETHForTokens(uint, address[], address, uint) payable returns (uint[])",
];


ADRS['nft'] = "0x933D6472131545BC742Cde7d051a443eA0683a85";
ABIS['nft'] = [
  "function _ownedTotalItemCount(address) view returns (uint)",
  "function tokenOfOwnerByIndex(address, uint) view returns (uint)",
  "function _itemById(uint) view returns (uint)",
];

const CONTS = {};
const SIGNS = {};

for (let name in ABIS) {
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS[name], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
}

ABIS['token'] = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address, uint)",
  "function approve(address, uint256) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];
ADRS['wbnb'] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
ADRS['busd'] = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
ADRS['cake'] = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
for (let name of ['busd', 'cake']) {
  CONTS[name] = new ethers.Contract(ADRS[name], ABIS['token'], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
}

ABIS['pair'] = [
  "function token0() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

ADRS['pairbusd'] = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16';
ADRS['pairweb3'] = '0x9f7d235b7d3f4403133A559b0968361687e4fC62';
ADRS['paircake'] = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0';
for (let name of ['web3', 'busd', 'cake']) {
  CONTS[`pair${name}`] = new ethers.Contract(ADRS[`pair${name}`], ABIS['pair'], PROVIDER);
  SIGNS[`pair${name}`] = CONTS[`pair${name}`].connect(SIGNER);
}

// our token launch time: 2022.03.22 02:30:03 PM UTC
// https://bscscan.com/tx/0x3745eb92a39460e840aa5503872f7c2fe513f061e8e0e7c59b35fad7841b2896
const STARTBLOCK = 16282771; 

let CURBLOCK;
async function getCurBlock() {
	let curBlock = await PROVIDER.getBlockNumber();
  
  return curBlock;
}
(async () => {
	CURBLOCK = await getCurBlock();
})();

////////////////////////////////// base

function INT(v, n=0) {
  if (n == 0) {
    return parseInt(v);
  }
  
  return parseInt(v * 10**n) / 10**n;
}

function STR(s) {
	return String(s);
}
function ROUND(v, n=0) {
  return v.toFixed(n);
}

function BNB(value, n=4) {
  value = INT(value);
  return ROUND(value / BNBDIV, n);
}

function WRAP(v) {
	return "[" + v + "]";
}

function COMMA(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SHORTADR(adr, x=true, n=4) {
  let shortAdr = '';
  if (x) {
    shortAdr += adr.slice(0, 2);
  }
  shortAdr += adr.slice(2, 2 + n) + '..' + adr.slice(-n);
  return shortAdr;
}

function KEYS(dict) {
	return Object.keys(dict);
}

function NOW() {
  return Date.now();
}

function ADELAY(milSec) {
  return new Promise(r => setTimeout(r, milSec));
}
  
function DELAY(milSec) {
  var start = new Date().getTime();
  var end = 0;
  while ((end - start) < milSec) {
    end = new Date().getTime();
  }
}

let TICKS;
function UPDATETICK() {
  TICKS = TICKS - 1;
}

///////////////////////////////// html

function HREF(link, txt) {
	return `<a href="${link}">${txt}</a>`;
}


function makeElem(elemType, elemId = null, elemClass = null) {
  let elem = document.createElement(elemType);
  if (elemId) {
    elem.setAttribute('id', elemId);
  }
  if (elemClass) {
    elem.setAttribute('class', elemClass);
  }

  return elem;
}
let nullDiv = makeElem('div', 'NULL', null);
nullDiv.style.width = '1px';
nullDiv.style.display = 'none';
document.body.append(nullDiv);

function select(el, all=false) {
  el = el.trim();
  let elms = [...document.querySelectorAll(el)];
  if (elms.length == 0) {
    elms = [document.querySelector('#NULL')]; // how to erase inner?
  }

  if (all) {  
    return elms;
  }

  return elms[0];
}

function displayText(el, text) {
  let els = select(el, true);
  if (els == null) {
    return;
  }
  
  for (var idx = 0; idx < els.length; idx++) {
    els[idx].innerHTML = text;
  }
}



function setCookie(name, value, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}




function copy(value) {
  const input = document.createElement('textarea');
  input.value = value;
	document.body.appendChild(input);

  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {

    var editable = input.contentEditable;
    var readOnly = input.readOnly;

    input.contentEditable = true;
    input.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(input);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;

  } else {
    // document.body.appendChild(input);
    input.select();

  }

  document.execCommand('copy');
  //if (!isiOSDevice) {
    document.body.removeChild(input);
  //}
}

function swapComma(id, isOn) {
  var $input = $( "#" + id );
  
  if (isOn == false) {
    $input.off("keyup");
    return;
  } 
  
  $input.on( "keyup", function( event ) {
   
      // 1.
      var selection = window.getSelection().toString();
      if ( selection !== '' ) {
          return;
      }
   
      // 2.
      if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
          return;
      }
    
      // 3
      var $this = $( this );
      var input = $this.val();
   
      // 4
      var input = input.replace(/[\D\s\._\-]+/g, "");
   
      // 5
      input = input ? parseInt( input, 10 ) : 0;
   
      // 6
      $this.val( function() {
          return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
      });

  } );
}


let inputHandlerBuy = function (e) {
  (async function () {
    valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    result = select('#buy-output');
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = ethers.utils.parseEther(valueIn);
    valueOut = valueIn.mul(3330000);

    valueOut_ = ethers.utils.formatEther(valueOut);
    valueOut_ = parseInt(valueOut_);
    valueOut_ = numberWithCommas(valueOut_);
    result.value = valueOut_;

  })();
}




///////////////////////////////// web3

function BSC(type, txt) {
  return `https://bscscan.com/${type}/${txt}`;
}

function BIGINT(v) {
  return BigInt(v);
}

function BIG(s, decimals=18) {
  try {
    if (decimals == 18) {
      return ethers.utils.parseEther(s);
    } else {
      return ethers.utils.parseUnits(s, decimals);
    }
  } catch (e) {
    alert(e);
  }
}
 
function ETH(big, decimals=18) {
	if (decimals == 18) {
  	return ethers.utils.formatEther(big);
  } else {
  	return ethers.utils.formatUnits(big, decimals);
  }
}
 

 
function ADR(address, popup=true) {
  let checksumAdr;
  try {
    checksumAdr = ethers.utils.getAddress(address);
  } catch (e) {
    let eStr = 'Wrong Format Address: [' + address + ']';
    console.log(eStr);
    if (popup) {
      alert(eStr);
    }
    
    return '';
  }
  return checksumAdr;
}

async function getBalance(adr) {
	let balance = await PROVIDER.getBalance(adr);
 
  return balance;
}

async function getPrice(name) {
  let r = await CONTS[`pair${name}`].getReserves();
  let t0 = await CONTS[`pair${name}`].token0();

  if (t0 == ADRS[name]) {
    r = [r[1], r[0]]; // BNB, adr
  }

  return r[0] / r[1]; // BNB / adr
}



let CURADR = null;
async function getCurAdr() {
	try {
  	CURADR = await SIGNER.getAddress();
  } catch (err) {
  	console.log('not connected yet');
    CURADR = null;
  }
}



function displayAccountInformation() {
  let shortAdrStr = SHORTADR(CURADR);
  
  displayText('.connect-wallet', shortAdrStr);
	
  getBalance(CURADR)
  .then((res) => {
    displayText('#balance-number', BNB(res, 4));
  });

  return;
}



async function handleAccountsChanged(accounts) {
  if (accounts.length == 0) {
    displayText("connectResult", 'Please Connect Metamask');
    return;
  }
  
  if (accounts.length == 0) {
    console.log('no acount');
    CURADR = null;
    return;
  }
  CURADR = ADR(accounts[0]);
  displayAccountInformation();
}

async function conn(func=null, popup=false) {
	try {
  	/* CURADR = await PROVIDER.send("eth_requestAccounts", []) */;
    let accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // eth_requestAccounts
    await handleAccountsChanged(accounts);
    await doAfterConnect();
    if (func != null) {
      await func();
    }
    
  } catch (err) {
    if (err == 'ReferenceError: ethereum is not defined') {
      alert('Use Dapp to connect wallet!');
      return;
    }
    
    console.log(err);
    if ('message' in err) {
      err = err['message'];
    }
  	
    if (popup) {
    	alert(JSON.stringify(err));
    }    
  }
}

async function doAfterConnect() { // dummy
}

function handleChainChanged(_chainId) {
  // Reload the page
  window.location.reload();
}





////////////////////////////////// tx

async function ERR(err, popup=true) {
  let result = err;

  if (!('code' in err)) {
    console.log('no code', err);
    return result;
  }

  if (err['code'] == -32603) {
    if (!('data' in err)) {
      console.log('no data', err);
      return result;
    }

    let data = err['data'];
    if (!('code' in data)) {
      console.log('no code data', err);
      return result;
    }

    if (data['code'] == 3) {
      let msg = data['message'];
      result = msg;
      alert(result);
      return result;
    }

    if (data['code'] == -32000) {
      let msg = data['message'];
      result = msg;
      alert(result);
      return result;
    }
  }

  return result;
}

async function SIGN(name, msg, bin=false) {
	if (bin == true) {
  	msg = ethers.utils.arrayify(msg);
  }
  return await SIGNS[name].signMessage(msg);
}
 
 
async function SEND_ETH(from=ADRS["fund"], to=ADRS["fund"], value='0.0', popup=true) {
	const data = {
  	from: from,
  	to: to,
    value: BIG(value),
    /* nonce: window.ethersProvider.getTransactionCount(send_account, "latest"),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price, */
  };
  
  try {
  	let result = await SIGNER.sendTransaction(data);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err, popup);
    return [ true, err ];
  }
}
 
async function READ_TX(name, method, args, from="0xe7F0704b198585B8777abe859C3126f57eB8C989", popup=true) {
	const overrides = {
  	from: from,
  };
 
  try {
  	let result = await CONTS[name][method](...args, overrides);
    return [ false, result ];
  } catch (err) {
  	err = await ERR(err, popup);
    return [ true, err ];
  }
 
}
 
async function GAS(name, method, args, value = null, popup=true) {
  let overrides = {};
  if (value != null) {
    overrides['value'] = BIG(value);
  }


  let result;
  try {
    result = await SIGNS[name].estimateGas[method](...args, overrides);
    console.log('result', result);
    return [ false, result ];
  } catch (err) {
    result = await ERR(err, popup);
    return [ true, result ];
  };
}
 
async function SEND_TX(name, method, args, value=null, check=true, popup=true) {
  let overrides = {};
  if (value != null) {
    overrides['value'] = BIG(value);
  }

  if (check == true) {
    let [res, data] = await GAS(name, method, args, value);
    if (res == true) {
      console.log(res);
      return [ true, data ];
    } 

    // use gas result
    console.log('gas', res, INT(data));
    overrides['gasLimit'] = INT(data * 1.3);
  }

  try {
    let result;
    result = await SIGNS[name][method](...args, overrides);
    console.log('hash', result['hash']);
    console.log('result', result);
    return [ false, result ];

    // if (wait == true) {
    //   let txResult = await result.wait();
    //   console.log('txResult', txResult);
    //   return [ false, txResult ];
    //   // event, eventSignature
    // } else {
    	
    // }
    /* console.log(tx.hash); */
    // wait()
    // receipt.events
  } catch (err) {
    err = await ERR(err, popup);
    return [ true, err ];
  }
}


let buyTxhashData;
async function privateBuy() {
	let buyAmount = select('#buy-input').value;
  let { res, data } = await SEND_ETH(CURADR, ADRS['fund'], buyAmount);
  if (res == true) {
  	// err
    return [ true, data ];
  }
  
  let buyResult = select('#buy-result');
  buyResult.innerHTML = 'Success';
  let buyTxhash = select('#buy-txhash');
  buyTxhash.innerHTML = HREF(BSC('tx', data.hash), SHORTADR(data.hash));
  buyTxhashData = data.hash;  
}


/* 
await CONTS[name].balanceOf(adr)
 */

/* SIGNS[name].transfer(adr, balance); */

/* CONTS[name].on("Transfer", (from, to, amount, event) => {
  console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
      // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
})
 */
// filter






// while (true) {
// 	if (isScriptLoaded == SCRIPTS.length) {
//     break;
//   }

//   DELAY(100);
// }



(async () => {
  if (window.ethereum) {
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);
  }

  // do global
 
  // do personal

  console.log('done');
})();