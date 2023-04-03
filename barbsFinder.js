/*
 * Script Name: Barbs Finder
 * Version: v1.5.5
 * Last Updated: 2022-04-06
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: RedAlert#9859 (Discord)
 * Approved: t13981993
 * Approved Date: 2020-05-27
 * Mod: JawJaw
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// CONSTANTS
var VILLAGE_TIME = 'mapVillageTime'; // localStorage key name
var VILLAGES_LIST = 'mapVillagesList'; // localStorage key name
var TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour

// Globals
var villages = [];
var barbarians = [];

// Translations
var translations = {
    en_DK: {
        'Barbs Finder': 'Barbs Finder',
        'Min Points:': 'Min Points:',
        'Max Points:': 'Max Points:',
        'Radius:': 'Radius:',
        'Barbs found:': 'Barbs found:',
        'Coordinates:': 'Coordinates:',
        'Error while fetching "village.txt"!':
            'Error while fetching "village.txt"!',
        Coords: 'Coords',
        Points: 'Points',
        'Dist.': 'Dist.',
        Attack: 'Attack',
        Filter: 'Filter',
        Reset: 'Reset',
        'No barbarian villages found!': 'No barbarian villages found!',
        'Current Village:': 'Current Village:',
        'Sequential Scout Script:': 'Sequential Scout Script:',
        Help: 'Help',
    },
    pt_BR: {
        'Barbs Finder': 'Localizador de Bárbaras',
        'Min. Points:': 'Mín. pontos:',
        'Max. Points:': 'Máx. pontos:',
        'Radius:': 'Campo:',
        'Barbs found:': 'Bárbaras encontradas:',
        'Coordinates:': 'Coordenadas:',
        'Error while fetching "village.txt"!':
            'Erro ao procurar "village.txt"!',
        Coords: 'Coords',
        Points: 'Pontos',
        'Dist.': 'Distância',
        Attack: 'Ataque',
        Filter: 'Filtro',
        Reset: 'Resetar',
        'No barbarian villages found!': 'Não foram encontradas bárbaras!',
        'Current Village:': 'Aldeia Atual:',
        'Sequential Scout Script:': 'Script de Exploração Sequencial:',
        Help: 'Ajuda',
    },
};

// Init Debug
initDebug();

// Auto-update localStorage villages list
if (localStorage.getItem(TIME_INTERVAL) != null) {
    var mapVillageTime = parseInt(localStorage.getItem(VILLAGE_TIME));
    if (Date.parse(new Date()) >= mapVillageTime + TIME_INTERVAL) {
        // hour has passed, refetch village.txt
        fetchVillagesData();
    } else {
        // hour has not passed, work with village list from localStorage
        var data = localStorage.getItem(VILLAGES_LIST);
        villages = CSVToArray(data);
        init();
    }
} else {
    // Fetch village.txt
    fetchVillagesData();
}

// Fetch 'village.txt' file
function fetchVillagesData() {
    $.get('map/village.txt', function (data) {
        villages = CSVToArray(data);
        localStorage.setItem(VILLAGE_TIME, Date.parse(new Date()));
        localStorage.setItem(VILLAGES_LIST, data);
    })
        .done(function () {
            init();
        })
        .fail(function (error) {
            console.error(`${scriptInfo()} Error:`, error);
            UI.ErrorMessage(
                `${tt('Error while fetching "village.txt"!')}`,
                4000
            );
        });
}

// Initialize Script
function init() {
    // Filter out only Barbarian villages
    findBarbarianVillages();
    // Show popup
    var content = `
		<div class="ra-popup-content">
			<div class="ra-mb15">
				<label for="raCurrentVillage">${tt('Current Village:')}</label>
				<input type="text" id="raCurrentVillage" value="${game_data.village.coord}">
			</div>
			<div class="ra-flex ra-mb10">
				<div class="ra-flex-4">
					<label for="minPoints">${tt('Min Points:')}</label>
					<input type="text" id="minPoints" value="26">
				</div>
				<div class="ra-flex-4">
					<label for="maxPoints">${tt('Max Points:')}</label>
					<input type="text" id="maxPoints" value="12154">
				</div>
				<div class="ra-flex-4">
					<label for="radius">${tt('Radius:')}</label>
					<select id="radius_choser">
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="30">30</option>
						<option value="40">40</option>
						<option value="50" selected>50</option>
						<option value="60">60</option>
						<option value="70">70</option>
						<option value="80">80</option>
						<option value="90">90</option>
						<option value="100">100</option>
						<option value="110">110</option>
						<option value="120">120</option>
						<option value="130">130</option>
						<option value="140">140</option>
						<option value="150">150</option>
						<option value="999">999</option>
					</select>
				</div>
			</div>
			<a href="javascript:void(0);" onClick="filterBarbs();" class="btn btn-confirm-yes">
				${tt('Filter')}
			</a>
			<a href="javascript:void(0);" onClick="resetFilters();" class="btn btn-confirm-no">
				${tt('Reset')}
			</a>
			<p class="ra-fs12">
				<strong>${tt('Barbs found:')}</strong>
				<span id="barbsCount">0</span>
			</p>
			<div class="ra-mb10">
				<label for="barbCoordsList">${tt('Coordinates:')}</label>
				<textarea id="barbCoordsList" readonly></textarea>
			</div>
			<div class="ra-mb10">
				<label for="barbScoutScript">${tt('Sequential Scout Script:')}</label>
				<textarea id="barbScoutScript" readonly></textarea>
			</div>
			<div id="barbariansTable" style="display:none;max-height:240px;overflow-y:auto;margin-bottom:8px;"></div>
			<div id="noBarbariansFound" style="display:none;">
				<p><strong>${tt('No barbarian villages found!')}</strong>
			</div>
		</div>
	`;

    const popupContent = preparePopupContent(content);
    Dialog.show('content', popupContent);
}

// Populate villages list
function findBarbarianVillages() {
    villages.forEach((village) => {
        if (village[4] == '0') {
            barbarians.push(village);
        }
    });

    if (DEBUG) {
        console.debug(`${scriptInfo()} Barbarian Villages:`, barbarians);
    }
}

// Filter Barbarians
function filterBarbs() {
    var minPoints = parseInt($('#minPoints').val().trim());
    var maxPoints = parseInt($('#maxPoints').val().trim());
    var radius = parseInt($('#radius_choser').val());
    var currentVillage = $('#raCurrentVillage').val().trim();

    if (DEBUG) {
        console.debug(`${scriptInfo()} Current Village:`, currentVillage);
        console.debug(`${scriptInfo()} Minimum Points:`, minPoints);
        console.debug(`${scriptInfo()} Maximum Points:`, maxPoints);
        console.debug(`${scriptInfo()} Radius:`, radius);
    }

    // Filter by min and max points
    const filteredBarbs = barbarians.filter((barbarian) => {
        return barbarian[5] >= minPoints && barbarian[5] <= maxPoints;
    });

    // Filter by radius
    const filteredByRadiusBarbs = filteredBarbs.filter((barbarian) => {
        var barbCoord = barbarian[2] + '|' + barbarian[3];
        var distance = calculateDistance(currentVillage, barbCoord);
        if (distance <= radius) {
            return barbarian;
        }
    });

    updateUI(filteredByRadiusBarbs, currentVillage);
}

// Reset Filters
function resetFilters() {
    $('#minPoints').val(26);
    $('#maxPoints').val(12154);
    $('#radius_choser').val('20');
    $('#barbsCount').text('0');
    $('#barbCoordsList').text('');
    $('#barbScoutScript').val('');
    $('#barbariansTable').hide();
    $('#barbariansTable').html('');
    $('#raCurrentVillage').val(game_data.village.coord);
}

// Update UI
function updateUI(barbs, currentVillage) {
    if (barbs.length > 0) {
        var barbariansCoordsArray = getVillageCoord(barbs);
        var barbariansCount = barbariansCoordsArray.length;
        var barbariansCoordsList = barbariansCoordsArray.join(' ');
        var scoutScript = generateScoutScript(barbariansCoordsList);
        var tableContent = generateBarbariansTable(barbs, currentVillage);

        $('#barbsCount').text(barbariansCount);
        $('#barbCoordsList').text(barbariansCoordsList);
        $('#barbScoutScript').val(scoutScript);
        $('#barbariansTable').show();
        $('#barbariansTable').html(tableContent);
    } else {
        resetFilters();
        $('#noBarbariansFound').fadeIn(200);
        setTimeout(function () {
            $('#noBarbariansFound').fadeOut(200);
        }, 4000);
    }
}

// Generate Table
function generateBarbariansTable(barbs, currentVillage) {
    if (barbs.length < 1) return;

    var barbariansWithDistance = [];

    barbs.forEach((barb) => {
        var barbCoord = barb[2] + '|' + barb[3];
        var distance = calculateDistance(currentVillage, barbCoord);
        barbariansWithDistance.push([...barb, distance]);
    });

    barbariansWithDistance.sort((a, b) => {
        return a[7] - b[7];
    });

    var tableRows = generateTableRows(barbariansWithDistance);

    var tableContent = `
		<table class="vis overview_table ra-table" width="100%">
			<thead>
				<tr>
					<th>
						#
					</th>
					<th>
						K
					</th>
					<th>
						${tt('Coords')}
					</th>
					<th>
						${tt('Points')}
					</td>
					<th>
						${tt('Dist.')}
					</th>
					<th>
						${tt('Attack')}
					</th>
				</tr>
			</thead>
			<tbody>
				${tableRows}
			</tbody>
		</table>
	`;

    return tableContent;
}

// Generate Table Rows
function generateTableRows(barbs) {
    var renderTableRows = '';

    barbs.forEach((barb, index) => {
        index++;
        var continent = barb[3].charAt(0) + barb[2].charAt(0);
        renderTableRows += `
			<tr>
				<td class="ra-tac">
					${index}
				</td>
				<td class="ra-tac">
					${continent}
				</td>
				<td class="ra-tac">
					<a href="game.php?screen=info_village&id=${
                        barb[0]
                    }" target="_blank" rel="noopener noreferrer">
						${barb[2]}|${barb[3]}
					</a>
				</td>
				<td>${formatAsNumber(barb[5])}</td>
				<td class="ra-tac">${barb[7]}</td>
				<td class="ra-tac">
					<a href="/game.php?screen=place&target=${
                        barb[0]
                    }&spy=1" onClick="highlightOpenedCommands(this);" target="_blank" rel="noopener noreferrer" class="btn">
						${tt('Attack')}
					</a>
				</td>
			</tr>
		`;
    });

    return renderTableRows;
}

// Highlight Opened Commands
function highlightOpenedCommands(element) {
    element.classList.add('btn-confirm-yes');
    element.classList.add('btn-already-sent');
    element.parentElement.parentElement.classList.add('already-sent-command');
}

// Helper: Scout Script Generator
function generateScoutScript(barbsList) {
    return `javascript:coords='${barbsList}';var doc=document;if(window.frames.length>0 && window.main!=null)doc=window.main.document;url=doc.URL;if(url.indexOf('screen=place')==-1)alert('Use the script in the rally point page!');coords=coords.split(' ');index=0;farmcookie=document.cookie.match('(^|;) ?farm=([^;]*)(;|$)');if(farmcookie!=null)index=parseInt(farmcookie[2]);if(index>=coords.length)alert('All villages were extracted, now start from the first!');if(index>=coords.length)index=0;coords=coords[index];coords=coords.split('|');index=index+1;cookie_date=new Date(2030,1,1);document.cookie ='farm='+index+';expires='+cookie_date.toGMTString();doc.forms[0].x.value=coords[0];doc.forms[0].y.value=coords[1];$('#place_target').find('input').val(coords[0]+'|'+coords[1]);doc.forms[0].spy.value=1;`;
}

// Helper: Calculate distance between 2 villages
function calculateDistance(from, to) {
    const [x1, y1] = from.split('|');
    const [x2, y2] = to.split('|');
    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    distance = distance.toFixed(2);
    return distance;
}

// Helper: Get Villages Coords Array
function getVillageCoord(villages) {
    var villageCoords = [];
    villages.forEach((village) => {
        villageCoords.push(village[2] + '|' + village[3]);
    });
    return villageCoords;
}

// Helper: Format as number
function formatAsNumber(number) {
    return parseInt(number).toLocaleString('de');
}

//Helper: Convert CSV data into Array
function CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ',';
    var objPattern = new RegExp(
        '(\\' +
            strDelimiter +
            '|\\r?\\n|\\r|^)' +
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            '([^"\\' +
            strDelimiter +
            '\\r\\n]*))',
        'gi'
    );
    var arrData = [[]];
    var arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
        var strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }
        var strMatchedValue;

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
}

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prepare Popup Content
function preparePopupContent(
    popupBody,
    minWidth = '340px',
    maxWidth = '360px'
) {
    const popupHeader = `
		<h3 class="ra-fs18 ra-fw600">
			${tt(scriptData.name)}
		</h3>
		<div class="ra-body">`;
    const popupFooter = `</div><small><strong>${tt(scriptData.name)} ${
        scriptData.version
    }</strong> - <a href="${
        scriptData.authorUrl
    }" target="_blank" rel="noreferrer noopener">${
        scriptData.author
    }</a> - <a href="${
        scriptData.helpLink
    }" target="_blank" rel="noreferrer noopener">${tt('Help')}</a></small>`;
    const popupStyle = `
		<style>
			.popup_box_content { overflow-y: hidden; }
			.ra-body { width: 100%; min-width: ${minWidth}; max-width: ${maxWidth}; box-sizing: border-box; }
			.ra-fs12 { font-size: 12px; }
			.ra-fs18 { font-size: 18px; }
			.ra-fw600 { font-weight: 600; }
			.ra-mb10 { margin-bottom: 10px; }
			.ra-mb15 { margin-bottom: 15px; }
			.ra-tac { text-align: center; }
			.ra-popup-content textarea { width: 100%; height: 80px; box-sizing: border-box; padding: 5px; resize: none; }
			.ra-popup-content textarea:focus { box-shadow: none; outline: none; border: 1px solid #000; background-color: #eee; }
			.ra-popup-content label { display: block; font-weight: 600; margin-bottom: 3px; }
			.ra-popup-content input[type="text"],
			.ra-popup-content select { font-size: 12px; padding: 4px; width: 100%; box-sizing: border-box; }
			.ra-table { border-spacing: 2px; border-collapse: separate; margin-bottom: 5px; border: 2px solid #f0e2be; }
			.ra-table th { text-align: center; }
            .ra-table td { padding: 1px 2px; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n) td { background-color: #f0e2be }
			.ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
			.ra-flex { display: flex; flex-flow: row wrap; justify-content: space-between; }
            .ra-flex-4 { flex: 0 0 30.5%; }
            .btn-already-sent { padding: 3px; }
            .already-sent-command { opacity: 0.6; }
		</style>
	`;

    let popupContent = `
		${popupHeader}
		${popupBody}
		${popupFooter}
		${popupStyle}
	`;

    return popupContent;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works ðŸš€!`);
    console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
        console.debug(`${scriptInfo()} Game Build:`, game_data.version);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(
            `${scriptInfo()} Premium:`,
            game_data.features.Premium.active
        );
    }
}

// Helper: Text Translator
function tt(string) {
    const gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}