'use strict'

function displaySidebar() {
    htmlStr = `
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
            <li class="mb-4 py-2 px-5 rounded-pill active">
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