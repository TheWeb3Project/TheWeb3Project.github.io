'use strict'

function displaySidebar() {
    let htmlStr = `
        <div id="sidebar" class="d-flex flex-column align-items-center pe-2 py-4">
          <a id="logo" href="https://www.theweb3project.com" class="text-decoration-none mb-5 w-100 d-flex align-items-center ps-3 pe-2">
            <img src="https://uploads-ssl.webflow.com/61f079fe9c0e84c389f618a4/61f51681bbd0e1be3f0538bd_cube.svg" alt="logo-icon" class="col-2">
            <img src="https://raw.githubusercontent.com/TheWeb3Project/TheWeb3ProjectAssets/main/imgs/logotext.png" alt="TheWeb3Project" class="col ms-4" style="width: 100%;">
          </a>

          <ul id="sidebar-nav" class="list-unstyled p-0 py-5">
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="index.html" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-collection"></i></span>
                <span class="ms-3">Dashboard</span>
              </a>
            </li>
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="account.html" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-person-circle"></i></span>
                <span class="ms-3">Account</span>
              </a>
            </li>
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="calculator.html" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-calculator-fill"></i></span>
                <span class="ms-3">Calculator</span>
              </a>
            </li>
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="swap.html" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-lightning-charge"></i></span>
                <span class="ms-3">Swap</span>
              </a>
            </li>
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="wrap.html" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-lightning-charge"></i></span>
                <span class="ms-3">Wrap</span>
              </a>
            </li>
            <li class="mb-4 py-2 px-5 rounded-pill">
              <a href="https://docs.theweb3project.com" class="text-decoration-none text-reset d-flex align-items-center">
                <span class="fs-5"><i class="bi bi-journal-text"></i></span>
                <span class="ms-3">Docs</span>
              </a>
            </li>
          </ul>

          <div class="d-flex justify-content-around w-100 px-4">
            <a href="https://t.me/TheWeb3Project" class="text-decoration-none text-reset fs-5 social-icon-hover">
              <i class="bi bi-send-fill"></i>
            </a>
            <a href="https://twitter.com/TheWeb3Project" class="text-decoration-none text-reset fs-5 social-icon-hover">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="https://discord.gg/crQkCE7Mn6" class="text-decoration-none text-reset fs-5 social-icon-hover">
              <i class="bi bi-discord"></i>
            </a>
            <a href="https://www.youtube.com/c/TheWeb3Project" class="text-decoration-none text-reset fs-5 social-icon-hover">
              <i class="bi bi-youtube"></i>
            </a>

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
                <li><a class="dropdown-item" href="https://pancakeswap.finance/swap?outputCurrency=0x333FD139cAeF6Aa31056cC905987b77B1044d259">Buy on Pancakeswap</a></li>
                <li><a class="dropdown-item" href="https://poocoin.app/tokens/0x333fd139caef6aa31056cc905987b77b1044d259">Chart</a></li>
              </ul>
            </div>

            <button id="connect" type="button" class="btn rounded-1 ms-3">
              Connect Wallet
            </button>
          </div>
          `;
    select('#web3-header').innerHTML = htmlStr;
}
displayWeb3Header();


