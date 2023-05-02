// ==UserScript==
// @name           Auto Farming 2.0
// @description    Use this script on the Loot Assistant screen
// @author         Megalodon
// @include        https://www.**.tribalwars.com.br/**screen=am_farm**
// @version        2.0
// ==/UserScript==

// Set interval to refresh the page
var refreshPage = true;

var tempo = 0;
var x = 0;
var minhaVar = "";

// Set whether to remove already attacked villages
var removeAttackedVillages = false;

// Button A
var menu = $('#am_widget_Farm a.farm_icon_a');

if (removeAttackedVillages == true) {
    $('img').each(function () {
        var tempStr = $(this).attr('src');
        if (tempStr.indexOf('attack') != -1) {
            $(this).addClass('tooltip')
        }
    });
}

if (refreshPage == true) {
    setInterval(
        function () {
            window.location.reload();
        }, 60000);
}

var jaEnviados = $(menu).parent().parent().find('img.tooltip').length + "000";
console.log("Ja existe " + jaEnviados.substring(0, (jaEnviados.length - 3)) + " aldeia com ataque.");

var timeSwitchVillage = parseInt($('#am_widget_Farm a.farm_icon_a').length + "00") - parseInt(jaEnviados);
console.log("Resta " + timeSwitchVillage + " aldeias para Atacar.");

if (timeSwitchVillage == "0") {
    var timeSwitchVillage = aleatorio(100, 200);
} else {
    var timeSwitchVillage = parseInt(timeSwitchVillage) + parseInt(aleatorio(1000, 1500));
}
console.log("Resta " + timeSwitchVillage + " milesegundos para alternar a aldeia.");

function aleatorio(inferior, superior) {
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    return Math.round(parseInt(inferior) + aleat)
}



for (i = 0; i < 100; i++) {
    $(menu).eq(i).each(function () {
        if (!($(this).parent().parent().find('img.tooltip').length)) {
            var timeNow = (tempo * ++x) - aleatorio(160, 320);
            setTimeout(function (minhaVar) {
                $(minhaVar).click();
            }, timeNow, this);
        }
    })
}

function switchVillage() {
    $('.arrowRight').click();
    $('.groupRight').click();
}

setInterval(switchVillage, timeSwitchVillage);

// ---------------------------------------------------------------------------------------------------------------------------- Brake code ----------------------------------------------------------------------------------------------------------------------------