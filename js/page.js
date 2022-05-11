'use strict'

function htmlSide(url, icon, name) {
  let htmlStr = `
    <li class="m-2 p-2 rounded-1">
      <a href="${url}" class="text-decoration-none text-reset d-flex align-items-center neontext">
        <span class="fs-5"><i class="bi bi-${icon}"></i></span>
        <span class="ms-3">${name}</span>
      </a>
    </li>
  `;

  return htmlStr;
}
function htmlSocials(url, icon) {
  let htmlStr = `
    <a href="${url}" class="text-decoration-none text-reset fs-5 social-icon-hover m-2">
      <i class="bi bi-${icon}"></i>
    </a>
  `;

  return htmlStr;
}

function displaySidebar() {
    let htmlStr = `
        <div id="sidebar" class="d-flex flex-column align-items-center py-4">
          <a id="logo" href="https://www.theweb3project.com" class="text-decoration-none d-flex align-items-center p-3">
            <img src="https://uploads-ssl.webflow.com/61f079fe9c0e84c389f618a4/61f51681bbd0e1be3f0538bd_cube.svg" alt="logo-icon" class="col-2">
            <img src="https://raw.githubusercontent.com/TheWeb3Project/TheWeb3ProjectAssets/main/imgs/logotext.png" alt="TheWeb3Project" class="col ms-1" style="width: 85%;">
          </a>

          <ul id="sidebar-nav" class="list-unstyled py-1">
            ${htmlSide('index.html', 'collection', 'Dashboard')}
            ${htmlSide('account.html', 'person-circle', 'Account')}
            ${htmlSide('calculator.html', 'calculator-fill', 'Calculator')}
            ${htmlSide('swap.html', 'lightning-charge', 'Swap')}
            ${htmlSide('wrap.html', 'box-seam', 'Wrap')}
            ${htmlSide('web-pointshop.html', 'shop', 'Point Shop')}
            ${htmlSide('miner.html', 'minecart-loaded', 'Miner')}
            ${htmlSide('xweb.html', 'minecart-loaded', 'xWEB3')}
            ${htmlSide('faq.html', 'minecart-loaded', 'FAQ')}
            ${htmlSide('https://docs.theweb3project.com', 'journal-text', 'Docs')}
          </ul>

          <div class="d-flex justify-content-around px-4">
            ${htmlSocials('https://t.me/TheWeb3Project', 'send-fill')}
            ${htmlSocials('https://twitter.com/TheWeb3Project', 'twitter')}
            ${htmlSocials('https://discord.gg/crQkCE7Mn6', 'discord')}
            ${htmlSocials('https://www.youtube.com/c/TheWeb3Project', 'youtube')}
          </div>
        </div>
        `;
    select('#sidebarContainer').innerHTML = htmlStr;
}
displaySidebar();

function displayWeb3Header() {
    let htmlStr = `
    <div class="d-flex pt-3 px-sm-3">
      <button type="button" id="showSidebar" class="d-lg-none btn fs-5"><i class="bi bi-list"></i></button>

      <div class="dropdown ms-auto">
        <button class="btn rounded-1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,14">
          <span class="fw-medium ms-1">WEB3</span> <span id="price" class="ms-1 small text-secondary">$0</span>
        </button>

        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">

          <li><a class="dropdown-item" href="https://poocoin.app/tokens/0x333fd139caef6aa31056cc905987b77b1044d259">Chart</a></li>
        </ul>
      </div>

      <button id="connect" type="button" class="btn rounded-1 ms-3">
        Connect Wallet
      </button>
    </div>`;
    select('#web3-header').innerHTML = htmlStr;
    select('#web3-header').classList = "w-100 position-fixed end-0 top-0";
    select('#web3-header').style = "height: 68px; z-index: 100001;"
}
displayWeb3Header();

function setCss() {
  select('#main').classList = 'col';
  select('#container').classList = 'container mt-5';
  let elms = select('#card', true);
  for (let elm of elms) {
    elm.classList = "card bg-light text-center p-4 d-block";
    elm.style = "box-shadow: 2px 2px 9px 0 rgb(17 19 20 / 90%), -2px -2px 9px 0 rgb(93 100 112 / 90%);  background-image: linear-gradient(160deg,#424750,#202326);";
  }
}
setCss();

let now = INT(NOW() / 1000);

let F = {};
let V = {};
let P = {};
async function gV(k) {
  if (!(k in V)) {
    if (!(k in F)) {
      alert(k);
      return [true, null];
    }

    if (!(k in P)) {
      P[k] = null;  
    }

    V[k] = await F[k](P[k]);
  }

  return V[k];  
}

let AMOUNTADDED = 1728;
let PRICEMULED = 0.058;

let wPrice;
let xPrice;

