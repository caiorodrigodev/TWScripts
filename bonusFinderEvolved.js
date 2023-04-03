/*
 * Script Name: Bonus Finder Evolved
 * Version: v2.1.2
 * Last Updated: 2022-12-10
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: RedAlert#9859 (Discord)
 * Approved: N/A
 * Approved Date: 2021-08-05
 * Mod: JawJaw
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

if (typeof TWMap === 'undefined') TWMap = {};
if ('TWMap' in window) mapOverlay = TWMap;

// Script Config
var scriptConfig = {
    translations: {
        en_DK: {
            'Bonus Finder Evolved': 'Bonus Finder Evolved',
            Help: 'Help',
            'Redirecting...': 'Redirecting...',
            'Bonus type': 'Bonus type',
            'Min. Points': 'Min. Points',
            'Show all': 'Show all',
            'Filter Bonus Villages': 'Filter Bonus Villages',
            'Reset Filters': 'Reset Filters',
            'Bonus Village Statistics': 'Bonus Village Statistics',
            Village: 'Village',
            Type: 'Type',
            Points: 'Points',
            Distance: 'Distance',
            Action: 'Action',
            Radius: 'Radius',
            'Center Map': 'Center Map',
            'bonus villages found': 'bonus villages found',
            'Error while fetching villages data!':
                'Error while fetching villages data!',
            Count: 'Count',
            TOTAL: 'TOTAL',
            'No results found matching the filters!':
                'No results found matching the filters!',
            'Bonus villages have been filtered!':
                'Bonus villages have been filtered!',
            'Filters have been reset!': 'Filters have been reset!',
            Owner: 'Owner',
            Barbarian: 'Barbarian',
            Player: 'Player',
            'All bonus villages': 'All bonus villages',
        },
        pt_BR: {
            'Bonus Finder Evolved': 'Localizador de Bônus Evoluído.',
            Help: 'Ajuda',
            'Redirecting...': 'Redirecionando...',
            'Bonus type': 'Tipo de bônus',
            'Min. Points': 'Min. pontos',
            'Show all': 'Mostrar tudo',
            'Filter Bonus Villages': 'Filter Bonus Villages',
            'Reset Filters': 'Resetar filtros',
            'Bonus Village Statistics': 'Estatística da aldeia',
            Village: 'Aldeia',
            Type: 'Tipo',
            Points: 'Pontos',
            Distance: 'Distância',
            Action: 'Ação',
            Radius: 'Raio',
            'Center Map': 'Centralizar mapa',
            'bonus villages found': 'aldeias bônus encontradas',
            'Error while fetching villages data!': 'Erro ao buscar dados de aldeias!',
            Count: 'Contagem',
            TOTAL: 'TOTAL',
            'No results found matching the filters!': 'Nenhum resultado encontrado para os filtros!',
            'Bonus villages have been filtered!': 'Aldeias de bônus foram filtradas!',
            'Filters have been reset!': 'Os filtros foram redefinidos!',
            Owner: 'Proprietário',
            Barbarian: 'Bárbara',
            Player: 'Jogador',
            'All bonus villages': 'Todas as aldeias bônus',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['map'],
    allowedModes: [],
    isDebug: DEBUG,
    enableCountApi: true,
    enableAuthCheck: true,
};

$.getScript('https://twscripts.dev/scripts/twSDK.js', async function () {
    // Initialize Library
    await twSDK.init(scriptConfig);
    const scriptInfo = twSDK.scriptInfo();
    const isValidScreen = twSDK.checkValidLocation('screen');

    const { villages, players } = await fetchWorldData();
    const bonusVillageTypes = TWMap.bonus_data;

    if (isValidScreen) {
        initMain();
    } else {
        UI.InfoMessage(twSDK.tt('Redirecting...'));
        twSDK.redirectTo('map');
    }

    // Initialize main script logic
    async function initMain() {
        const bonusVillages = getBonusVillages(villages);
        const filters = buildFilters();

        const content = `
			<div class="ra-mb15">
				${filters}
			</div>
			<div class="ra-mb15">
				<a href="javascript:void(0);" id="raFilterBonusVillagesBtn" class="btn">
					${twSDK.tt('Filter Bonus Villages')}
				</a>
				<a href="javascript:void(0);" id="raResetFiltersBtn" class="btn">
					${twSDK.tt('Reset Filters')}
				</a>
				<a href="javascript:void(0);" id="raBonusVillagesStatsBtn" class="btn">
					${twSDK.tt('Bonus Village Statistics')}
				</a>
				<span><b><span id="raBonusVillagesCount">${
                    bonusVillages.length
                }</span> ${twSDK.tt('bonus villages found')}</b></span>
			</div>
			<div class="ra-mb15" id="raFilteringResults" style="display:none;"></div>
		`;

        const customStyle = `
			.ra-grid { display: grid; grid-template-columns: 200px 200px 200px 200px; grid-gap: 15px; }
			.ra-grid input[type="text"],
			.ra-grid select { display: block; width: 100%; height: auto; padding: 5px; font-size: 14px; }
			.ra-bonus-village-image { width: 55px; }
			.ra-table td,
			.ra-table th { text-align: left; }
			#raFilteringResults { max-height: 300px; overflow-y: auto; }
		`;

        twSDK.renderBoxWidget(
            content,
            'raBonusFinderEvolved',
            'ra-bonus-finder-evolved',
            customStyle
        );

        // register action handlers
        onClickFilterBonusVillages(bonusVillages);
        onClickResetFilters(bonusVillages);
        onClickBonusVillageStats(bonusVillages);

        // update map
        updateMap(bonusVillages);
    }

    // Action Handler: Handle click of filter button
    function onClickFilterBonusVillages(villages) {
        jQuery('#raFilterBonusVillagesBtn').on('click', function (e) {
            e.preventDefault();

            const radius = jQuery('#raRadiusChoser').val();
            const owner = jQuery('#raVillageOwner').val();
            const bonusType = jQuery('#raBonusType').val();
            const minPoints = parseInt(jQuery('#raMinPoints').val());

            let filteredBonusVillages = [...villages];

            if (radius !== 'all') {
                filteredBonusVillages = filteredBonusVillages.filter(
                    (village) => {
                        return parseInt(village[7]) <= parseInt(radius);
                    }
                );
            }

            if (owner === 'all') {
                filteredBonusVillages = filteredBonusVillages;
            }

            if (owner === 'barbarian') {
                filteredBonusVillages = filteredBonusVillages.filter(
                    (village) => {
                        return village[4] == 0 && village[6] != 0;
                    }
                );
            }

            if (owner === 'player') {
                filteredBonusVillages = filteredBonusVillages.filter(
                    (village) => {
                        return village[4] != 0 && village[6] != 0;
                    }
                );
            }

            if (bonusType !== 'all') {
                filteredBonusVillages = filteredBonusVillages.filter(
                    (village) => {
                        return parseInt(village[6]) === parseInt(bonusType);
                    }
                );
            }

            if (minPoints !== 26) {
                filteredBonusVillages = filteredBonusVillages.filter(
                    (village) => {
                        return parseInt(village[5]) >= parseInt(minPoints);
                    }
                );
            }

            if (filteredBonusVillages.length) {
                const bonusVillagesTable = buildTable(filteredBonusVillages);
                jQuery('#raFilteringResults').show();
                jQuery('#raFilteringResults').html(bonusVillagesTable);
                jQuery('#raBonusVillagesCount').text(
                    filteredBonusVillages.length
                );
                UI.SuccessMessage(
                    twSDK.tt('Bonus villages have been filtered!')
                );

                // update map
                updateMap(filteredBonusVillages);
            } else {
                jQuery('#raFilteringResults').hide();
                jQuery('#raFilteringResults').html('');
                jQuery('#raBonusVillagesCount').text(
                    filteredBonusVillages.length
                );
                UI.ErrorMessage(
                    twSDK.tt('No results found matching the filters!')
                );
            }
        });
    }

    // Action Handler: Reset filters
    function onClickResetFilters(villages) {
        jQuery('#raResetFiltersBtn').on('click', function (e) {
            e.preventDefault();

            jQuery('#raRadiusChoser').val('all');
            jQuery('#raBonusType').val('all');
            jQuery('#raVillageOwner').val('all');
            jQuery('#raMinPoints').val(26);

            jQuery('#raFilteringResults').hide();
            jQuery('#raFilteringResults').html('');
            jQuery('#raBonusVillagesCount').text(villages.length);

            UI.SuccessMessage(twSDK.tt('Filters have been reset!'));

            updateMap(villages);
        });
    }

    // Action Handler: Show statistics on bonus villages distribution by type
    function onClickBonusVillageStats(villages) {
        jQuery('#raBonusVillagesStatsBtn').on('click', function (e) {
            e.preventDefault();

            const villagesOnlyBonusType = villages.map((village) => village[6]);
            const villagesFrequency = twSDK.frequencyCounter(
                villagesOnlyBonusType
            );

            let villageBonusTypeCombinations = ``;

            for (let [key, value] of Object.entries(villagesFrequency)) {
                const bonusVillageImage = getBonusVillageType(
                    parseInt(key),
                    'image'
                );
                const bonusVillageLabel = getBonusVillageType(
                    parseInt(key),
                    'text'
                );
                villageBonusTypeCombinations += `
					<tr>
						<td>
							<img class="ra-bonus-village-image" src="${bonusVillageImage}" alt="${bonusVillageLabel}" title="${bonusVillageLabel}">
						</td>
						<td>
							${twSDK.formatAsNumber(value)}
						</td>
					</tr>
				`;
            }

            let popupContent = `
				<div class="ra-popup-content">
					<table class="ra-table" width="100%">
						<thead>
							<tr>
								<th>${twSDK.tt('Type')}</th>
								<th>${twSDK.tt('Count')}</th>
							</tr>
						</thead>
						<tbody>
							${villageBonusTypeCombinations}
							<tr>
								<td>
									<b>${twSDK.tt('TOTAL')}</b>
								</td>
								<td>
									<b>${villages.length}</b>
								</td>
							</tr>
						</table
					</table>
				</div>
			`;

            Dialog.show('content', popupContent);
        });
    }

    // Map: Rerender map to filter all villages so only bonus villages remain
    function updateMap(bonusVillages) {
        const barbCoords = [];
        const barbCoordIds = [];
        const bonusVillagesArray = bonusVillages.map((bonusVillage) => {
            const coordinate = bonusVillage[2] + '|' + bonusVillage[3];
            const bonusVillageType = parseInt(bonusVillage[6]);
            barbCoordIds.push(parseInt(bonusVillage[0]));
            barbCoords.push(coordinate);
            return {
                [coordinate]: bonusVillageType,
            };
        });

        // Show wall level of barbarian villages on the Map
        if (mapOverlay.mapHandler._spawnSector) {
            //exists already, don't recreate
        } else {
            //doesn't exist yet
            mapOverlay.mapHandler._spawnSector =
                mapOverlay.mapHandler.spawnSector;
        }

        TWMap.mapHandler.spawnSector = function (data, sector) {
            // Override Map Sector Spawn
            mapOverlay.mapHandler._spawnSector(data, sector);
            var beginX = sector.x - data.x;
            var endX = beginX + mapOverlay.mapSubSectorSize;
            var beginY = sector.y - data.y;
            var endY = beginY + mapOverlay.mapSubSectorSize;
            for (var x in data.tiles) {
                var x = parseInt(x, 10);
                if (x < beginX || x >= endX) {
                    continue;
                }
                for (var y in data.tiles[x]) {
                    var y = parseInt(y, 10);

                    if (y < beginY || y >= endY) {
                        continue;
                    }
                    var xCoord = data.x + x;
                    var yCoord = data.y + y;
                    var v = mapOverlay.villages[xCoord * 1000 + yCoord];
                    if (v) {
                        var vXY = '' + v.xy;
                        var vCoords = vXY.slice(0, 3) + '|' + vXY.slice(3, 6);
                        if (barbCoords.includes(vCoords)) {
                            const currentBarbarian = bonusVillagesArray.find(
                                (obj) => obj[vCoords]
                            );
                            const bonusVillageType = getBonusVillageType(
                                currentBarbarian[vCoords],
                                'image'
                            );

                            const eleDIV = $('<div></div>')
                                .css({
                                    position: 'absolute',
                                    width: '50px',
                                    height: '35px',
                                    marginTop: '0',
                                    marginLeft: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: '10',
                                    fontSize: '10px',
                                    fontWeight: 'normal',
                                    textAlign: 'center',
                                    backgroundColor: '#eee',
                                })
                                .attr('id', 'dsm' + v.id)
                                .html(
                                    `<img src="${bonusVillageType}" width="35px" height="auto">`
                                );

                            sector.appendElement(
                                eleDIV[0],
                                data.x + x - sector.x,
                                data.y + y - sector.y
                            );
                        } else {
                            if (!barbCoordIds.includes(parseInt(v.id))) {
                                jQuery('#map_container > div:first-child').css({
                                    display: 'none',
                                });
                                jQuery(`[id="map_village_${v.id}"]`).css({
                                    display: 'none',
                                });
                                jQuery(`[id="map_icons_${v.id}"]`).css({
                                    display: 'none',
                                });
                                jQuery(`[id="map_cmdicons_${v.id}_0"]`).css({
                                    display: 'none',
                                });
                                jQuery(`[id="map_cmdicons_${v.id}_1"]`).css({
                                    display: 'none',
                                });
                                jQuery(`[id="map_cmdicons_${v.id}_2"]`).css({
                                    display: 'none',
                                });
                                jQuery('#map_village_undefined').css({
                                    display: 'none',
                                });
                                jQuery(
                                    'img[src="/graphic/map/reserved_player.png"]'
                                ).css({
                                    display: 'none',
                                });
                                jQuery(
                                    'img[src="/graphic/map/reserved_team.png"]'
                                ).css({
                                    display: 'none',
                                });
                                jQuery(
                                    'img[src="/graphic/map/return.png"]'
                                ).css({
                                    display: 'none',
                                });
                                jQuery(
                                    'img[src="/graphic/map/attack.png"]'
                                ).css({
                                    display: 'none',
                                });
                                jQuery('#map canvas').css({
                                    display: 'none',
                                });
                            }
                        }
                    }
                }
            }
        };

        mapOverlay.reload();
    }

    // Helper: Build the bonus villages filters
    function buildFilters() {
        let bonusTypes = ``;

        for (let [key, value] of Object.entries(bonusVillageTypes)) {
            bonusTypes += `<option value="${key}">${value.text}</option>`;
        }

        return `
			<div class="ra-grid">
				<div>
					<label for="raCurrentVillage">${twSDK.tt('Radius')}</label>
					<select id="raRadiusChoser">
						<option value="all">${twSDK.tt('Show all')}</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="30">30</option>
						<option value="40">40</option>
						<option value="50">50</option>
					</select>
				</div>
				<div>
					<label for="raVillageOwner">${twSDK.tt('Owner')}</label>
					<select id="raVillageOwner">
						<option value="all" selected>${twSDK.tt('All bonus villages')}</option>
						<option value="barbarian">${twSDK.tt('Barbarian')}</option>
						<option value="player">${twSDK.tt('Player')}</option>
					</select>
				</div>
				<div>
					<label for="raCurrentVillage">${twSDK.tt('Bonus type')}</label>
					<select id="raBonusType">
						<option value="all">${twSDK.tt('Show all')}</option>
						${bonusTypes}
					</select>
				</div>
				<div>
					<label for="raMinPoints">${twSDK.tt('Min. Points')}</label>
					<input id="raMinPoints" type="text" value="26">
				</div>
			</div>
		`;
    }

    // Helper: Build the table of bonus villages
    function buildTable(villages) {
        let bonusVillagesList = ``;
        villages.forEach((village, index) => {
            index++;
            const [id, name, x, y, player, points, rank, distance] = village;
            const villageCoord = x + '|' + y;
            const continent = twSDK.getContinentByCoord(villageCoord);
            const bonusVillageType = getBonusVillageType(
                parseInt(rank),
                'text'
            );

            let playerName = '';

            if (player != 0) {
                const playerDetails = getPlayerDetailsByPlayerId(player);
                if (playerDetails !== undefined) {
                    playerName = `
						<a href="/game.php?screen=info_player&id=${player}" target="_blank" rel="noopener noreferrer">
							${twSDK.cleanString(playerDetails[1])}
						</a>
					`;
                }
            } else {
                playerName = twSDK.tt('Barbarian');
            }

            bonusVillagesList += `
				<tr class="ra-villageId-${id}">
					<td>${index}</td>
					<td>${continent}</td>
					<td>
						<a href="/game.php?screen=info_village&id=${id}" target="_blank" rel="noreferrer noopener">
							${twSDK.cleanString(name)} (${villageCoord})
						</a>
					</td>
					<td>${bonusVillageType}</td>
					<td>${twSDK.formatAsNumber(points)}</td>
					<td>${distance}</td>
					<td>${playerName}</td>
					<td>
						<a href="javascript:TWMap.focus(${x}, ${y});" class="btn">
							${'Center Map'}
						</a>
					</td>
				</tr>
			`;
        });

        let bonusVillagesTable = `
			<table class="ra-table" width="100%">
				<thead>
					<tr>
						<th>#</th>
						<th>K</th>
						<th>${twSDK.tt('Village')}</th>
						<th>${twSDK.tt('Type')}</th>
						<th>${twSDK.tt('Points')}</th>
						<th>${twSDK.tt('Distance')}</th>
						<th>${twSDK.tt('Owner')}</th>
						<th>${twSDK.tt('Action')}</th>
					</tr>
				</thead>
				<tbody id="raBonusVillagesRows">
					${bonusVillagesList}
				</tbody>
			</table>
		`;

        return bonusVillagesTable;
    }

    // Helper: From all world villages, filter to keep only bonus villages
    function getBonusVillages(villages) {
        const bonusVillages = villages.filter((village) => {
            return village[6] != 0 && village[6] !== undefined;
        });

        const bonusVillagesWithDistance = bonusVillages.map((village) => {
            const villageCoords = village[2] + '|' + village[3];
            return [
                ...village,
                twSDK
                    .calculateDistanceFromCurrentVillage(villageCoords)
                    .toFixed(2),
            ];
        });
        const sortedBonusVillagesByDistance = bonusVillagesWithDistance.sort(
            (a, b) => {
                return a[7] - b[7];
            }
        );

        return sortedBonusVillagesByDistance;
    }

    // Helper: Get bonus type label from bonus type id
    function getBonusVillageType(typeId, property) {
        if (bonusVillageTypes[typeId] !== undefined) {
            return bonusVillageTypes[typeId][property];
        } else {
            return '';
        }
    }

    // Helper: Get player details by player ID
    function getPlayerDetailsByPlayerId(playerId) {
        const filteredPlayers = players.filter(
            (player) => parseInt(player[0]) === parseInt(playerId)
        );
        return filteredPlayers[0];
    }

    // Helper: Fetch all required world data
    async function fetchWorldData() {
        try {
            const villages = await twSDK.worldDataAPI('village');
            const players = await twSDK.worldDataAPI('player');
            return { villages, players };
        } catch (error) {
            UI.ErrorMessage(error);
            console.error(`${scriptInfo} Error:`, error);
        }
    }
});
