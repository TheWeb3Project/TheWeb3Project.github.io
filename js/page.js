'use strict'

function htmlSide(url, icon, name) {
  let htmlStr = `
    <li class="mb-4 py-2 px-5 rounded-1">
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
    <a href="${url}" class="text-decoration-none text-reset fs-5 social-icon-hover">
      <i class="bi bi-${icon}"></i>
    </a>
  `;

  return htmlStr;
}

function displaySidebar() {
    let htmlStr = `
        <div id="sidebar" class="d-flex flex-column align-items-center pe-2 py-4">
          <a id="logo" href="https://www.theweb3project.com" class="text-decoration-none mb-5 w-100 d-flex align-items-center ps-3 pe-2">
            <img src="https://uploads-ssl.webflow.com/61f079fe9c0e84c389f618a4/61f51681bbd0e1be3f0538bd_cube.svg" alt="logo-icon" class="col-2">
            <img src="https://raw.githubusercontent.com/TheWeb3Project/TheWeb3ProjectAssets/main/imgs/logotext.png" alt="TheWeb3Project" class="col ms-4" style="width: 100%;">
          </a>

          <ul id="sidebar-nav" class="list-unstyled p-0 py-5">
            ${htmlSide('index.html', 'collection', 'Dashboard')}
            ${htmlSide('account.html', 'person-circle', 'Account')}
            ${htmlSide('calculator.html', 'calculator-fill', 'Calculator')}
            ${htmlSide('swap.html', 'lightning-charge', 'Swap')}
            ${htmlSide('wrap.html', 'box-seam', 'Wrap')}
            ${htmlSide('web-pointshop.html', 'shop', 'Point Shop')}
            ${htmlSide('miner.html', 'minecart-loaded', 'Miner')}
            ${htmlSide('https://docs.theweb3project.com', 'journal-text', 'Docs')}
          </ul>

          <div class="d-flex justify-content-around w-100 px-4">
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
}
displayWeb3Header();

let now = INT(NOW() / 1000);

let F = {};
let V = {};
let P = {};
async function getV(k) {
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

let bnbPrice;
let price;
let wPrice;
let xPrice;

let totalSupply;
let wTotalSupply;
let xTotalSupply;

let liqWeb3;
let liqBnb;

let cbTimeLeft;
let jackpotTimeLeft;
let jpAlarmed = false;
let cb;
let bigbuyTimeLeft;
let bigbuyAlarmed = false;
async function runGlobal() {
  select('#connect').onclick = async () => { await conn(); };

  bnbPrice = 1 / (await getPrice('busd'));
  
  totalSupply = await CONTS['web3'].totalSupply();
  totalSupply = totalSupply / BNBDIV;

  wTotalSupply = 100 * 10**3 * 10**18;
  wTotalSupply = wTotalSupply / BNBDIV;
  
  xTotalSupply = await CONTS['xweb3'].totalSupply();
  xTotalSupply = xTotalSupply / BNBDIV;
  
  let lockedAmount = await CONTS['web3'].balanceOf("0x0e46Ee6fE64B4Cf366e6Bd894Becf3A759e69c33");
  lockedAmount = lockedAmount / BNBDIV;

  let blackHoleAmount = await CONTS['web3'].balanceOf("0x1C57a30c8E1aFb11b28742561afddAAcF2aBDfb7");
  blackHoleAmount = blackHoleAmount / BNBDIV;
  displayText("#burned", `${COMMA(INT(blackHoleAmount, 3))}`);

  let circulatingSupply = totalSupply - blackHoleAmount - lockedAmount;
  displayText("#cirSupply", `${COMMA(INT(circulatingSupply, 3))}`);

  let trustFundAdr = "0x5060E2fBB789c021C9b510e2eFd9Bf965e6a2475";
  let trustFundBalance = (await getBalance(trustFundAdr)) / BNBDIV * bnbPrice;
  trustFundBalance += (await CONTS['busd'].balanceOf(trustFundAdr)) / BNBDIV;
  trustFundBalance += 200000; // node invest
  displayText("#trustFund", `$${COMMA(INT(trustFundBalance, 3))}`);

  let treasuryAdr = "0xcCa3C1D62C80834f8B303f45D89298866C097B1a";
  let treasuryBalance = (await getBalance(treasuryAdr)) / BNBDIV * bnbPrice;
  treasuryBalance += (await CONTS['busd'].balanceOf(treasuryAdr)) / BNBDIV;

  let marketingAdr = "0x495987fFDcbb7c04dF08c07c6fD7e771Dba74175";
  let marketingBalance = (await getBalance(marketingAdr)) / BNBDIV * bnbPrice;
  marketingBalance += (await CONTS['busd'].balanceOf(marketingAdr)) / BNBDIV;
  displayText("#treasury", `$${COMMA(INT(treasuryBalance + marketingBalance, 3))}`);

  let liqReserves = await CONTS['pairweb3'].getReserves();
  liqWeb3 = liqReserves[0] / BNBDIV;
  liqBnb = liqReserves[1] / BNBDIV;
  let liqRate = liqBnb / liqWeb3;

  let liqBalance = liqBnb * bnbPrice;
  displayText("#liquidity", `$${COMMA(INT(liqBalance, 0))}`);

  let autoLiqBalance = (await getBalance(ADRS['web3'])) / BNBDIV * bnbPrice;
  displayText("#backedLiq", `${COMMA(INT((trustFundBalance + treasuryBalance + marketingBalance + autoLiqBalance) / liqBalance * 100, 0))}%`);

  price = liqRate * bnbPrice;
  displayText("#price", `$${COMMA(INT(price, 3))}`);
  displayText("#theBlackHole", `$${COMMA(INT(blackHoleAmount * price))}`);

  wPrice = price * totalSupply / wTotalSupply;
  displayText("#wPrice", `$${COMMA(INT(wPrice, 3))}`);

  xPrice = wPrice + xTotalSupply;
  displayText("#xPrice", `$${COMMA(INT(xPrice, 3))}`);
	
  displayText("#xPriceWithPweb3", `${COMMA(INT(xPrice * 1769, 3))} pWEB3`);

  let wLockedAmount = (await CONTS['wweb3'].balanceOf(ADRS['wweb3'])) / BNBDIV;
  let wCirculatingSupply = wTotalSupply - lockedAmount;
  displayText("#cirSupply", `${COMMA(INT(circulatingSupply, 3))}`);

  let mcap = price * circulatingSupply;
  displayText("#mcap", `$${COMMA(INT(mcap))}`);

  let corr = liqBalance / mcap * 100;
  select('#corr').setAttribute('title', `Correlation: ${COMMA(INT(corr, 1))}%`);
  displayText("#backedLiq", `${COMMA(INT(corr, 1))}%`);

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

  setInterval(async () => {
    now = INT(NOW() / 1000);
    
    let lastBuyTime = INT(await CONTS['web3Jackpot']._lastBuyTime());
    jackpotTimeLeft = lastBuyTime + 600 - now;
    // if (jackpotTimeLeft < 0) {
    //   displayText("#jpTimer", `Winner is chosen! Wait for result!`);            
    // }
    
    let lastBuyer = await CONTS['web3Jackpot']._lastBuyer(); 
    displayText("#lastBuyer", `${SHORTADR(lastBuyer)}`);

    let jpPrize = (await getBalance(ADRS['web3Jackpot'])) / BNBDIV * bnbPrice;
    displayText("#jpPrize", `$${COMMA(INT(jpPrize, 0))}`);
  
    
    let topBuyer = await CONTS['web3Jackpot']._topBuyer(); 
    displayText("#biggestBuyer", `${SHORTADR(topBuyer)}`);
    
    let bigbuyAmount = INT(await CONTS['web3Jackpot']._dailyBuyAmounts(topBuyer));
    bigbuyAmount = bigbuyAmount / BNBDIV;
    displayText("#bigbuyAmount", `${INT(bigbuyAmount, 1)} BNB`);

    let bigbuyTime = INT(await CONTS['web3Jackpot']._dailyPrizeTime());
    bigbuyTimeLeft = bigbuyTime + 60*60*24 - now;

    cb = await CONTS['web3']._curcuitBreakerFlag();
    if (cb == 2) {
      let cbTime = INT(await CONTS['web3']._curcuitBreakerTime());
      cbTimeLeft = cbTime + 3600 - now;
    }
  }, 10000);

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
  displayText("#buyTax", `14%`);
  displayText("#sellTax", `16%`);
  setInterval(function () {
    if (cb != 2) {
      displayText("#cb", `OFF`);
      displayText("#buyTax", `14%`);
      displayText("#sellTax", `16%`);
      return;
    }

    if (isNaN(cbTimeLeft)) {
      return;
    }

    if (cbTimeLeft <= 0) {
      displayText("#cb", `OFF`);
      displayText("#buyTax", `14%`);
      displayText("#sellTax", `16%`);
      return;
    }

    displayText("#cb", `ON for ${INT(cbTimeLeft / 60)}m ${cbTimeLeft % 60}s`);
    displayText("#buyTax", `10%`);
    displayText("#sellTax", `25%`);
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
  select('#buy-miner').onclick = async () => { await buyMiner(); };
  select('#buy-xweb3').onclick = async () => { await buyXweb3(); };
  select('#hire-miner-bnb').onclick = async () => { await buyMinerBnb(); };
  select('#hire-miner-busd').onclick = async () => { await buyMinerBusd(); };

  select('#hireMore').onclick = async () => { await buyMinerMore(); };
  select('#sellOre').onclick = async () => { await sellOre(); };
	
  select('#hof-claim').onclick = async () => { await SEND_TX('nft', 'hallOfFame', [])};
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






let bnbBalance;
let balance;
let wBalance;
let pBalance;

let lockedAmount;
let lockedDuration;
let totalSupplyPercentage;
async function _runPersonal() {
  displayText('#connect', SHORTADR(CURADR));

  bnbBalance = await getBalance(CURADR)
  bnbBalance = bnbBalance / BNBDIV;
  displayText("#bnbBalance", `${COMMA(INT(bnbBalance, 3))}`);

  balance = await CONTS['web3'].balanceOf(CURADR);
  balance = balance / BNBDIV;
  displayText("#balance", `${COMMA(INT(balance, 3))}`);

  wBalance = await CONTS['wweb3'].balanceOf(CURADR);
  wBalance = wBalance / BNBDIV;
  displayText("#wBalance", `${COMMA(INT(wBalance, 3))}`);

  pBalance = await CONTS['pweb3'].balanceOf(CURADR);
  pBalance = pBalance / BNBDIV;
  displayText("#pBalance", `${COMMA(INT(pBalance, 3))}`);

  lockedAmount = await CONTS['web3Stake']._amounts(CURADR);
  lockedAmount = lockedAmount / BNBDIV;
  displayText("#lockedAmount", `${COMMA(INT(lockedAmount, 3))}`);
  
  lockedDuration = await CONTS['web3Stake']._durations(CURADR);
  displayText("#lockedDuration", `${COMMA(INT(lockedDuration, 3))}`);

  totalSupplyPercentage = (balance / totalSupply) * 100;
  displayText('#percentTotalSupply', `${totalSupplyPercentage.toString().substring(0,6) }`)

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


  let jackpotFilter = CONTS['web3Jackpot'].filters.Jackpot();
  for (var idy = 0; idy < 10; idy++) {
      try {
          txLogs = await CONTS['web3Jackpot'].queryFilter(jackpotFilter, lastBlock, CURBLOCK);
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

  // console.log(balance, amount);
  let totalEarned = balance - amount; // little precision
  let earnRate = totalEarned / balance * 100;
  displayText("#totalEarned", `${COMMA(INT(totalEarned, 3))} $WEB3 (+${COMMA(INT(earnRate, 3))}%)`);
  displayText("#totalEarnedInUsd", `$${COMMA(INT(totalEarned * price, 3))}`);
}

/////////////////////////////////////////////////////////////////////////// calculator
function changedValue(target, curTarget) {
  let curAmount = select('#amount').value / 1;
  if (curAmount == 0) {
    displayText("#initInvest", `$${COMMA(INT(0.000, 3))}`);
    displayText("#futWealth", `$${COMMA(INT(0.000, 3))}`);
  }

  let days;
  if (target == 'days') {
    days = INT(curTarget.value);
    select("#noOfDays").innerHTML = days;
  } else {
    days = INT(select("#noOfDays").innerHTML);
  }


  if (target == 'xWEB3') {
    days = INT(curTarget.value);
    select("#noOfxWEB3").innerHTML = days;
  } else {
    days = INT(select("#noOfxWEB3").innerHTML);
  }

  let curPrice = select('#curPrice').value / 1;
  let initInvest = curAmount * curPrice;
  displayText("#initInvest", `$${COMMA(INT(initInvest, 3))}`);

  // let dailyRate = 0.004908;
  // let dailyRate = 0.02301279;

  
  // let dailyRate = 0.02301279;
  // let totalRate = ((1 + dailyRate) ** days);
  // let futAmount = INT(curAmount * totalRate, 2);
  let futAmount = curAmount + curAmount * 2880 * days / (totalSupply + 2880 * days);
  select('#futAmount').value = INT(futAmount, 3);

  let futPrice;
  if (target == 'futPrice') {
    futPrice = curTarget.value / 1;
  } else {
    let dailyPriceRate = 0.01;
    // let dailyPriceRate = 0.01801636;
    // let dailyPriceRate = 0.02301279;

    // let dailyPriceRate = 0.02301279;
    // let totalPriceRate = ((1 + dailyPriceRate) ** days);
    futPrice = curPrice * (1 + dailyPriceRate * days); 
    select('#futPrice').value = INT(futPrice, 3);
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



// async function inputHandleWrap(e) {
// 	await inputHandle(e, 'wrap', totalSupply, wTotalSupply);
// }

async function handleInputSwap(e) {
  await handleInput(e, 'wrap-output', liqBnb, liqWeb3);
}

async function handleInputWrap(e) {
  await handleInput(e, 'wrap-output', totalSupply, wTotalSupply);
}

async function handleInputUnwrap(e) {
  await handleInput(e, 'wrap-output', wTotalSupply, totalSupply);
}

async function handleInput(e, name, inputSupply, outputSupply) {
	let valueIn = e.target.value;
  valueIn = valueIn.replace(/,/g, '.');
  e.target.value = valueIn;
  let ot = select(`#${name}`);
  if (valueIn == 0) {
    ot.value = 0;
    return;
  }

  let valueIn_ = BIG(valueIn);
  let valueOut_ = valueIn_.mul(BIG(String(outputSupply))).div(BIG(String(inputSupply)));

  let valueOut = ETH(valueOut_);
  valueOut = INT(parseFloat(valueOut), 8);
  ot.value = valueOut;
}