let cbTimeLeft;
let jackpotTimeLeft;
let jpAlarmed = false;
let cb;
let bigbuyTimeLeft;
let bigbuyAlarmed = false;
async function _runGlobal() {
  document.getElementById("showSidebar").addEventListener("click", function () {
    document.getElementById("sidebarContainer").classList.add("show");
    document.getElementById("overlay").style.display = "block"
  })

  document.getElementById("overlay").addEventListener("click", function () {
    document.getElementById("sidebarContainer").classList.remove("show");
    document.getElementById("overlay").style.display = "none"
  })
  
  select('#AMOUNTADDED').innerHTML = AMOUNTADDED;
  select('#connect').onclick = async () => { await conn(); };

  for (let name in ADRS) {
    displayText(`#${name}`, ADRS[name]);
    select(`#${name}-link`).href = BSC('address', ADRS[name]);
  }

  F['xWeb3'] = async() => {
    return ADRS['xweb3'];
  };

  F['bnbPrice'] = async() => { return 1 / (await getPrice('busd')); };
  F['totalSupply'] = async() => {
    let v = await CONTS['web3'].totalSupply();
    return v / BNBDIV;
  };
  F['wTotalSupply'] = async() => {
    let v = 100 * 10**3 * 10**18;
    return v / BNBDIV;
  };
  F['xTotalSupply'] = async() => {
    let v = await CONTS['xweb3'].totalSupply();
    return v / BNBDIV;
  };
  
  F['lockedAmount'] = async() => {
    let v = await CONTS['web3'].balanceOf("0x0e46Ee6fE64B4Cf366e6Bd894Becf3A759e69c33");
    return v / BNBDIV;
  };

  F['blackHoleAmount'] = async() => {
    let v = await CONTS['web3'].balanceOf("0x1C57a30c8E1aFb11b28742561afddAAcF2aBDfb7");
    return v / BNBDIV;
  };

  F['circulatingSupply'] = async() => {
    return (await gV('totalSupply')) - (await gV('blackHoleAmount')) - (await gV('lockedAmount'));
  };

  F['trustFundBalance'] = async() => {
    let trustFundAdr = "0x5060E2fBB789c021C9b510e2eFd9Bf965e6a2475";
    let v = (await getBalance(trustFundAdr)) / BNBDIV * (await gV('bnbPrice'));
    v += (await CONTS['busd'].balanceOf(trustFundAdr)) / BNBDIV;
    v += 200000; // node invest
    return v;
  };

  F['treasuryBalance'] = async() => {
    let treasuryAdr = "0xcCa3C1D62C80834f8B303f45D89298866C097B1a";
    let v = (await getBalance(treasuryAdr)) / BNBDIV * (await gV('bnbPrice'));
    v += (await CONTS['busd'].balanceOf(treasuryAdr)) / BNBDIV
    return v;
  };

  F['marketingBalance'] = async() => {
    let marketingAdr = "0x495987fFDcbb7c04dF08c07c6fD7e771Dba74175";
    let v = (await getBalance(marketingAdr)) / BNBDIV * (await gV('bnbPrice'));
    v += (await CONTS['busd'].balanceOf(marketingAdr)) / BNBDIV;
    return v;
  };

  F['liqReserves'] = async() => {
    return await CONTS['pairweb3'].getReserves();
  };

  F['liqWeb3'] = async() => {
    return (await gV('liqReserves'))[0] / BNBDIV;
  };

  F['liqBnb'] = async() => {
    return (await gV('liqReserves'))[1] / BNBDIV;
  };

  F['liqRate'] = async() => {
    return (await gV('liqBnb')) / (await gV('liqWeb3'));
  };

  F['liqBalance'] = async() => {
    return (await gV('liqBnb')) * (await gV('bnbPrice'));
  };

  F['autoLiqBalance'] = async() => {
    return (await getBalance(ADRS['web3'])) / BNBDIV * (await gV('bnbPrice'));
  };

  F['price'] = async() => {
    return (await gV('liqRate')) * (await gV('bnbPrice'));
  };

  F['wPrice'] = async() => {
    return (await gV('price')) * (await gV('totalSupply')) / (await gV('wTotalSupply'));
  };

  F['xPrice'] = async() => {
    return (await gV('wPrice')) + (await gV('xTotalSupply'));
  };

  F['wRate'] = async() => {
    return (await gV('wPrice')) / (await gV('price'));
  };

  F['wLockedAmount'] = async() => {
    return (await CONTS['wweb3'].balanceOf(ADRS['wweb3'])) / BNBDIV;
  };

  F['wCirculatingSupply'] = async() => {
    return (await gV('wTotalSupply')) - (await gV('wLockedAmount'));
  };

  F['mcap'] = async() => {
    return (await gV('price')) * (await gV('circulatingSupply'));
  };

  F['corr'] = async() => {
    return (await gV('liqBalance')) / (await gV('mcap')) * 100;
  };

  F['liqWusd'] = async() => {
    return (await CONTS['wusd'].balanceOf(ADRS['wusd'])) / BNBDIV;
  }; 

  F['liqBusd'] = async() => {
    return (await CONTS['busd'].balanceOf(ADRS['wusd'])) / BNBDIV;
  }; 

  F['xFund'] = async() => {
    return (await getBalance(ADRS['xweb3'])) / BNBDIV * (await gV('bnbPrice'));
  };

  displayText("#burned", `${COMMA(INT((await gV('blackHoleAmount')), 3))}`);
  displayText("#cirSupply", `${COMMA(INT((await gV('circulatingSupply')), 3))}`); 
  displayText("#trustFund", `$${COMMA(INT((await gV('trustFundBalance')), 3))}`);
  displayText("#treasury", `$${COMMA(INT((await gV('treasuryBalance')) + (await gV('marketingBalance')), 3))}`);
  displayText("#liquidity", `$${COMMA(INT((await gV('liqBalance')), 0))}`);

  displayText("#price", `$${COMMA(INT((await gV('price')), 3))}`);
  displayText("#theBlackHole", `$${COMMA(INT((await gV('blackHoleAmount')) * (await gV('price'))))}`);
  displayText("#wPrice", `$${COMMA(INT((await gV('wPrice')), 3))}`);
  wPrice = V['wPrice'];

  displayText("#xPrice", `$${COMMA(INT((await gV('xPrice')), 3))}`);
	xPrice = V['xPrice'];

  displayText("#wRate", `${COMMA(INT((await gV('wRate')), 2))} $WEB3`);

  displayText("#xPriceWithPweb3", `${COMMA(INT((await gV('xPrice')) * 1769, 3))} pWEB3`);

  displayText("#cirSupply", `${COMMA(INT((await gV('circulatingSupply')), 3))}`);

  displayText("#mcap", `$${COMMA(INT((await gV('mcap'))))}`);

  select('#corr').setAttribute('title', `Correlation: ${COMMA(INT((await gV('corr')), 1))}%`);
  displayText("#corr2", `${COMMA(INT((await gV('corr')), 1))}%`);

  displayText("#xFund", `$${COMMA(INT((await gV('xFund'))))}`);

  // manual rebase
  select('#rebase').onclick = async () => { await runManualRebase(); };
  select('#jpShare').onclick = async () => { 
    let imgData = await captureImg('#jpS');
    select('#jpCaptured').innerHTML = IMG(imgData);
    select('#imgCopy').innerHTML = `Click <a href="#" onclick="imgCopy('#jpS');">here</a> to copy this image`;
  };
  select('#totalShare').onclick = async () => { 
    let imgData = await captureImg('#totalSection');
    select('#jpCaptured').innerHTML = IMG(imgData);
    select('#imgCopy').innerHTML = `Click <a href="#" onclick="imgCopy('#totalSection');">here</a> to copy this image`;
  };
  select('#dailyShare').onclick = async () => { 
    let imgData = await captureImg('#dailySection');
    select('#jpCaptured').innerHTML = IMG(imgData);
    select('#imgCopy').innerHTML = `Click <a href="#" onclick="imgCopy('#dailySection');">here</a> to copy this image`;
  };

  let shareLink = encodeURIComponent("https://dashboard.theweb3project.com");
  let shareText = encodeURIComponent("Join Jackpot of The Web3 Project!");
  select('#shareTw').href = `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareText}`;
  select('#shareTw').target="_blank";
  select('#shareFb').href = `http://www.facebook.com/share.php?u=${shareLink}&t=${shareText}`;
  select('#shareFb').target="_blank";

  let _topWinnerTime = INT(await CONTS['jackpot']._topWinnerTime());
  _topWinnerTime = new Date(_topWinnerTime * 1000);
  displayText("#_topWinnerTime", `${_topWinnerTime.getUTCMonth() + 1}/${_topWinnerTime.getUTCDate()} ${_topWinnerTime.getUTCHours()}:${_topWinnerTime.getUTCMinutes()}:${_topWinnerTime.getUTCSeconds()}`);

  let _topWinnerAmount = await CONTS['jackpot']._topWinnerAmount();
  _topWinnerAmount = _topWinnerAmount / BNBDIV * (await gV('bnbPrice'));
  displayText("#_topWinnerAmount", `$${COMMA(INT(_topWinnerAmount, 0))}`);

  let _topWinner = await CONTS['jackpot']._topWinner();
  displayText("#_topWinner", `${HREF(BSC('address', _topWinner), SHORTADR(_topWinner))}`);

  setInterval(async () => {
    now = INT(NOW() / 1000);
    
    let lastBuyTime = INT(await CONTS['jackpot']._lastBuyTime());
    jackpotTimeLeft = lastBuyTime + 600 - now;
    // if (jackpotTimeLeft < 0) {
    //   displayText("#jpTimer", `Winner is chosen! Wait for result!`);            
    // }

    let lastBuyer = await CONTS['jackpot']._lastBuyer();
    displayText("#lastBuyer", `${HREF(BSC('address', lastBuyer), SHORTADR(lastBuyer))}`);

    let jpPrize = (await getBalance(ADRS['jackpot'])) / BNBDIV * (await gV('bnbPrice'));
    displayText("#jpPrize", `$${COMMA(INT(jpPrize, 0))}`);
  
    
    let topBuyer = await CONTS['jackpot']._topBuyer(); 
    displayText("#biggestBuyer", `${HREF(BSC('address', topBuyer), SHORTADR(topBuyer))}`);
    
    let bigbuyAmount = INT(await CONTS['jackpot']._dailyBuyAmounts(topBuyer));
    bigbuyAmount = bigbuyAmount / BNBDIV;
    displayText("#bigbuyAmount", `${INT(bigbuyAmount, 1)} BNB`);
    
    let _lastWinnerTime = INT(await CONTS['jackpot']._lastWinnerTime());
    _lastWinnerTime = new Date(_lastWinnerTime * 1000);
    displayText("#_lastWinnerTime", `${_lastWinnerTime.getUTCMonth() + 1}/${_lastWinnerTime.getUTCDate()} ${_lastWinnerTime.getUTCHours()}:${_lastWinnerTime.getUTCMinutes()}:${_lastWinnerTime.getUTCSeconds()}`);
  
    let _lastWinnerAmount = await CONTS['jackpot']._lastWinnerAmount();
    _lastWinnerAmount = _lastWinnerAmount / BNBDIV * (await gV('bnbPrice'));
    displayText("#_lastWinnerAmount", `$${COMMA(INT(_lastWinnerAmount, 0))}`);
  
    let _lastWinner = await CONTS['jackpot']._lastWinner();
    displayText("#_lastWinner", `${HREF(BSC('address', _lastWinner), SHORTADR(_lastWinner))}`);

    
    let bigbuyTime = INT(await CONTS['jackpot']._dailyPrizeTime());
    bigbuyTimeLeft = bigbuyTime + 60*60*24 - now;

    cb = await CONTS['web3']._curcuitBreakerFlag();
    if (cb == 2) {
      let cbTime = INT(await CONTS['web3']._curcuitBreakerTime());
      cbTimeLeft = cbTime + 3600 - now;
    }
  }, 5000);

  setInterval(function () {
    
    if (isNaN(jackpotTimeLeft)) {
      return;
    }

    if (jackpotTimeLeft <= 0) {
      return;
    }
    
    if (jpAlarmed == false) {
      if (jackpotTimeLeft < 100) {
        alert("100 seconds left for jackpot!");
        jpAlarmed = true;
      }
    }

    displayText("#jpTimer", `${INT(jackpotTimeLeft / 60)}m ${jackpotTimeLeft % 60}s`);            
    jackpotTimeLeft = UPDATETICK(jackpotTimeLeft);
  }, 1000);

  setInterval(function () {
    if (isNaN(bigbuyTimeLeft)) {
      return;
    }

    if (bigbuyTimeLeft <= 0) {
      return;
    }
    
    if (bigbuyAlarmed == false) {
      if (bigbuyTimeLeft < 600) {
        alert("10 minutes left for big buy jackpot!");
        bigbuyAlarmed = true;
      }
    }
    
    displayText("#biggestTimer", `${INT((bigbuyTimeLeft % 86400) / 3600)}h ${INT((bigbuyTimeLeft % 3600) / 60)}m ${bigbuyTimeLeft % 60}s`);            
    bigbuyTimeLeft = UPDATETICK(bigbuyTimeLeft);
  }, 1000);

  displayText("#cb", `OFF`);
  displayText("#tax", `14%/16%`);
  setInterval(function () {
    if (cb != 2) {
      displayText("#cb", `OFF`);
      displayText("#tax", `10%/25%`);
      return;
    }

    if (isNaN(cbTimeLeft)) {
      return;
    }

    if (cbTimeLeft <= 0) {
      displayText("#cb", `OFF`);
      displayText("#tax", `14%/16%`);
      return;
    }

    displayText("#cb", `ON for ${INT(cbTimeLeft / 60)}m ${cbTimeLeft % 60}s`);
    displayText("#tax", `10%/25%`);
    cbTimeLeft = UPDATETICK(cbTimeLeft);
  }, 1000);

  setInterval(async () => {
    await eventBoard();
  }, 10000);

  // select('#buy-box').onclick = async () => {
  //   let [res, data] = await SEND_TX('nft', 'getArmyBox', []);
  //   if (res == true) {
  //     return;
  //   }

  //   let result = data;
  //   let txResult = await result.wait();
    
  //   // CONTS['web3'].filters.Transfer(ADRS['pairweb3'], null);

  //   // emit MintedNFT(tokenId, user, tokenItem);
  //   // console.log(txResult['events']);

  //   displayText('#nftLink', HREF(BSC(address, CURADR + '#tokentxnsErc721'), Link));

  // };

  select('#buy-box').onclick = async () => { await boxOpening(); };
  
  select('#buy-miner').onclick = async () => { await buyMiner(); };
  select('#buy-xweb3').onclick = async () => { await buyXweb3(); };
  select('#hire-miner-bnb').onclick = async () => { await buyMinerBnb(); };
  select('#hire-miner-busd').onclick = async () => { await buyMinerBusd(); };

  select('#hireMore').onclick = async () => { await buyMinerMore(); };
  select('#sellOre').onclick = async () => { await sellOre(); };
	
  select('#hof-claim').onclick = async () => { 
    alert('upgrading');
    // await SEND_TX('nft', 'hallOfFame', [])};
  };
  console.log('global done');
}


