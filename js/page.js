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

async function runGlobal() {
  select('#connect').onclick = async () => { await conn(); };

  bnbPrice = 1 / (await getPrice('busd'));

  let totalSupply = await CONTS['web3'].totalSupply();
  totalSupply = totalSupply / BNBDIV;
  
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
async function doAfterConnect() {
  displayText('#connect', SHORTADR(CURADR));

  balance = await CONTS['web3'].balanceOf(CURADR);
  balance = balance / BNBDIV;

  displayText("#balance", `${COMMA(INT(balance, 3))}`);
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

  let dailyRate = 0.004908;
  let totalRate = ((1 + dailyRate) ** days);      
  let futAmount = INT(curAmount * totalRate, 3);
  select('#futAmount').value = futAmount;
  
  let futPrice;
  if (target == 'futPrice') {
    futPrice = curTarget.value;
  } else {
    let dailyPriceRate = 0.01801636;
    let totalPriceRate = ((1 + dailyPriceRate) ** days);
    futPrice = INT(curPrice * totalPriceRate, 3);
    select('#futPrice').value = futPrice;
  }

  let futInvest = futAmount * futPrice;

  displayText("#futWealth", `$${COMMA(INT(futInvest, 3))}`);

  displayText("#rewardsEsti", `${COMMA(INT(futAmount - curAmount, 3))}`);

  displayText("#potenReturn", `$${COMMA(INT(futInvest - initInvest, 3))}`);

  displayText("#spaceTravel", `${COMMA(INT(futInvest / 250000))}`);
}