async function runSwap() {
  let bnbInput = select('#wrap-input');
  let bnbValue = String(bnbInput.value);
  await SEND_TX('router', 'swapExactETHForTokens', [0, [ADRS['wbnb'], ADRS['web3']], CURADR, NOW() + 10**6], bnbValue);
}

async function runWrap() {
  let web3Input = select('#wrap-input');
  let web3Amount = BIG(web3Input.value);
  await SEND_TX('wweb3', 'deposit', [web3Amount]);
}


let wrapState = 'wrap';
async function wrapChange() {
  if (wrapState == 'wrap') {
    select('#wrap-input').removeEventListener('input', handleInputWrap);
    select('#wrap-input').addEventListener('input', handleInputUnwrap);

    let tmp = select('#wrap-input').value;
    // select('#wrap-input').value = select('#wrap-output').value;
    // select('#wrap-output').value = tmp;

    displayText("#balance-input", `${COMMA(INT(wBalance, 3))}`);
    displayText("#balance-output", `${COMMA(INT(balance, 3))}`);



    select('#symbol-input').innerHTML = "wWEB3";
    select('#symbol-output').innerHTML = "WEB3";
    select('#run-name').innerHTML = "Unwrap";
    select('#run-wrap').onclick = async () => { await runUnwrap(); };
    wrapState = 'unwrap';
  } else {
    select('#wrap-input').removeEventListener('input', handleInputUnwrap);
    select('#wrap-input').addEventListener('input', handleInputWrap);

    let tmp = select('#wrap-input').value;
    // select('#wrap-input').value = select('#wrap-output').value;
    // select('#wrap-output').value = tmp;

    displayText("#balance-input", `${COMMA(INT(balance, 2))}`);
    displayText("#balance-output", `${COMMA(INT(wBalance, 2))}`);

    select('#symbol-input').innerHTML = "WEB3";
    select('#symbol-output').innerHTML = "wWEB3";
    select('#run-name').innerHTML = "Wrap";
    select('#run-wrap').onclick = async () => { await runWrap(); };
    wrapState = 'wrap';
  }
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



/////////////////////////////////////////////////////////////////////////// stake

async function runStake() {
  let stakeAmount = select('#stake-input').value;
  let days = select("#noOfDays").innerHTML;

  await SEND_TX('web3Stake', 'stake', [BIG(stakeAmount), days]);
}

async function runUnstake() {
  await SEND_TX('web3Stake', 'unstake', []);
}

async function runClaim() {
  await SEND_TX('web3Stake', 'claimReward', []);
}

async function runEmerUnstake() {
  await SEND_TX('web3Stake', 'emergencyUnstake', []);
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
  let hrefSplit = href.split('ref=');
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

  let amount = select('#noOfDays').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('web3Miner', 'HirePay', [ref], amount);
}

async function buyMinerBusd() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let amount = select('#noOfDays').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('web3Miner', 'Hire', [ref, ADRS['busd'], BIG(amount)]);
}