async function imgCopy(targetId) { 
  let canvas = await html2canvas(select(targetId));
  canvas.toBlob((blob) => {
    navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blob,
        })
    ]);
  });
}


// owner
async function bl(adr) {
  await SEND_TX('web3', 'setBotBlacklists', [[ADR(adr)], [true]]);
}
async function wl(adr) {
  await SEND_TX('web3', 'setLifeSupports', [[ADR(adr)], [2]]);
}
async function pr(rate) {
  alert(`
  if want to price rebase 2.3%, type [await pr(10000);]
  if want to price rebase 9.2%, type [await pr(40000);]
  10000 * (multiple of 2.3%)
  `);
  await SEND_TX('web3', 'setPriceRate', [rate]);
}

async function runManualRebase() {
  await SEND_TX('web3', 'manualRebase', []);
}

async function runToggleExperi() {
  await SEND_TX('web3', 'toggleExperi', []);
}


let lockedAmount;
let lockedDuration;
let totalSupplyPercentage;
async function _runPersonal() {
  displayText('#connect', SHORTADR(CURADR));

  F['bnbBalance'] = async() => {
    let v = await getBalance(CURADR)
    return v / BNBDIV;
  };
  displayText("#bnbBalance", `${COMMA(INT((await gV('bnbBalance')), 3))}`);

  for (let name of ['web3', 'wweb3', 'pweb3', 'xweb3', 'wusd', 'busd', 'miner']) {
    F[`${name}Balance`] = async() => {
      let v = await CONTS[name].balanceOf(CURADR);
      return v / BNBDIV;
    };
    displayText(`#${name}Balance`, `${COMMA(INT((await gV(`${name}Balance`)), 3))}`);
  }

  F['xHolding'] = async() => {
    let v = (await gV('xweb3Balance')) / (await gV('xTotalSupply')) * 100;
    return v;
  };

  F['xReward'] = async() => {
    let v = (await gV('xFund')) * 0.05 * (await gV('xHolding')) / 100;
    return v;
  };

  displayText("#xHolding", `${COMMA(INT((await gV('xHolding')), 3))}%`);
  displayText("#xReward", `${COMMA(INT((await gV('xReward')), 3))} BNB`);
  

  lockedAmount = await CONTS['lock']._amounts(CURADR);
  lockedAmount = lockedAmount / BNBDIV;
  displayText("#lockedAmount", `${COMMA(INT(lockedAmount, 3))}`);
  
  lockedDuration = await CONTS['lock']._durations(CURADR);
  displayText("#lockedDuration", `${COMMA(INT(lockedDuration, 3))}`);

  totalSupplyPercentage = ((await gV('web3Balance')) / (await gV('totalSupply'))) * 100;
  if (totalSupplyPercentage < 0.001) {
    displayText("#percentTotalSupply", `< 0.001`);
  } else {
    displayText("#percentTotalSupply", `${COMMA(INT(totalSupplyPercentage, 3))}`);
  }

  console.log('personal done');
}

