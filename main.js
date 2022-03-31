'use strict'


const GENDERS = ['female', 'male'];
const PARTS = ['bg', 'wings', 'skin', 'eyes', 'dress', 'mask', 'hair', 'horn', 'wig'];
const SHORTGRADES = {'c': 'common', 'r': 'rare', 'e': 'epic', 'l': 'legendary'};
const GRADES = Object.values(SHORTGRADES);
const ITEMGRADES = {
    'female': {
        'bg': ['c', 'l', 'c', 'c', 'r', 'r'],
        'wings': [],
        'skin': ['c', 'c', 'c', 'c', 'c', 'c'],
        'eyes': ['r', 'c', 'r', 'r'],
        'dress': ['e', 'e', 'e', 'e'],
        'mask': ['c', 'e', 'c', 'c', 'c'],
        'hair': ['e', 'r', 'e', 'e', 'r'],
        'horn': ['l', 'l'],
        'wig': [],
    },
    'male': {
        'bg': ['c', 'c', 'r', 'c', 'r', 'c'],
        'wings': ['l'],
        'skin': ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
        'eyes': ['c', 'r', 'r', 'e'],
        'dress': ['e', 'e', 'e'],
        'mask': ['c', 'l', 'c', 'r'],
        'hair': ['r', 'l', 'r', 'r'],
		'horn': ['e', 'e', 'e', 'e'],
        'wig': ['l'],
    }
}

const ITEMINFOS = [];
for (const [idx, gender] of Object.entries(GENDERS)) {
    for (const [idy, part] of Object.entries(PARTS)) {
        if (!(gender in ITEMGRADES)) {
            continue;
        }
        if (!(part in ITEMGRADES[gender])) {
            continue;
        }
        for (var idz = 0; idz < ITEMGRADES[gender][part].length; idz++) {
			let itemImgPath = `${gender}-${part}-${idz+1}-t.png`;
			let gradeKey = ITEMGRADES[gender][part][idz];
            ITEMINFOS.push([itemImgPath, SHORTGRADES[gradeKey]]);
        }
    }
}


function getItemCard(itemInfo) {
	let imgFileName = itemInfo[0];
    let [gender, part, num, _] = imgFileName.split('-');
    let imgName = part;
    let grade = itemInfo[1];

    let htmlStr = `<div class="card clip-corners text-white"> \
        <img src="images/${imgFileName}" class="card-img" alt="..."> \
        <div class="card-img-overlay bg-blur mt-auto" style="height: 32%; background-color: rgba(0, 0, 0, 0.42);"> \
        <div class="d-flex flex-column align-items-center justify-content-center h-100 w-100"> \
        <h2 class="d-flex align-items-center"> \
        ${imgName} \
        <span id="${grade}-stars" class="d-flex"></span> \
        </h2> \
        <span id="${grade}-stat"></span> \
        </div> \
        </div> \
        </div>
        `;
    
    return htmlStr;
}

const PERCENTAGES = ['80%', '8%', '0.8%', '0.1%'];


function displayAll() {
    let elms;
    for (const [idy, grade] of Object.entries(GRADES)) {
        elms = select(`#${grade}-stars`, true);
        for (const elm of elms) {
            let htmlStr = '';
            for (var idx = 0; idx < INT(idy) + 1; idx++) {
                htmlStr += `<img src='images/star.png' alt='star'></img>`;    
            }
            elm.innerHTML = htmlStr;
        }

        elms = select(`#${grade}-stat`, true);
        let tags = `bg-${grade} fw-bold px-4 py-2 rounded-pill me-3`.split(' ');
        for (const elm of elms) {
            for (const tag of tags) {
                elm.classList.add(tag);
            }
            elm.setAttribute('data-bs-toggle', 'tooltip');
            elm.setAttribute('data-bs-html', true);
            let tooltipStr = `Drop Rate <br/> \
            ${PERCENTAGES[idy]} <span id='${grade}-bonus' class='text-error'>+0%</span>`;
            elm.setAttribute('title', tooltipStr);
            let htmlStr = `${grade}`;
            elm.innerHTML = htmlStr;
        }
    }
	
    let descStr = ` \
    By holding each 1% of total supply, <br/> \
    -10% to common, <br/> \
	+9% to rare, <br/> \
    +0.9% to epic, <br/> \
    +0.1% to legendary, <br/> \
    `;
    select('#rateDesc').setAttribute('title', descStr);
}

