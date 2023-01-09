
let imgID = '';
let elemHeight = 0;
let elemWidth = 0

function takeScreenShot(id,hwID) {
  imgID = id
  $("#"+imgID)[0].style.display = 'block';
  let myimg = $("#"+imgID)[0];
  console.log(hwID);
   elemHeight = $("#"+hwID)[0].clientHeight;
   elemWidth = $("#"+hwID)[0].clientWidth;

  domtoimage.toBlob(myimg, {
    height: elemHeight, 
    width: elemWidth
  })
    .then(dataUrl => {
      domtoimage
        .toBlob(myimg, {
          height: elemHeight,
          width: elemWidth
        })
        .then(dataUrl2 => {
          console.log("dataUrl2", dataUrl2);
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl2);
          reader.onloadend = function () {
            var base64data = reader.result;
            document.getElementById("dataimg").src = base64data;        

          }

        });
    });
}

function imgCopyAndDownload() {
  let scnImgWidth = $(window).width();
  if (scnImgWidth <= 770) {
    let myimg = $("#"+imgID)[0];

    domtoimage.toBlob(myimg, {
      height: elemHeight,
      width: elemWidth
    })
      .then(dataUrl => {
        console.log("dataUrl",dataUrl);
        var reader = new FileReader();
        reader.readAsDataURL(dataUrl);
        reader.onloadend = function () {
          var base64data = reader.result;
          const linkSource = `${base64data}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = "twep.jpeg";
          downloadLink.click();
        }
  
      });
  }
  else {
  let myimg = $("#"+imgID)[0];
  domtoimage.toBlob(myimg, {
    height: elemHeight,
    width: elemWidth
  })
    .then(dataUrl => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': dataUrl
        })
      ]);

    });
  }
}

function clearModalData() {
  document.getElementById("dataimg").src = '';
  $("#"+imgID)[0].style.display = 'none';
}

function onChangeMenu(fileName) {
  let url = window.location.href='/'+fileName+'.html';

}

function show() {
  const isHidden = $("#cont")[0].hidden;
  if(isHidden) {
    $("#legacy").addClass("tab-active background-box1");
    $("#cont")[0].hidden = false
  }else {
    $("#legacy").removeClass("tab-active background-box1");
    $("#cont")[0].hidden = true
  }
  

}

function executefunction() {
  var checkboxValue = document.getElementById("hm-burg").checked;
  var side = document.querySelector(".side-nav");
  $(document).ready(function () {
    if (checkboxValue == true) {
      $("#nav").addClass("side-bar");
      $(".body").addClass("longscroll");
      side.classList.add("h-set");
    } else {
      $("#nav").removeClass("side-bar");
      $(".body").removeClass("longscroll");
      side.classList.remove("h-set");
    }
  });
}

$(document).ready(function () {
  let scnWidth = $(window).width();
  if (scnWidth <=680) {
    $('.CopyToImg').html('Download');
  }
  else {
    $('.CopyToImg').html('Copy');
  }
});

$(document).ready(function () {
  $('.allmaindiv').hide();
  $('.shareImg').click(function () {
    $('.allmaindiv').show(100);
    $(".body").addClass("longscroll");
  });
  $('.close-circle').click(function () {
    $('.allmaindiv').hide();
    $(".body").removeClass("longscroll");
  });

});

function turnOnfunction() {
  var checkTurnMsg = document.getElementById("turnon").checked;
  $(document).ready(function () {
    if (checkTurnMsg == true) {
      $('.turnmsg').html("Turn off alerts")
    } else {
      $('.turnmsg').html("Turn on alerts")
    }
  });
}

$(document).ready(function () {
  $(".imp-copy").click(function () {
    let scnWidth = $(window).width();
    let top = $(this).offset().top;
    let left = $(this).offset().left;
    // for desktop view 
    $(".clipboard").css({
      height: "30px",
      width: "150px",
      left: left + -115,
      top: top + -44,
      display: "block",
    });
    // for mobile view 
    if (scnWidth <= 421) {
      $(".clipboard").css({
        height: "30px",
        width: "150px",
        left: left + -118,
        top: top + -44,
        display: "block",
      });
    }
    setTimeout(function () {
      $('.clipboard').css({
        display: "none",
      })
    }, 1000)
  })
  $(".imp-copy1").click(function () {
    let top = $(this).offset().top;
    let left = $(this).offset().left;
    $(".clipboard").css({
      height: "30px",
      width: "150px",
      left: left + -122,
      top: top + -44,
      display: "block",
    });
    setTimeout(function () {
      $('.clipboard').css({
        display: "none",
      })
    }, 1000)
  })

  $(".btnLoadAnimation").click(function () {
    let textVal = $(this).html();
    $(this).html("<i class='loading-ico'></i>");
    let thisl = this;
    setTimeout(function () {
      $(thisl).html(textVal);
    }, 4000)
  });

});

$(document).ready(function () {
 
  $(".wr-tabs .wr-tab-ul .wr-tab-li").click(function () {
    var tab_id = $(this).attr("data-tab");
    $(".wr-tabs .wr-tab-ul .wr-tab-li").removeClass("wr-tab-active");
    $(".wr-tabs-main .wr-content").removeClass("wr-tab-active");
    $(this).addClass("wr-tab-active");
    $("#" + tab_id).addClass("wr-tab-active");
  });

  $(".wusd-right .wusd-tabs .wusd-tab-ul .wusd-tab-li").click(function () {
    var tab_id = $(this).attr("data-tab");
    $(".wusd-right .wusd-tabs .wusd-tab-ul .wusd-tab-li").removeClass(
      "wusd-tab-active"
    );
    $(".wusd-right .wusd-content").removeClass("wusd-tab-active");
    $(this).addClass("wusd-tab-active");
    $("#" + tab_id).addClass("wusd-tab-active");
  });
});

$(document).ready(function () {
  let screenWidth = $(window).width();
  if (screenWidth > 1920) {
    $(".side-nav").css("position", "absolute");
  } else if (screenWidth <= 1100) {
    $(".side-nav").css("position", "absolute");
  } else {
    $(".side-nav").css("position", "fixed");
  }
  if (screenWidth <= 770 && screenWidth >= 310) {
    $(".mobToolTip").click(function () {
      let rightPos = $(this).attr("position");
      if (rightPos != 'right') {
        $('.tooltipdiv').toggle();
      }
      else {
        $('.tooltipdiv1').toggle();
      }

    })
  }

  $(".tooltip").hover(
    function () {
      let val = $(this).attr("tooltip-data");
      let rightPosition = $(this).attr("position");

      let top = $(this).offset().top;
      let left = $(this).offset().left;

      if (screenWidth <= 770 && screenWidth >= 600) {

        $(".tooltipdiv").css({
          width: "150px",
          left: left - 70,
          top: top + 28,
        });
      }
      else if (screenWidth <= 599 && screenWidth >= 520) {

        $(".tooltipdiv").css({
          width: "120px",
          left: left - 55,
          top: top + 28,
        });
      }
      else if (screenWidth <= 519 && screenWidth >= 300 && rightPosition != 'right') {
        $(".tooltipdiv").css({
          width: "150px",
          left: left - 70,
          top: top + 25,
        });
      }
      else if (screenWidth <= 519 && screenWidth >= 300 && rightPosition == 'right') {
        $(".tooltipdiv1").css({
          width: "130px",
          left: left - 101,
          top: top + 25,
        });
      }
      else if (val.length < 150) {
        $('.tooltipdiv').show();
        $(".tooltipdiv").css({
          width: "150px",
          left: left - 69,
          top: top + 28,

        });
      } else if (val.length > 150 && val.length < 250) {

        $('.tooltipdiv').show();
        $(".tooltipdiv").css({
          width: "350px",
          left: left - 162,
          top: top + 28,
        });

      }

      $(".tooltipdiv").text(val);
      $(".tooltipdiv1").text(val);
    },
    function () {
      $('.tooltipdiv').hide();
      $('.tooltipdiv1').hide();
    }
  );
});