let events = [];
async function addEvent(name, event_) {
  if (name == 'buy') {
    let adr = event_[0];
    let amount = event_[1];
    amount = amount / BNBDIV;
    events.unshift(`${SHORTADR(adr)} buy ${INT(amount, 5)} $WEB3!`);
  }
  if (name == 'rebase') {
    let lastSupply = event_[0];
    let curSupply = event_[1];
    let diff = (curSupply - lastSupply) / BNBDIV;
    events.unshift(`Rebased: Total Supply +${INT(diff, 2)}!`);
  }

  if (events.length == 10) {
    events.pop();
  }

  let htmlStr = ``;
  for (let event of events) {
    htmlStr += event + '<br/>';
  }

  select('#events').innerHTML = htmlStr;
}

let lastBlock;
let lastSupply = 0;
async function eventBoard() {
  let txLogs;

  if (CURBLOCK == undefined) {
    return;
  }

  if (lastBlock == undefined) {
    lastBlock = CURBLOCK;
    return;
  }

  let latestBlock = await PROVIDER.getBlockNumber();
  for (var idy = 1; idy < 100; idy++) {
    let blockData = await PROVIDER.getBlock(latestBlock + idy);
    if (blockData == null) {
      CURBLOCK = latestBlock + idy - 1;
      break;
    }
  }

  if (lastBlock == CURBLOCK) {
    console.log('not yet', CURBLOCK + 1);
    return;
  }
  
  let buyFilter = CONTS['web3'].filters.Transfer(ADRS['pairweb3'], null);
  for (var idy = 0; idy < 10; idy++) {
      try {
          txLogs = await CONTS['web3'].queryFilter(buyFilter, lastBlock, CURBLOCK);
          break;
      } catch {
          DELAY(100);
      }
  }

  for (var idy = 0; idy < txLogs.length; idy++) {
    let adr = txLogs[idy].args[1];
    if (adr == '0x1C57a30c8E1aFb11b28742561afddAAcF2aBDfb7') {
      continue;
    }

    if (adr == ADRS['web3']) {
      continue;
    }

    let amount = txLogs[idy].args[2];
    await addEvent('buy', [adr, amount]);
  }

  let rebaseFilter = CONTS['web3'].filters.Rebased();
  for (var idy = 0; idy < 10; idy++) {
      try {
          txLogs = await CONTS['web3'].queryFilter(rebaseFilter, lastBlock, CURBLOCK);
          break;
      } catch {
          DELAY(100);
      }
  }
  for (var idy = 0; idy < txLogs.length; idy++) {
    let curSupply = txLogs[idy].args[1];
    if (lastSupply == 0) {
      lastSupply = curSupply;
      continue;
    }
    if (lastSupply == curSupply) {
      continue;
    }

    await addEvent('rebase', [lastSupply, curSupply]);
    lastSupply = curSupply;
  }


  let jackpotFilter = CONTS['jackpot'].filters.Jackpot();
  for (var idy = 0; idy < 10; idy++) {
      try {
          txLogs = await CONTS['jackpot'].queryFilter(jackpotFilter, lastBlock, CURBLOCK);
          break;
      } catch {
          DELAY(100);
      }
  }
  for (var idy = 0; idy < txLogs.length; idy++) {
    let winner = txLogs[idy].args[1];
    let bnbAmount = txLogs[idy].args[2];
    bnbAmount = bnbAmount / BNBDIV;
    alert(`JACKPOT!!!!!! ${SHORTADR(winner)} got ${INT(bnbAmount, 3)} BNB!`);
  }

  lastBlock = CURBLOCK;
}