async function buyMiner() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  let amount = select('#noOfDays').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('web3Miner', 'Hire', [ref, ADRS['pweb3'], BIG(amount)]);
}

async function buyMinerMore() {
  let ref = getRef();
  if (ref == '') {
    ref = '0xcCa3C1D62C80834f8B303f45D89298866C097B1a';
  }

  await SEND_TX('web3Miner', 'HireMore', [ref]);
}

async function sellOre() {
  await SEND_TX('web3Miner', 'Receive', []);
} 

async function buyXweb3() {
  let amount = select('#xweb3-pweb3').innerHTML;
  amount = amount.replace(/,/g, '');
  await SEND_TX('xweb3', 'buy', [ADRS['pweb3'], BIG(amount)]);
}





//////////////////////////////////////////////////////////////////////////////

const button = select('.copy-btn');

const addToClipboard = async (link) => {
	await navigator.clipboard.writeText(link);
}

const copyLink = async (link) => {
	const copied = await addToClipboard(link)
	button.innerText = 'Copied'
	setTimeout(() => {
		button.innerHTML = '<img style="width: 16px; height: 16px; margin-left: 10px; " src="./images/copy-solid.svg" alt="">'
	}, 3000)
};

button.addEventListener('click', () => copyLink('0x333FD139cAeF6Aa31056cC905987b77B1044d259'))