$(document).ready(function () {  

    const slideTrack = select('#slide-track');

    for (var idx = 0; idx < 8; idx++) {
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img');
                img.src = "images/star-icon.png";
                img.alt = "";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img', null, 'img-fluid');
                img.src = "images/mystery-box-sm.png";
                img.alt = "mystery-box";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let img = makeElem('img');
                img.src = "images/star-icon.png";
                img.alt = "";
                div.append(img);
            }
            slideTrack.append(div);
        }
        {
            let div = makeElem('div', '', 'slide');
            {
                let span = makeElem('span', null, 'text-uppercase text-info');
                span.innerHTML = "Mystery Box";
                div.append(span);
            }
            slideTrack.append(div);
        }
    }
    runScroll();
    displayAll();
});


function getSpinHtml() {
    return `<div class="spinner-border mx-2" role="status"></div>`;
}

// if click, run transaction while viewing loading
// if done, show result based on the things got
async function purchaseBox(boxCount) {
    select('#connectWalletStatus').innerHTML = "Confirm in dapp";
    select('#connectWalletStatus').innerHTML += getSpinHtml();
    let [res, data] = await SEND_TX('web3', 'manualRebase', []);
    if (res == true) {
        select('#connectWalletStatus').innerHTML = "User Rejected";
        return;
    }
    let result = data;
    select('#connectWalletStatus').innerHTML = "Waiting for result";
    select('#connectWalletStatus').innerHTML += getSpinHtml();
    let txResult = await result.wait();
	
    // txResult['events']
    console.log(txResult['events']);

    const acheived = select('#acheived');
    for (const [idy, itemInfo] of Object.entries(ITEMINFOS.slice(0, boxCount))) {
        let div = makeElem('div', null, 'col my-4');

        let htmlStr = getItemCard(itemInfo);
        div.innerHTML = htmlStr;
        acheived.append(div);
    }
    runScroll();
    displayAll();
    select('#purchaseBoxModal').classList.add('show');
    select('#showResult').click();
}




try {
    let connectWalletModal = select('#connectWalletModal');
    let forMysteryBtn = select("#forMysteryBtn");

    connectWalletModal.addEventListener('show.bs.modal', async function (event) {
        let button = event.relatedTarget;

        let boxCount = INT(select('#boxCount').innerHTML);
		
        let cost;
        if (targetCurrency == 'BNB') {
            cost = 10 / bnbPrice * boxCount;
        } else {
            cost = 10 / price * boxCount;
        }
        cost = ROUND(cost, 5);
        select('#showDetails').innerHTML = `Cost: ${cost} ${targetCurrency}`; // blockchain cost check

        

        async function setPurchaseBox() {
            select('#connectWalletStatus').innerHTML = `Purchase ${boxCount} Box`;
            select('#forMysteryBtn').onclick = async () => { await purchaseBox(boxCount); };
        }

        await getCurAdr();
        if (CURADR == null) {
            select('#forMysteryBtn').onclick = async () => { await conn(setPurchaseBox); };
        } else {
            await setPurchaseBox();
        }

        
    });

    

    let purchaseBoxModal = select('#purchaseBoxModal');
    purchaseBoxModal.addEventListener('show.bs.modal', function (event) {
        purchaseBoxModal.querySelector('#modal-body-text').classList.add('d-none');
        purchaseBoxModal.querySelector('#modal-body-video').classList.remove('d-none');     
        purchaseBoxModal.querySelector('#modal-body-video video').play();
        setTimeout(function() {
            purchaseBoxModal.querySelector('#modal-body-video').classList.add('d-none');
            purchaseBoxModal.querySelector('#modal-body-text').classList.remove('d-none');
        }, 3000);
    });
}
catch(err) {
    console.log(err);
}


const carousel = select('#carousel');
    for (const [idy, itemInfo] of Object.entries(ITEMINFOS)) {
        let div = makeElem('div', null, 'item col-12 mt-4 mb-4');

        let htmlStr = getItemCard(itemInfo);

        div.innerHTML = htmlStr;
        carousel.append(div);
    }
    runScroll();
    displayAll();

let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))

let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

function runScroll() {
    let owl = $('.owl-carousel');
    if (owl.length == 0) {
        return;
    }
        owl.owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            navText: ["<div class='nav-button owl-prev'><img src='images/arrow-left.png' alt='' /></div>", "<div class='nav-button owl-next'><img src='images/arrow-right.png' alt='' /></div>"],
            autoplay: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1200: {
                    items: 5
                },
            }
        });
}

