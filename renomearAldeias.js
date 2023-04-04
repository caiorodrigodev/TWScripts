// renomearAldeias.js
// Renomeia as aldeias do jogador nas visões gerais (screen=overview_villages)
// Autor: Megalodon
//
// Copyright © 2023 Megalodon
//

playerName = document.querySelector("#menu_row > td:nth-child(11) > table > tbody > tr:nth-child(1) > td > a").textContent;
continent = document.querySelector("#menu_row2 > td:nth-child(4) > b").textContent.split(" ")[1];
village = document.querySelector("#menu_row2 > td:nth-child(4) > b").textContent.split(" ")[0].substr(1, 7);

if (!twcheese)
    var twcheese = {};

twcheese.createNamerGUI = function() {
    var contentContainer = document.createElement('div');
    contentContainer.id = 'twcheese_name_village_container';
    contentContainer.style.display = 'block';
    contentContainer.style.position = 'fixed';
    contentContainer.style.zIndex = 5;
    contentContainer.style.top = '60px'; // Abaixo do menu superior
    contentContainer.style.left = '10px';
    contentContainer.style.borderStyle = 'ridge';
    contentContainer.style.borderColor = 'brown';
    contentContainer.style.backgroundColor = '#f7eed3';
    contentContainer.style.width = '650px';

    /* Barra de título */
    var titleBar = document.createElement('table');
    titleBar.style.backgroundColor = '#dfcca6';
    titleBar.insertRow(-1);
    titleBar.rows[0].insertCell(-1);
    titleBar.rows[0].insertCell(-1);
    titleBar.rows[0].cells[0].innerHTML = '<b>Renomear aldeias</b> (máx. 32 caracteres)';
    titleBar.rows[0].cells[0].width = '100%';
    titleBar.rows[0].cells[1].innerHTML = '<img src="graphic/delete.png" alt="X"/>';
    titleBar.rows[0].cells[1].style.cursor = "pointer";
    titleBar.rows[0].cells[1].onclick = function() { $('#twcheese_name_village_container').remove() };
    titleBar.rows[0].cells[1].style.color = 'red';
    contentContainer.appendChild(titleBar);

    var narcismElement = document.createElement('span');
    narcismElement.innerHTML = 'Criado por <a href="https://forum.tribalwars.com.br/index.php?members/megalodon.113660/follow" target="_blank">Megalodon</a>';
    narcismElement.style.fontSize = '8px';
    narcismElement.style.fontStyle = 'normal';
    narcismElement.style.fontWeight = 'normal';
    narcismElement.style.marginRight = '25px';
    narcismElement.style.cssFloat = 'right';
    titleBar.rows[0].cells[0].appendChild(narcismElement);


    var conteúdo = document.createElement('div');
    content.id = 'twcheese_name_config';
    content.style.padding = '5px';

    var useDefaultConfig = false;

    if (localStorage.getItem('twcheese.nameVillagesConfig')) {
        var options = JSON.parse(localStorage.getItem('twcheese.nameVillagesConfig'));
        content.config = options;

        /*==== atualização: 8 de agosto de 2021 - alterar formato ==*/
        for (var i = 0; i < options.comprimento; i++) {
            if (options[i].name == 'number_villages') {
                if (!options[i].dígitos) {
                    options[i].descrição = 'Número de aldeias';
                    options[i].startNum = options[i].label;
                    options[i].dígitos = 4;

                    for (var j = 0; j < options.length; j++) {
                        options[j].label = options[j].defaultLabel;
                    }
                }
            }
        }

        /* Atualização: 22 de março de 2022 - Opção de direção adicionada */
        var hasDirectionOption = false;
        for (var i = 0; i < options.length; i++) {
            if (options[i].name == 'direction') {
                hasDirectionOption = true;
            }
        }
        if (!hasDirectionOption) {
            var dirOpt = {
                name: 'direction',
                description: 'Direção dentro do continente',
                defaultLabel: ' ',
                label: ' ',
                exemplo: 'NE',
                enabled: false
            };
            options.push(dirOpt);
            content.config = options;

            var alertUser = true;
            if (localStorage.getItem('twcheese_nameVillages_lastUpdateMessage')) {
                if (Number(localStorage.getItem('twcheese_nameVillages_lastUpdateMessage')) >= 1) {
                    alertUser = false;
                }
            }

            if (alertUser) {
                alert('Atualização! Uma nova opção de renomeação foi adicionada:\n\n"Direção"\nindicará a direção cardeal da vila dentro de seu continente');
                localStorage.setItem('twcheese_nameVillages_lastUpdateMessage', '1');
            }
        }
    } else
        useDefaultConfig = true;

    if (useDefaultConfig) {
        content.config = [];
        var options = [{
                nome: 'number_villages',
                descrição: 'Número de aldeias',
                defaultLabel: '0',
                startNum: '1',
                dígitos: '3',
                exemplo: '',
                ativado: true
            },
            {
                nome: 'continent',
                descrição: 'O número do continente',
                defaultLabel: ' ' + continent + ' ',
                exemplo: '',
                ativado: true
            },
            {
                nome: 'insert_text0',
                descrição: 'Inserir o nome padrão para as suas aldeias.',
                defaultLabel: ' ' + playerName + ' ',
                exemplo: '',
                ativado: true
            },
            {
                nome: 'distance',
                descrição: 'Distância da aldeia principal (digite as coordenadas) <img id="twcheese_sector_help" src="http://cdn.tribalwars.net/graphic/questionmark.png" style="width: 13px; height: 13px" title="Essa função irá calcular a distância das suas aldeias para uma aldeia que você considera ser a principal. Você só pode selecionar uma aldeia!">',
                defaultLabel: village,
                exemplo: '13.37',
                ativado: true
            },
            {
                nome: 'sector',
                description: 'Continente - Setor - Campo <img id="twcheese_sector_help" src="http://cdn.tribalwars.net/graphic/questionmark.png" style="width: 13px; height: 13px" title="O mapa é dividido da esquerda para a direita, de cima para baixo.<br/>Mundo - 100 continentes (10x10)<br/>Continente - 400 setores (20x20)<br/>Setor - 25 campos (5x5)">',
                defaultLabel: '',
                example: '55:12:2',
                enabled: false
            },
            {
                name: 'direction',
                description: 'Direção dentro do continente',
                defaultLabel: '',
                example: 'NE',
                enabled: false
            },
            {
                name: 'random_text',
                description: 'Texto aleatório (não preencha nada no campo ao lado)',
                defaultLabel: '',
                example: 'Texto aleatório',
                enabled: false
            },
            {
                name: 'insert_text1',
                description: 'Insira um texto',
                defaultLabel: ' Seu texto aqui',
                example: '',
                enabled: false
            },
            {
                name: 'insert_text2',
                description: 'Insira um texto',
                defaultLabel: ' Seu texto aqui',
                example: '',
                enabled: false
            }
        ];
        for (var i = 0; i < options.length; i++) {
            options[i].label = options[i].defaultLabel;
        }
    }

    content.generateExample = function() {
        var example = '';
        var rows = document.getElementById('twcheese_config_table').rows;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].cells[0].firstChild.checked) {
                if (rows[i].optionData.name == 'number_villages') {
                    var number = Number(Number(rows[i].optionData.startNum) + 69);
                    var digits = rows[i].optionData.digits;
                    for (; String(number).length < digits; digits--)
                        example += '0';
                    example += number;
                } else if (rows[i].optionData.name == 'distance') {
                    example += rows[i].optionData.example;
                } else {
                    example += rows[i].optionData.label;
                    example += rows[i].optionData.example;
                }
            }
        }
        return example;
    };

    content.preview = function() {
        document.getElementById('twcheese_name_preview').innerHTML = this.generateExample();
    };

    content.saveConfig = function() {
        //var rows = this.getElementsByTagName('tr');
        var rows = document.getElementById('twcheese_config_table').rows;
        for (var i = 0; i < rows.length; i++) {
            this.config[i] = rows[i].optionData;
            if (this.config[i].label)
                this.config[i].defaultLabel = this.config[i].label;

        }
        mode = this.getMode();

        localStorage.setItem('twcheese.nameVillagesConfig', JSON.stringify(this.config));
        localStorage.setItem('twcheese_nameVillagesMode', mode);
        UI.InfoMessage('Configuração salva.', 3000, 'success');
    };

    content.getConfig = function() {
        //var rows = this.getElementsByTagName('tr');
        var rows = document.getElementById('twcheese_config_table').rows;
        for (var i = 0; i < rows.length; i++) {
            this.config[i] = rows[i].optionData;
            if (!this.config[i].label)
                this.config[i].label = this.config[i].defaultLabel;
        }

        return this.config;
    }

    content.getMode = function() {
        var modeForm = document.getElementById('twcheese_name_mode_form');
        var options = modeForm.getElementsByTagName('input');
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked)
                this.mode = options[i].value;
        }
        return this.mode;
    }

    content.nameVillages = function() {
        if (document.getElementById('twcheese_name_preview').innerHTML.length >= 31) {
            UI.InfoMessage('Nomes muito longos (máximo de 32 caracteres).', 5000, 'Erro');
        } else {
            var config = this.getConfig();
            var mode = this.getMode();
            $('#twcheese_name_village_container').remove();
            setTimeout(function() { twcheese.renameVillages(config, mode); }, 50);
        }
    }

    /*==== Pré-visualizar ====*/
    var preview = document.createElement('span');
    preview.id = 'twcheese_name_preview';
    preview.innerHTML = 'blahblahblah';
    content.innerHTML = '<b>&nbsp;Exemplo: </b>';
    content.appendChild(preview);


    /*==== Configurações ====*/
    var optionsTable = document.createElement('table');
    optionsTable.id = 'twcheese_config_table';

    for (var i = 0; i < options.length; i++) {
        optionsTable.insertRow(-1);
        optionsTable.rows[i].optionData = options[i];
        optionsTable.rows[i].insertCell(-1);
        optionsTable.className = 'vis';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = options[i].enabled;
        checkbox.onchange = function() {
            content.preview();
            this.parentNode.parentNode.optionData.enabled = this.checked;
        };
        optionsTable.rows[i].cells[0].appendChild(checkbox);

        optionsTable.rows[i].insertCell(-1);

        if (options[i].name == 'number_villages') // Coloque a entrada de numeração especial no local da etiqueta
        {
            var numberingInputTable = document.createElement('table');
            numberingInputTable.insertRow(-1);
            numberingInputTable.insertRow(-1);
            numberingInputTable.rows[0].insertCell(-1);
            numberingInputTable.rows[0].insertCell(-1);
            numberingInputTable.rows[1].insertCell(-1);
            numberingInputTable.rows[1].insertCell(-1);

            numberingInputTable.rows[0].cells[0].innerHTML = 'Inicia em:';
            numberingInputTable.rows[0].cells[0].style.width = '80px';
            numberingInputTable.rows[0].cells[1].innerHTML = 'Dígitos';

            var startNumInput = document.createElement('input');
            startNumInput.type = 'text';
            startNumInput.size = 5;
            startNumInput.value = options[i].startNum;
            startNumInput.onchange = function() {
                this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.optionData.startNum = this.value;
                content.preview();
            }
            numberingInputTable.rows[1].cells[0].appendChild(startNumInput);

            var digitsInput = document.createElement('input');
            digitsInput.type = 'number';
            digitsInput.size = 4;
            digitsInput.value = options[i].digits;
            digitsInput.onchange = function() {
                this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.optionData.digits = this.value;
                content.preview();
            }
            numberingInputTable.rows[1].cells[1].appendChild(digitsInput);



            optionsTable.rows[i].cells[1].appendChild(numberingInputTable);
        } else // Colocar o rótulo normal em
        {
            var label = document.createElement('input');
            label.type = 'text';
            if (!options[i].noLabel)
                label.value = options[i].defaultLabel;
            else
                label.value = '';
            label.onkeyup = function() {
                this.parentNode.parentNode.optionData.label = this.value;
                if (!this.value)
                    this.parentNode.parentNode.optionData.noLabel = true;
                else
                    this.parentNode.parentNode.optionData.noLabel = false;
                content.preview();
            };
            optionsTable.rows[i].cells[1].appendChild(label);
        }

        optionsTable.rows[i].insertCell(-1);
        optionsTable.rows[i].cells[2].innerHTML = options[i].description;

        /*==== handle ====*/
        optionsTable.rows[i].insertCell(-1);
        optionsTable.rows[i].cells[3].innerHTML = '<div style="width: 11px; height:11px; background-image: url(http://cdn.tribalwars.net/graphic/sorthandle.png); cursor:move" class="qbhandle" title="drag to re-order"> </div>';
    }

    content.appendChild(optionsTable);

    /*==== Modo ====*/
    var modeForm = document.createElement('form');
    modeForm.id = 'twcheese_name_mode_form';

    /*==== Substituir ====*/
    overwriteButton = document.createElement('input');
    overwriteButton.id = 'twcheese_radio_overwrite';
    overwriteButton.type = 'radio';
    overwriteButton.name = 'name_mode';
    overwriteButton.value = 'overwrite';
    overwriteButton.style.marginLeft = '20px';
    modeForm.appendChild(overwriteButton);
    modeForm.innerHTML += 'Substituir nomes atuais';

    /*==== Antes ====*/
    prependButton = document.createElement('input');
    prependButton.id = 'twcheese_radio_prepend';
    prependButton.type = 'radio';
    prependButton.name = 'name_mode';
    prependButton.value = 'prepend';
    prependButton.style.marginLeft = '20px';
    modeForm.appendChild(prependButton);
    modeForm.innerHTML += 'Adicionar antes dos nomes atuais';

    /*==== Após ====*/
    appendButton = document.createElement('input');
    appendButton.id = 'twcheese_radio_append';
    appendButton.type = 'radio';
    appendButton.name = 'name_mode';
    appendButton.value = 'append';
    appendButton.style.marginLeft = '20px';
    modeForm.appendChild(appendButton);
    modeForm.innerHTML += 'Adicionar após os nomes atuais.';

    content.appendChild(modeForm);


    /*==== Botões ====*/
    var buttonDiv = document.createElement('div');
    buttonDiv.align = 'center';
    buttonDiv.style.padding = '10px';

    /*==== Definir como padrão ====*/
    var saveButton = document.createElement('button');
    saveButton.onclick = function() { content.saveConfig(); };
    saveButton.innerHTML = 'Definir como padrão';
    buttonDiv.appendChild(saveButton);

    /*==== Começar a renomear aldeias ====*/
    var confirmButton = document.createElement('a');
    confirmButton.className = 'btn-default btn-green';
    confirmButton.innerHTML = 'Começar a renomear aldeias';
    confirmButton.onclick = function() {
        document.getElementById('twcheese_name_config').nameVillages();
    };
    buttonDiv.appendChild(confirmButton);

    content.appendChild(buttonDiv);

    contentContainer.appendChild(content);
    document.getElementById('content_value').appendChild(contentContainer);
    $('#twcheese_config_table > tbody').sortable({ handle: '.qbhandle', placeholder: 'sortable-placeholder' });
    $('#twcheese_config_table > tbody').on('sortstop', function() { content.preview() });
    UI.ToolTip('#twcheese_sector_help');


    content.preview();

    /*==== Aplicar modo padrão ====*/
    content.mode = 'overwrite';
    if (localStorage.getItem('twcheese_nameVillagesMode'))
        content.mode = localStorage.getItem('twcheese_nameVillagesMode');
    var selection = document.getElementById('twcheese_radio_' + content.mode);
    selection.checked = true;
};

