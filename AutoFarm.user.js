// ==UserScript==
// @name           Auto Farm in LA
// @author         Unknown
// @description    Edited by Meg
// @include  	   https*screen=am_farm*
// @version        1.0

// ==/UserScript==

var refreshPage = false;
var tempo = 0;
var x = 0;
var minhaVar = "";
var removeUnderAttack = false;
var menu = $("#am_widget_Farm a.farm_icon_a");

var underAttack = $(menu).parent().parent().find("img.tooltip").length + "000";

if (removeUnderAttack == true) {
  $("img").each(function () {
    var tempStr = $(this).attr("src");
    if (tempStr.indexOf("attack") != -1) {
      $(this).addClass("tooltip");
    }
  });
}
if (refreshPage == true) {
  setInterval(function () {
    window.location.reload();
  }, 60000);
}

console.log(
  "Ja existe " +
    underAttack.substring(0, underAttack.length - 3) +
    " aldeia com ataque."
);

var altAldTempo =
  parseInt($("#am_widget_Farm a.farm_icon_a").length + "00") -
  parseInt(underAttack);
console.log("Resta " + altAldTempo + " aldeias para Atacar.");

if (altAldTempo == "0") {
  var altAldTempo = aleatorio(100, 200);
} else {
  var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(1000, 1500));
}

console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");

function aleatorio(inferior, superior) {
  numPosibilidades = superior - inferior;
  aleat = Math.random() * numPosibilidades;
  return Math.round(parseInt(inferior) + aleat);
}

for (i = 0; i < 100; i++) {
  $(menu)
    .eq(i)
    .each(function () {
      if (!$(this).parent().parent().find("img.tooltip").length) {
        var tempoAgora = tempo * ++x - aleatorio(160, 320);
        setTimeout(
          function (minhaVar) {
            $(minhaVar).click();
          },
          tempoAgora,
          this
        );
      }
    });
}

// function nextPage() {
//   $("");
// }

function swapVillage() {
  $(".arrowRight").click();
  $(".groupRight").click();
}

setInterval(swapVillage, altAldTempo);