let targetCurrency = '$WEB3';
function toggleBtnTab() {
    $('.toggleBtnTab').toggleClass('text-primary bg-white');
    if (targetCurrency == 'BNB') {
        targetCurrency = '$WEB3';
    } else {
        targetCurrency = 'BNB';
    }
}



function displayAvatarPage() {
    let sidebar = select('#sidebar');
    // sidebar.innerHTML = '';
    for (const [idx, part] of Object.entries(PARTS)) {
        let htmlStr = ` \
        <button class="btn p-0 my-1" id="v-pills-${part}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-${part}" type="button" role="tab" aria-controls="v-pills-${part}" aria-selected="false"> \
            <img src="images/${part}-option.png" alt="${part}-option" /> \
        </button> \
        `;
        sidebar.innerHTML += htmlStr;
    }
    select('#v-pills-bg-tab').classList.add("active");
    select('#v-pills-bg-tab').setAttribute('aria-selected', "true");
	
    let itemList = select('#item-list');
    itemList.innerHTML = '';
    for (const [idx, part] of Object.entries(PARTS)) {
		let htmlStr = ` \
        <div class="tab-pane fade" id="v-pills-${part}" role="tabpanel" aria-labelledby="v-pills-${part}-tab"> \
        <div id="items-${part}" class="row"> \
        </div> \
        </div> \
        `;
        itemList.innerHTML += htmlStr;
    }
	select('#v-pills-bg').classList.add('show');
    select('#v-pills-bg').classList.add('active');

    for (const [idx, part] of Object.entries(PARTS)) {
        let itemPart = select(`#items-${part}`);
        for (var idy = 0; idy < ITEMGRADES['male'][part].length; idy++) {
			let htmlStr = ` \
        	<div class="col-auto mb-4"> \
			<button id="male-${part}-${idy+1}.png" type="button" class="btn btn-secondary option-btn p-0 tooltip-custom" onclick="changeBg(this.id)"> \
        	<img src="images/male-${part}-${idy+1}-t.png" alt="male-${part}-${idy+1}.png" class="img-fluid rounded-1" /> \
        	<span class="tooltiptext-custom py-3 px-2"> \
        	<span class="bg-grey small fw-bold px-3 py-2 rounded-pill"> \
        	Tax reduction (+x%) \
        	</span> \
        	</span> \
   	 		</button> \
        	</div>`;
        	itemPart.innerHTML += htmlStr;
        }
        for (var idy =  ITEMGRADES['male'][part].length; idy < 8; idy++) {
			let htmlStr = ` \
        	<div class="col-auto mb-4"> \
			<button type="button" class="btn btn-secondary option-btn p-0 pe-none"> \
        	<img src="images/locked.png" alt="" class="img-fluid rounded-1" /> \
   	 		</button> \
        	</div>`;
        	itemPart.innerHTML += htmlStr;
        }
    }

    let tabContent = select('#v-pills-tabContent');
    tabContent.innerHTML = '';
    for (const [idx, part] of Object.entries(PARTS)) {
		let htmlStr = ` \
        <div class="tab-pane fade" id="v-pills-${part}-sm" role="tabpanel" aria-labelledby="v-pills-${part}-sm-tab"> \
        <div id="items-d-${part}" class="d-flex"> \
        </div> \
        </div> \
        `;
        tabContent.innerHTML += htmlStr;
    }
	select('#v-pills-bg').classList.add('show');
    select('#v-pills-bg').classList.add('active');


    let itemPart = select(`#items-d-${part}`);
    for (var idy = 0; idy < ITEMGRADES['male'][part].length; idy++) {
        let htmlStr = ` \
        	<div class="col-auto mb-4"> \
			<button id="male-${part}-${idy+1}.png" type="button" class="btn btn-secondary option-btn p-0 tooltip-custom" onclick="changeBg(this.id)"> \
        	<img src="images/male-${part}-${idy+1}-t.png" alt="male-${part}-${idy+1}.png" class="img-fluid rounded-1" /> \
        	<span class="tooltiptext-custom py-3 px-2"> \
        	<span class="bg-grey small fw-bold px-3 py-2 rounded-pill"> \
        	Tax reduction (+x%) \
        	</span> \
        	</span> \
   	 		</button> \
        	</div>`;
        	itemPart.innerHTML += htmlStr;
    }	


}
displayAvatarPage();




function changeCount(state) {
    let num = parseInt(document.getElementById("boxCount").innerHTML);
    
    if(state == "add") {
        document.getElementById("boxCount").innerHTML = num + 1;
    }
    else {
        if(num > 0) {
            document.getElementById("boxCount").innerHTML = num - 1;
        }
    }
}