/////////////////////////////////////////////////////////////////////////// account
async function getTotalEarned() {
  let buyFilter = CONTS['web3'].filters.Transfer(null, CURADR);
  let sellFilter = CONTS['web3'].filters.Transfer(CURADR, null);

  let amount = getCookie('accountWeb3Amount');
  if (amount == null) {
    amount = BigInt(0);
  }
  amount = BigInt(amount);

  let startBlock = getCookie('accountWeb3StartBlock');
  if (startBlock == null) {
    startBlock = STARTBLOCK;
  }
  startBlock = INT(startBlock);

  let txLogs;
  let n = INT((CURBLOCK - startBlock) / 5000);
  for (var idx = 0; idx < n; idx++) {
      displayText("#totalEarned", `Getting Updates.. ${INT(idx / n * 100, 1)}%`);
      let fromBlock = startBlock + 5000 * idx;
      let toBlock = startBlock + 5000 * idx + 5000;
      if (CURBLOCK < toBlock) {
        toBlock = CURBLOCK;
      }

      for (var idy = 0; idy < 10; idy++) {
          try {
              txLogs = await CONTS['web3'].queryFilter(buyFilter, fromBlock, toBlock);
              break;
          } catch {
              DELAY(100);
          }
      }
      for (var idy = 0; idy < txLogs.length; idy++) {
          let data = txLogs[idy]['data'];
          amount += BigInt(data);
      }

      for (var idy = 0; idy < 10; idy++) {
          try {
              txLogs = await CONTS['web3'].queryFilter(sellFilter, fromBlock, toBlock);
              break;
          } catch {
              DELAY(100);
          }
      }
      for (var idy = 0; idy < txLogs.length; idy++) {
          let data = txLogs[idy]['data'];
          amount -= BigInt(data);
      }

      setCookie('accountWeb3Amount', amount, 10);
      setCookie('accountWeb3StartBlock', toBlock, 10);

      if (toBlock == CURBLOCK) {
          break;
      }
  }
  amount = INT(amount) / BNBDIV;

  // console.log(web3Balance, amount);
  let totalEarned = (await gV('web3Balance')) - amount; // little precision
  let earnRate = totalEarned / (await gV('web3Balance')) * 100;
  displayText("#totalEarned", `${COMMA(INT(totalEarned, 3))} $WEB3 (+${COMMA(INT(earnRate, 3))}%)`);
  displayText("#totalEarnedInUsd", `$${COMMA(INT(totalEarned * (await gV('price')), 3))}`);
}