let bnbPrice;
let price;
let totalSupply;
let wweb3totalSupply;
async function runGlobal() {
  select('#connect').onclick = async () => { await conn(); };

  bnbPrice = 1 / (await getPrice('busd'));

  totalSupply = await CONTS['web3'].totalSupply();
  totalSupply = totalSupply / BNBDIV;
  
  wweb3totalSupply = await CONTS['wweb3'].totalSupply();
  wweb3totalSupply = wweb3totalSupply / BNBDIV;

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
  displayText("#trustFund", `$${COMMA(INT(trustFundBalance, 3))}`);

  let treasuryAdr = "0xcCa3C1D62C80834f8B303f45D89298866C097B1a";
  let treasuryBalance = (await getBalance(treasuryAdr)) / BNBDIV * bnbPrice;
  treasuryBalance += (await CONTS['busd'].balanceOf(treasuryAdr)) / BNBDIV;

  let marketingAdr = "0x495987fFDcbb7c04dF08c07c6fD7e771Dba74175";
  let marketingBalance = (await getBalance(marketingAdr)) / BNBDIV * bnbPrice;
  marketingBalance += (await CONTS['busd'].balanceOf(marketingAdr)) / BNBDIV;
  displayText("#treasury", `$${COMMA(INT(treasuryBalance + marketingBalance, 3))}`);

  let liqReserves = await CONTS['pairweb3'].getReserves();
  let liqBnb = liqReserves[1] / BNBDIV; 
  let liqBalance = liqBnb * bnbPrice;
  displayText("#liquidity", `$${COMMA(INT(liqBalance, 0))}`);

  let autoLiqBalance = (await getBalance(ADRS['web3'])) / BNBDIV * bnbPrice;
  displayText("#backedLiq", `${COMMA(INT((trustFundBalance + treasuryBalance + marketingBalance + autoLiqBalance) / liqBalance * 100, 0))}%`);

  let liqWeb3 = liqReserves[0] / BNBDIV;
  let liqRate = liqBnb / liqWeb3;
  price = liqRate * bnbPrice;
  displayText("#price", `$${COMMA(INT(price, 3))}`);
  displayText("#theBlackHole", `$${COMMA(INT(blackHoleAmount * price))}`);

  let mcap = price * circulatingSupply;
  displayText("#mcap", `$${COMMA(INT(mcap))}`);
  
  let corr = liqBalance / mcap * 100;
  select('#corr').setAttribute('title', `Correlation: ${COMMA(INT(corr, 1))}%`);
  displayText("#backedLiq", `${COMMA(INT(corr, 1))}%`);

  // manual rebase
  select('#rebase').onclick = async () => { await runManualRebase(); };
}


// owner 
async function bl(adr) {
  await SEND_TX('web3', 'setBotBlacklists', [[ADR(adr)], [true]]);
}
async function runManualRebase() {
  await SEND_TX('web3', 'manualRebase', []);
}

async function runToggleExperi() {
  await SEND_TX('web3', 'toggleExperi', []);
}



let balance;
async function _doAfterConnect() {
  displayText('#connect', SHORTADR(CURADR));

  balance = await CONTS['web3'].balanceOf(CURADR);
  balance = balance / BNBDIV;

  displayText("#balance", `${COMMA(INT(balance, 3))}`);
}

let lastBlock;
lastBlock = CURBLOCK;
let lastSupply;
lastSupply = 0;
async function eventBoard() {
  let buyFilter = CONTS['web3'].filters.Transfer(ADRS['pairweb3'], null);
  let rebaseFilter = CONTS['web3'].filters.Rebased();

  let txLogs;
  let curBlock = await getCurBlock();

      for (var idy = 0; idy < 10; idy++) {
          try {
              txLogs = await CONTS['web3'].queryFilter(buyFilter, lastBlock, curBlock);
              break;
          } catch {
              DELAY(100);
          }
      }

      for (var idy = 0; idy < txLogs.length; idy++) {
          let amount = txLogs[idy].args[2];
          console.log('buy', amount);
      }
      
      for (var idy = 0; idy < 10; idy++) {
          try {
              txLogs = await CONTS['web3'].queryFilter(rebaseFilter, lastBlock, curBlock);
              break;
          } catch {
              DELAY(100);
          }
      }
      for (var idy = 0; idy < txLogs.length; idy++) {
        let curSupply = txLogs[idy].args[1];
        if (lastSupply == 0) {
          continue;
        }

        console.log('rebase', lastSupply, curSupply);
        lastSupply = curSupply;
      }
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
  
  console.log(balance, amount);
  let totalEarned = balance - amount; // little precision
  let earnRate = totalEarned / balance * 100;
  displayText("#totalEarned", `${COMMA(INT(totalEarned, 3))} $WEB3 (+${COMMA(INT(earnRate, 3))}%)`);
  displayText("#totalEarnedInUsd", `$${COMMA(INT(totalEarned * price, 3))}`);
}