function changeBg(img_url) {
    img_url = "images/" + img_url;
    console.log("changeBg", img_url);
    document.getElementById("bg-output").setAttribute('src', img_url);
    showOutputImage();
}

function changeWings(img_url) {
    img_url = "images/" + img_url;
    console.log("changeWings", img_url);
    document.getElementById("wings-output").setAttribute('src', img_url);
    showOutputImage();
}

function changeSkin(img_url) {
    img_url = "images/" + img_url;
    console.log("changeSkin", img_url);
    document.getElementById("skin-output").setAttribute('src', img_url);
    showOutputImage();
}

function changeEyes(img_url) {
    img_url = "images/" + img_url;
    console.log("changeEyes", img_url);
    document.getElementById("eyes-output").setAttribute('src', img_url);
    showOutputImage();

}

function changeDress(img_url) {
    img_url = "images/" + img_url;
    console.log("changeDress", img_url);
    document.getElementById("dress-output").setAttribute('src', img_url);
    showOutputImage();
    
}

function changeMask(img_url) {
    img_url = "images/" + img_url;
    console.log("changeMask", img_url);
    document.getElementById("mask-output").setAttribute('src', img_url);
    showOutputImage();
    
}

function changeHair(img_url) {
    img_url = "images/" + img_url;
    console.log("changeHair", img_url);
    document.getElementById("hair-output").setAttribute('src', img_url);
    showOutputImage();
    
}

function changeHorn(img_url) {
    img_url = "images/" + img_url;
    console.log("changeHorn", img_url);
    document.getElementById("horn-output").setAttribute('src', img_url);
    showOutputImage();
    
}

function changeWig(img_url) {
    img_url = "images/" + img_url;
    console.log("changeWig", img_url);
    document.getElementById("wig-output").setAttribute('src', img_url);
    showOutputImage();   
}

function showOutputImage() {
    try {
        let imgs = document.querySelectorAll('.output-img img');
        /* imgs.reverse(); */
        // console.log(imgs);

        let imgsSrc = [];
        imgs.forEach(element => {
            imgsSrc.push(element.src);
        });

        // console.log(imgsSrc);

        /* mergeImages(imgsSrc)
        .then(b64 => document.querySelector('img#combined-output-img').src = b64); */

        let resEle = document.querySelector("canvas#combined-output-img");
        if (resEle != null) {
            setTimeout(function() {
                let context = resEle.getContext("2d");
                resEle.width = imgs[0].width;
                resEle.height = imgs[0].height;
                context.drawImage(imgs[8], 0, 0);
                context.drawImage(imgs[7], 0, 0);
                context.drawImage(imgs[6], 0, 0);
                context.drawImage(imgs[5], 0, 0);
                context.drawImage(imgs[4], 0, 0);
                context.drawImage(imgs[3], 0, 0);
                context.drawImage(imgs[2], 0, 0);
                context.drawImage(imgs[1], 0, 0);
                context.drawImage(imgs[0], 0, 0);
            }, 100);
        }
    }
    catch(e) {
        console.log(e);
    }
}

function download(){
    /* var canvas = document.getElementById("combined-output-img");
    image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    link.click(); */
    
    let element = document.getElementById("combined-output-img");
    html2canvas(element).then(function(canvas) {
        saveCapture(canvas.toDataURL("image/png"));
    })
}
  
function saveCapture(url) {
    let a = $("<a style='display:none' id='js-downloder'>")
    .attr("href", url)
    .attr("download", "test.png")
    .appendTo("body");
  
    a[0].click();
  
    a.remove();
}


console.log(document.querySelectorAll('.output-img img'));
showOutputImage();
setTimeout(showOutputImage, 3000);

$(".modal").on("shown.bs.modal", function () {
    if ($(".modal-backdrop").length > 1) {
        $(".modal-backdrop").not(':first').remove();
    }
})

$(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  })

  let bnbPrice;
  let price;
  (async () => {
    // do global
    select('#connect').onclick = async () => { await conn(); };

    bnbPrice = 1 / (await getPrice('busd'));

    let liqReserves = await CONTS['pairweb3'].getReserves();
    let liqBnb = liqReserves[1] / BNBDIV; 

    let liqWeb3 = liqReserves[0] / BNBDIV;
    let liqRate = liqBnb / liqWeb3;
    price = liqRate * bnbPrice;
  })();