const buttonpweb = select('.copy-btn-pweb');

const addToClipboardpweb = async (link) => {
	await navigator.clipboard.writeText(link);
}

const copyLinkpweb = async (link) => {
	const copiedpweb = await addToClipboardpweb(link)
	buttonpweb.innerText = 'Copied'
	setTimeout(() => {
		buttonpweb.innerHTML = '<img style="width: 16px; height: 16px; margin-left: 10px; " src="./images/copy-solid.svg" alt="">'
	}, 3000)
};

buttonpweb.addEventListener('click', () => copyLinkwrap('0x877c8140a936ee49cA1DFBaFA58bE6AcB555e569'))

const buttonpwrap = select('.copy-btn-wrap');

const addToClipboardwrap = async (link) => {
	await navigator.clipboard.writeText(link);
}

const copyLinkwrap = async (link) => {
	const copiedwrap = await addToClipboardwrap(link)
	buttonpwrap.innerText = 'Copied'
	setTimeout(() => {
		buttonpwrap.innerHTML = '<img style="width: 16px; height: 16px; margin-left: 10px; " src="./images/copy-solid.svg" alt="">'
	}, 3000)
};

buttonpwrap.addEventListener('click', () => copyLinkwrap('0xE6664F3C20d503beAf78B5B4B059a388fbE9B75f'))

