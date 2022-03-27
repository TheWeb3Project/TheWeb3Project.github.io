

const slideTrack = select('#slide-track')[0];

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
}



try {
    var openBoxModal = document.getElementById('openBoxModal');
    if (openBoxModal != null) {
        openBoxModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget
            var purpose = button.getAttribute('data-bs-whatever');
            //console.log(purpose);
            if(purpose == "forMysteryBox") {
                openBoxModal.querySelector("#forMysteryBtn").style.display = "flex"
                openBoxModal.querySelector("#forCreateAvatarBtn").style.display = "none"
            }
            else {
                openBoxModal.querySelector("#forMysteryBtn").style.display = "none"
                openBoxModal.querySelector("#forCreateAvatarBtn").style.display = "flex"
            }

            // openBoxModal.querySelector('#modal-body-video video').play();
        })
    }
}
catch(err) {
    console.log(err);
}

try {
    var connectWalletModal = document.getElementById('connectWalletModal');
    if (connectWalletModal != null) {
        connectWalletModal.addEventListener('show.bs.modal', function (event) {
            connectWalletModal.querySelector('#modal-body-text').classList.add('d-none');
            connectWalletModal.querySelector('#modal-body-video').classList.remove('d-none');     
            connectWalletModal.querySelector('#modal-body-video video').play();
            setTimeout(function() {
                connectWalletModal.querySelector('#modal-body-video').classList.add('d-none');
                connectWalletModal.querySelector('#modal-body-text').classList.remove('d-none');
            }, 1200);
        });
    }
}
catch(err) {
    console.log(err);
}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))

var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

try {
    let owl = $('.owl-carousel');
    if (0 < owl.length) {
        $('.owl-carousel').owlCarousel({
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
                }
            }
        });
    }
}
catch(err) {
    console.log(err);
}

function toggleBtnTab() {
    $('.toggleBtnTab').toggleClass('text-primary bg-white');
}

function changeCount(state) {
    let num = parseInt(document.getElementById("number").innerHTML);
    
    if(state == "add") {
        document.getElementById("number").innerHTML = num + 1;
    }
    else {
        if(num > 0) {
            document.getElementById("number").innerHTML = num - 1;
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
        imgs = document.querySelectorAll('.output-img img');
        /* imgs.reverse(); */
        // console.log(imgs);

        imgsSrc = [];
        imgs.forEach(element => {
            imgsSrc.push(element.src);
        });

        // console.log(imgsSrc);

        /* mergeImages(imgsSrc)
        .then(b64 => document.querySelector('img#combined-output-img').src = b64); */

        let resEle = document.querySelector("canvas#combined-output-img");
        if (resEle != null) {
            setTimeout(function() {
                var context = resEle.getContext("2d");
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
    
    element = document.getElementById("combined-output-img");
    html2canvas(element).then(function(canvas) {
        saveCapture(canvas.toDataURL("image/png"));
    })
}
  
function saveCapture(url) {
    var a = $("<a style='display:none' id='js-downloder'>")
    .attr("href", url)
    .attr("download", "test.png")
    .appendTo("body");
  
    a[0].click();
  
    a.remove();
}


console.log(document.querySelectorAll('.output-img img'));
showOutputImage();
setTimeout(showOutputImage, 3000);