/////////////////////////////////////////////////////////////////////////// calculator
function changedValue(target, curTarget) {
  let curAmount = select('#amount').value;
  if (curAmount == 0) {
    displayText("#initInvest", `$${COMMA(INT(0.000, 3))}`);
    displayText("#futWealth", `$${COMMA(INT(0.000, 3))}`);
  }

  let days;
  if (target == 'days') {
    days = curTarget.value;
    select("#noOfDays").innerHTML = days;
  } else {
    days = select("#noOfDays").innerHTML;
  }

  let curPrice = select('#curPrice').value;
  let initInvest = curAmount * curPrice;
  displayText("#initInvest", `$${COMMA(INT(initInvest, 3))}`);

  // let dailyRate = 0.004908;
  // let dailyRate = 0.02301279;
  
  
  let dailyRate = 0.02301279;
  let totalRate = ((1 + dailyRate) ** days);      
  let futAmount = INT(curAmount * totalRate, 2);
  select('#futAmount').value = futAmount;
  
  let futPrice;
  if (target == 'futPrice') {
    futPrice = curTarget.value;
  } else {
    // let dailyPriceRate = 0.01801636;
    // let dailyPriceRate = 0.02301279;
    
    // let dailyPriceRate = 0.02301279;
    // let totalPriceRate = ((1 + dailyPriceRate) ** days);
    // futPrice = INT(curPrice * totalPriceRate, 2);
  let futurePrice = select('#futPrice').value;

    futPrice = INT(futurePrice, 2);
    select('#futPrice').value;
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

let wrapInputHandle = function (e) {
  (async function () {
    let valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    let result = select('#wrap-output');
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = BIG(valueIn);
    let valueOut = valueIn.mul(BIG(String(wweb3totalSupply))).div(BIG(String(totalSupply)));

    let valueOut_ = ETH(valueOut);
    valueOut_ = INT(parseFloat(valueOut_), 8);
    result.value = valueOut_;

  })();
}

let unwrapInputHandle = function (e) {
  (async function () {
    let valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    let result = select('#wrap-output');
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = BIG(valueIn);
    let valueOut = valueIn.mul(BIG(String(totalSupply))).div(BIG(String(wweb3totalSupply)));

    let valueOut_ = ETH(valueOut);
    valueOut_ = INT(parseFloat(valueOut_), 8);
    result.value = valueOut_;
  })();
}

let wrapState = 'wrap';
async function wrapChange() {
  if (wrapState == 'wrap') {
    select('#wrap-input').removeEventListener('input', wrapInputHandle);
    select('#wrap-input').addEventListener('input', unwrapInputHandle);
    
    let tmp = select('#wrap-input').value;
    select('#wrap-input').value = select('#wrap-output').value;
    select('#wrap-output').value = tmp;

    displayText("#balance-input", `${COMMA(INT(wweb3Balance, 3))}`);
    displayText("#balance-output", `${COMMA(INT(balance, 3))}`);

    select('#symbol-input').innerHTML = "wWEB3";
    select('#symbol-output').innerHTML = "WEB3";
    select('#run-name').innerHTML = "Unwrap";
    select('#run-wrap').onclick = async () => { await runUnwrap(); };
    wrapState = 'unwrap';
  } else {
    select('#wrap-input').removeEventListener('input', unwrapInputHandle);
    select('#wrap-input').addEventListener('input', wrapInputHandle);
    
    let tmp = select('#wrap-input').value;
    select('#wrap-input').value = select('#wrap-output').value;
    select('#wrap-output').value = tmp;

    displayText("#balance-input", `${COMMA(INT(balance, 3))}`);
    displayText("#balance-output", `${COMMA(INT(wweb3Balance, 3))}`);

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
  let valueInput = select('#value-input').value;
  let wweb3Amount = BIG(valueInput.value);
  let duration = select('#value-output');
  await SEND_TX('web3Stake', 'stake', [web3Amount, duration]);
}

async function runClaim() {
  await SEND_TX('web3Stake', 'claimReward', []);
}

async function runUnstake() {
  await SEND_TX('web3Stake', 'unstake', []);
}

async function runEmerUnstake() {
  await SEND_TX('web3Stake', 'emergencyUnstake', []);
}






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