/////////////////////////////////////////////////////////////////////////// calculator
function changedValue(target, curTarget) {
  // let tV = curTarget.value;
  // displayText(`#${target}`, tV);

  let days;
  if (target == 'days') {
    days = curTarget.value;
    displayText('#days', days);
  } else {
    days = INT(select("#days").innerHTML);
  }

  let curAmount = select('#amount').value / 1;
  if (curAmount == 0) {
    displayText("#initInvest", `$${COMMA(INT(0.000, 3))}`);
    displayText("#futWealth", `$${COMMA(INT(0.000, 3))}`);
  }

  let curPrice = select('#curPrice').value / 1;
  let initInvest = curAmount * curPrice;
  displayText("#initInvest", `$${COMMA(INT(initInvest, 3))}`);

  // let dailyRate = 0.004908;  
  // let dailyRate = 0.02301279;
  // let totalRate = ((1 + dailyRate) ** days);
  // let futAmount = INT(curAmount * totalRate, 2);
  let futAmount = curAmount + curAmount * AMOUNTADDED * days / (V['totalSupply'] + AMOUNTADDED * days);
  select('#futAmount').value = `${COMMA(INT(futAmount, 3))}`;
	
  let futPrice;
  if (target == 'days') {
    let dailyPriceRate = 0.01;
    // let dailyPriceRate = 0.01801636;
    // let dailyPriceRate = 0.02301279;
    // let totalPriceRate = ((1 + dailyPriceRate) ** days);
    futPrice = curPrice * (1 + dailyPriceRate * days);
    select('#futPrice').value = INT(futPrice, 3);
  } else if (target == 'futPrice') {
    futPrice = curTarget.value;
  }

  let futInvest = futAmount * futPrice;

  displayText("#futWealth", `$${COMMA(INT(futInvest, 2))}`);

  displayText("#rewardsEsti", `${COMMA(INT(futAmount - curAmount, 2))}`);

  displayText("#potenReturn", `$${COMMA(INT(futInvest - initInvest, 2))}`);

  displayText("#spaceTravel", `${COMMA(INT(futInvest / 250000))}`); 
}


/////////////////////////////////////////////////////////////////////////// wrap