/*==== calculators ====*/

/**
 *	@param	village1:Array(x,y)
 *	@param	village2:Array(x,y)
 *	@return	distance:Number
 */
twcheese.calculateDistance = function(village1, village2) {
    return Math.sqrt((village1[0] - village2[0]) * (village1[0] - village2[0]) + (village1[1] - village2[1]) * (village1[1] - village2[1]));
};

/*==== Renomeador ====*/
twcheese.renameVillages = function(config, mode) {
    try {
        $('.quickedit-vn').each(function(key, village) { // Cada aldeia
            var villageId = $(village).attr('data-id');
            var $label = $(village).find('.quickedit-label');
            var originalFullName = $label.text();
            var originalName = $label.attr('data-text');

            var continent = originalFullName.match(/[0-9]{1,2}/gi).pop();
            var coordinates = originalFullName.match(/[0-9]{1,}\|[0-9]{1,}/gi).pop();
            var coordX = coordinates.match(/[0-9]{1,}/);
            var coordY = String(coordinates.match(/\|[0-9]{1,}/)).substring(1);

            var name = '';
            for (var j = 0; j < config.length; j++) // Cada opção de configuração
            {
                if (config[j].enabled) {

                    // Setar número de aldeias
                    if (config[j].name == 'number_villages') {
                        var number = key + Number(config[j].startNum);
                        var digits = config[j].digits;
                        for (; String(number).length < digits; digits--)
                            name += '0';
                        name += number;
                    } else if (config[j].name == 'distance') {
                        var targetCoords = config[j].label.split('|');
                        var targetX = targetCoords[0].match(/[0-9]{1,}/);
                        var targetY = targetCoords[1].match(/[0-9]{1,}/);
                        var distance = twcheese.calculateDistance([targetX, targetY], [coordX, coordY]);
                        name += Math.round(distance * 10) / 10;
                    } else {
                        if (!config[j].noLabel)
                            name += config[j].label; // Escrever texto especificado pelo player
                    }

                    // Setar número do continente
                    if (config[j].name == 'continent') {
                        name += continent;
                    }

                    // Setar um nome aleatório (Com nomes de Deuses nórdicos)
                    if (config[j].name == 'random_text') {
                        var namePool = ["Odin", "Thor", "Freyja", "Freyr", "Loki", "Balder", "Tyr", "Heimdall", "Frigg", "Njord", "Skadi", "Idun", "Bragi", "Gefjon", "Ullr", "Sif", "Mimir", "Hoenir", "Vili", "Ve", "Forseti", "Aegir", "Ran", "Hel", "Eir", "Lofn", "Sjofn", "Hlin", "Syn", "Vor", "Gna", "Fulla", "Vali", "Vidar", "Kvasir", "Gullveig", "Fjorgyn", "Jormungandr", "Fenrir", "Sleipnir", "Elli", "Skoll", "Hati", "Garmr", "Ratatoskr", "Yggdrasil", "Norns", "Fafnir", "Sigurd", "Svadilfari", "Huginn", "Muninn", "Geri", "Freki", "Andhrimnir", "Billingr", "Dagr", "Nott", "Surt", "Thokk", "Ymir", "Laufey", "Gerd", "Angrboda", "Sigyn", "Audumla", "Mengloth", "Hrungnir", "Thrymr", "Grid", "Hreidmar", "Utgard-Loki", "Alvaldi", "Modi", "Magni", "Hjuki", "Bil", "Veor", "Svipdagr", "Volund", "Rindr", "Groa", "Nanna", "Narfi", "Valr", "Hermod", "Odr", "Var", "Fjolnir", "Gjalp", "Greip", "Thrud", "Atla", "Hrimthursar", "Bestla", "Bolthorn", "Farbauti", "Byleistr", "Helblindi", "Kari"];
                        for (var k = 0; k < 3; k++) {
                            randomInt = Math.round(Math.random() * (namePool.length - 1));
                            name += namePool[randomInt];
                        }
                    }

                    // Setar o setor
                    if (config[j].name == 'sector') {
                        var tempX = Number(coordX);
                        var tempY = Number(coordY);

                        // Setor
                        if (Number(tempX) >= 100)
                            tempX = Number(String(coordX).substring(1));
                        if (Number(tempY) >= 100)
                            tempY = Number(String(coordY).substring(1));

                        var xPos = Math.floor(tempX / 5);
                        var yPos = Math.floor(tempY / 5);
                        var sector = yPos * 20 + xPos;

                        // Campo
                        if (Number(tempX) >= 10)
                            tempX = Number(String(tempX).substring(1));
                        if (Number(tempY) >= 10)
                            tempY = Number(String(tempY).substring(1));

                        if (Number(tempX) >= 5)
                            tempX = tempX - 5;
                        if (Number(tempY) >= 5)
                            tempY = tempY - 5;
                        var field = tempY * 5 + tempX;

                        name += continent + ':' + sector + ':' + field;
                    }

                    // Setar direção dentro do continente
                    if (config[j].name == 'direction') {
                        var directionNames = [
                            ['NO', 'N', 'NE'],
                            ['O', 'C', 'L'],
                            ['SO', 'S', 'SE']
                        ];

                        function getLocation(number) {
                            if (number > 66) {
                                return 2;
                            } else if (number > 33) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                        var xLocation = getLocation(coordX % 100);
                        var yLocation = getLocation(coordY % 100);

                        name += directionNames[yLocation][xLocation];
                    }

                }

            }

            if (mode == 'overwrite')
                name = name;
            else if (mode == 'append')
                name = originalName + name;
            else if (mode == 'prepend')
                name = name + originalName;

            if (name.length <= 32) {
                $(village).find('.rename-icon').click();
                $(village).find('input[type=text]').val(name);
                $(village).find('input[type=button]').click();
            } else
                UI.InfoMessage('Nome muito longo (máximo de 32 caracteres).<br/>Novo nome não aplicado a todas as aldeias.', 5000, 'Erro');

        });
    } catch (e) { alert(e) }
}

/*==== main ====*/
// register
var script = {
    scriptname: 'Renomear aldeias',
    version: 1.01,
    author: 'Megalodon',
    broken: false
};
$.post(ScriptAPI.url, script);

if (game_data.screen == 'overview_villages' || canNameVillages) {
    twcheese.createNamerGUI();
    var canNameVillages = true;
} else {
    UI.InfoMessage('O script precisa ser utilizado na aba <a href="/game.php?screen=overview_villages&mode=combined" class="btn">Visualização geral</a>', 5000, 'Erro');
}