async function maxValuesSwapInput(clickedButton) {
  console.log(clickedButton);
  let bnbBalance = document.getElementById('bnbBalance').textContent;
  console.log(bnbBalance);
  document.getElementById("wrap-input").setAttribute('value', bnbBalance);
  displayText("#wrap-input", bnbBalance);
}

async function maxValueSwapOutput(clickedButton) {
  console.log(clickedButton);
  let bnbBalance = document.getElementById('balance').textContent;
  console.log(bnbBalance);
  document.getElementById("wrap-output").setAttribute('value', bnbBalance);
  displayText("#wrap-output ", bnbBalance);
}


async function maxValueWrapInput() {
  let bnbBalance = document.getElementById('balance-input').textContent;
  console.log(bnbBalance);
  document.getElementById("wrap-input").setAttribute('value', bnbBalance);
  displayText("#wrap-input", bnbBalance);
}

async function maxValueWrapOutput() {
  let bnbBalance = document.getElementById('balance-output').textContent;
  console.log(bnbBalance);
  document.getElementById("wrap-output").setAttribute('value', bnbBalance);
  displayText("#wrap-output ", bnbBalance);
}

async function maxValueStakeInput() {
  let bnbBalance = document.getElementById('wBalance').textContent;
  console.log(bnbBalance);
  document.getElementById("stake-input").setAttribute('value', bnbBalance);
  displayText("#stake-input", bnbBalance);
}