async function approve(name, target) {
  await SEND_TX(name, 'approve', [target, BIGINT(2**255)]);
}

async function funcRate(v, rI, rO) {
  let a = BIG(String(rI));
  let b = BIG(String(rO));

  return v.mul(b).div(a);
}

async function swapRate(v, rI, rO) {
  let a = BIG(String(rI));
  let b = BIG(String(rO));

  let nume = v.mul(b);
  let deno = v.add(a);
  return nume.div(deno);
}

async function handleInputBuy(e) {
  await handleInput(e, 'swap-output', async (v) => {
    return await funcRate(v, (await gV('liqBnb')), (await gV('liqWeb3')));
  });
}

async function handleInputSell(e) {
  await handleInput(e, 'swap-output', async (v) => {
    return await funcRate(v, (await gV('liqWeb3')), (await gV('liqBnb')));
  });
}

async function handleInputWrap(e) {
  await handleInput(e, 'wrap-output', async (v) => {
    return await funcRate(v, (await gV('totalSupply')), (await gV('wTotalSupply')));
  });
}

async function handleInputUnwrap(e) {
  await handleInput(e, 'wrap-output', async (v) => {
    return await funcRate(v, (await gV('wTotalSupply')), (await gV('totalSupply')));
  });
}

async function handleInputToWusd(e) {
  await handleInput(e, 'wusd-output', async (v) => {
    let oV = await swapRate(v, (await gV('liqBusd')), (await gV('liqWusd')));
    return oV;
  });
}

async function handleInputToBusd(e) {
  await handleInput(e, 'wusd-output', async (v) => {
    let oV = await swapRate(v, (await gV('liqWusd')), (await gV('liqBusd')));
    if (v < oV / BNBDIV) { // busd max 1:1
      oV = v;
    }
    return oV;
  });
}

async function handleInput(e, name, func) {
	let valueIn = e.target.value;
  valueIn = valueIn.replace(/,/g, '.');
  e.target.value = valueIn;
  let ot = select(`#${name}`);
  if (valueIn == 0) {
    ot.value = 0;
    return;
  }

  let valueIn_ = BIG(valueIn);
  let valueOut_ = await func(valueIn_);
  let valueOut = ETH(valueOut_);

  valueOut = INT(parseFloat(valueOut), 8);
  ot.value = valueOut;
}



let STATES = {};
async function switchTarget(states, target, handleFs, bals, logos, syms, runFs) {
  let tmp = select(`#${target}-input`).value;
  select(`#${target}-input`).value = select(`#${target}-output`).value;
  select(`#${target}-output`).value = tmp;

  select(`#${target}-output`).style.pointerEvents = "none";

  if (STATES[target] == states[0]) {
    select(`#${target}-input`).removeEventListener('input', handleFs[0]);
    select(`#${target}-input`).addEventListener('input', handleFs[1]);

    displayText(`#${target}-balance-input`, `${COMMA(INT(bals[1], 3))}`);
    displayText(`#${target}-balance-output`, `${COMMA(INT(bals[0], 3))}`);

    select(`#${target}-logo-input`).src = logos[1];
    select(`#${target}-logo-output`).src = logos[0];
    displayText(`#${target}-symbol-input`, syms[1]);
    displayText(`#${target}-symbol-output`, syms[0]);

    displayText(`#${target}-run-name`, states[1]);
    select(`#${target}-run`).onclick = async () => { await runFs[1](); };
    STATES[target] = states[1];
  } else {
    select(`#${target}-input`).removeEventListener('input', handleFs[1]);
    select(`#${target}-input`).addEventListener('input', handleFs[0]);

    displayText(`#${target}-balance-input`, `${COMMA(INT(bals[0], 3))}`);
    displayText(`#${target}-balance-output`, `${COMMA(INT(bals[1], 3))}`);

    select(`#${target}-logo-input`).src = logos[0];
    select(`#${target}-logo-output`).src = logos[1];
    displayText(`#${target}-symbol-input`, syms[0]);
    displayText(`#${target}-symbol-output`, syms[1]);

    displayText(`#${target}-run-name`, states[0]);
    select(`#${target}-run`).onclick = async () => { await runFs[0](); };
    STATES[target] = states[0];
  }
}



async function runBuy() {
  let bnbInput = select('#swap-input');
  await SEND_TX('router', 'swapExactETHForTokensSupportingFeeOnTransferTokens', [0, [ADRS['wbnb'], ADRS['web3']], CURADR, NOW() + 10**6], String(bnbInput.value));
}
async function runSell() {
  let web3Input = select('#swap-input');
  let web3Amount = BIG(web3Input.value);
  await SEND_TX('router', 'swapExactTokensForETHSupportingFeeOnTransferTokens', [web3Amount, 0, [ADRS['web3'], ADRS['wbnb']], CURADR, NOW() + 10**6]);
}


async function runWrap() {
  let web3Input = select('#wrap-input');
  let web3Amount = BIG(web3Input.value);
  await SEND_TX('wweb3', 'deposit', [web3Amount]);
}

async function runUnwrap() {
  let web3Input = select('#wrap-input');
  let web3Amount = BIG(web3Input.value);
  await SEND_TX('wweb3', 'withdraw', [web3Amount]);
}

