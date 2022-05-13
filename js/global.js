'use strict'

async function setFs() {
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

  F['treasury'] = async() => {
    let v = (await gV('treasuryBalance')) + (await gV('marketingBalance'));
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

  F['liqMinerBnb'] = async() => {
    return (await getBalance(ADRS['miner'])) / BNBDIV;
  }; 

  F['liqMinerBusd'] = async() => {
    return (await CONTS['busd'].balanceOf(ADRS['miner'])) / BNBDIV;
  }; 

  F['liqMinerWusd'] = async() => {
    return (await CONTS['wusd'].balanceOf(ADRS['miner'])) / BNBDIV;
  };
}
setFs();

let now = INT(NOW() / 1000);

let reAmBase = 1440;
let reAmCur = 1728;
let rePrBase = 0.026;
let rePrCur = 0.07;

let wPrice;
let xPrice;

let cbTimeLeft;
let jackpotTimeLeft;
let jpAlarmed = false;
let cb;
let bigbuyTimeLeft;
let bigbuyAlarmed = false;
async function _runGlobal() {
  let cacheData = await fetch('jsons/values.json');
  cacheData = await cacheData.text();
  cacheData = JSON.parse(cacheData);
  for (let k in cacheData) {
    V[k] = cacheData[k];
  }

  document.getElementById("showSidebar").addEventListener("click", function () {
    document.getElementById("sidebarContainer").classList.add("show");
    document.getElementById("overlay").style.display = "block"
  })

  document.getElementById("overlay").addEventListener("click", function () {
    document.getElementById("sidebarContainer").classList.remove("show");
    document.getElementById("overlay").style.display = "none"
  })
  
  displayText('#priceApy', `${COMMA(INT((1 + rePrBase)**365 * 100, 2))}%`);
  select('#connect').onclick = async () => { await conn(); };

  for (let name in ADRS) {
    displayText(`#${name}`, ADRS[name]);
    select(`#${name}-link`).href = BSC('address', ADRS[name]);
  }

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

  displayText("#corr", `${COMMA(INT((await gV('corr')), 1))}%`);

  displayText("#xFund", `$${COMMA(INT((await gV('xFund'))))}`);

  displayText("#liqMinerBnb", `${COMMA(INT((await gV('liqMinerBnb')), 3))}`);
  displayText("#liqMinerBusd", `${COMMA(INT((await gV('liqMinerBusd')), 3))}`);
  displayText("#liqMinerWusd", `${COMMA(INT((await gV('liqMinerWusd')), 3))}`);

  
  // if value is big, no decimal
  
  // let dollarElms = [];
  // for (let k in F) {
  //   let els = isExist(el);
  //   if (els == null) {
  //     continue;
  //   }

  //   vStr = ``;
  //   if (dollarElms.includes(k)) {
  //       vStr = `$${vStr}`;
  //   }
  //   vStr = `${vStr}${COMMA(INT((await gV(k))))}`;
  //   if ()
  // }

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