async function runToWusd() {
  let busdInput = select('#wusd-input');
  let busdAmount = BIG(busdInput.value);
  await SEND_TX('wusd', 'wusdToBusd', [busdAmount]);
}

async function runToBusd() {
  let wusdInput = select('#wusd-input');
  let wusdAmount = BIG(wusdInput.value);
  await SEND_TX('wusd', 'busdToWusd', [wusdAmount]);
}


/////////////////////////////////////////////////////////////////////////// stake

async function runLock(idx) {
  let lockAmount = select(`#lock-input${idx}`).value;
  let days = select("#days").innerHTML;

  if (idx > 3) {
    alert('wrong idx');
    return;
  }

  if (idx == 1) {
    await SEND_TX('lock', 'stake', [BIG(lockAmount), days]);
  } else {
    await SEND_TX('lock', 'stakeMulti', [idx - 1, BIG(lockAmount), days]);
  }
}

async function runUnlock(idx) {
  if (idx > 3) {
    alert('wrong idx');
    return;
  }

  if (idx == 1) {
    await SEND_TX('lock', 'unstake', []);
  } else {
    await SEND_TX('lock', 'unstakeMulti', [idx - 1]);
  }
}

async function runClaim(idx) {
  if (idx > 3) {
    alert('wrong idx');
    return;
  }

  if (idx == 1) {
    await SEND_TX('lock', 'claimReward', []);
  } else {
    await SEND_TX('lock', 'claimRewardMulti', [idx - 1]);
  }
}

async function runEmerUnstake(idx) {
  if (idx > 3) {
    alert('wrong idx');
    return;
  }

  if (idx == 1) {
    await SEND_TX('lock', 'emergencyUnstake', []);
  } else {
    await SEND_TX('lock', 'emergencyUnstakeMulti', [idx - 1]);
  }
}


function IMG(src) {
	return `<img src="${src}" style="width: 100%;">`;
}

async function captureImg(targetId) {
  let canvas = await html2canvas(select(targetId));
  var imgData = canvas.toDataURL('image/png');
  return imgData;
}

function getRef() {
  let href = location.href;
  let hrefSplit = href.split('?ref=');
  if (hrefSplit.length <= 1) {
    return '';
  }

  let ref = hrefSplit[1];
  try {
    ref = ADR(ref);
  } catch {
    return '';
  }

  return ref;
}


async function buyMinerBnb() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let amount = select('#days').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('miner', 'HirePay', [ref], amount);
}

async function buyMinerBusd() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let amount = select('#days').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('miner', 'Hire', [ref, ADRS['busd'], BIG(amount)]);
}

async function buyMiner() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let pweb3Amount = select('#miner-input').value;
  pweb3Amount = pweb3Amount.replace(/,/g, '');
  if (pweb3Amount < 8845) {
    alert('input more than 8845 pWEB3');
    return;
  }
  
  await SEND_TX('miner', 'Hire', [ref, ADRS['pweb3'], BIG(pweb3Amount)]);
}

async function buyMinerMore() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let daimonds = await CONTS['miner'].getMyDaimonds(CURADR);
  let miners = daimonds / (await CONTS['miner'].DAIMONDS_TO_HIRE_MINER());
  if (miners < 2) {
    alert('wait more to hire miners');
    return;
  }
  
  await SEND_TX('miner', 'HireMore', [ref]);
}

async function sellOre() {
  await SEND_TX('miner', 'Receive', []);
} 

async function buyXweb3() {
  let amount = select('#xweb3-output').value;
  amount = amount.replace(/,/g, '');
  await SEND_TX('xweb3', 'buy', [ADRS['pweb3'], BIG(amount)]);
}


async function addCopy(id, adr) {
  let button = select(id);
  
  await navigator.clipboard.writeText(adr);
  button.innerText = 'Copied';
  setTimeout(() => {
		button.innerHTML = '<img style="width: 16px; height: 16px; margin-left: 10px; " src="./images/copy-solid.svg" alt="">'
	}, 3000)
}

select('#copy-web3').onclick = async () => { await addCopy('#copy-web3', ADRS['web3']); };
select('#copy-wweb3').onclick = async () => { await addCopy('#copy-wweb3', ADRS['wweb3']); };
select('#copy-pweb3').onclick = async () => { await addCopy('#copy-pweb3', ADRS['pweb3']); };
select('#copy-wusd').onclick = async () => { await addCopy('#copy-wusd', ADRS['wusd']); };

//////////////////////////////////////////////////////////////////////////////


async function maxValueSwapInput() {
  let bal = select('#swap-balance-input').innerHTML;
  select("#swap-input").value = bal;
}

async function maxValueWrapInput() {
  let bal = select('#wrap-balance-input').innerHTML;
  select("#wrap-input").value = bal;
}

async function maxValueWrapInput() {
  let bal = select('#wrap-balance-input').innerHTML;
  select("#wrap-input").value = bal;
}

async function maxValueWusdInput() {
  let bal = select('#wusd-balance-input').innerHTML;
  select("#wusd-input").value = bal;
}

async function maxValueLockInput() {
  let bal = select('#wweb3Balance').innerHTML;
  select("#lock-input").value = bal;
}

async function maxPweb3Input(id) {
  let v = (await gV('pweb3Balance'));
  select(id).value = v;
  setXweb3Value(v);
}