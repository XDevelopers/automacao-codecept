/// <reference path="./steps.d.ts" />
/*jshint esversion: 6 */
var fs = require("fs");
var output = require('codeceptjs').output;

Feature('Crawler');

//Scenario('Pegar alguns dados do Portal da Transparência', (I, helper) => { 
// Desta forma meio que executará com 'promises'

Scenario('Pegar alguns dados do Portal da Transparência', function* (I) {

    var servidores = [];    

    // Carrega a Página Inicial
    // -----------------------------------------------------------------------------------
    I.amOnPage(I.baseQueryString);
    
    // Seleciona o Período desejado (Geralmente o Mês anterior)
    // select element by label, choose option by text
    // -----------------------------------------------------------------------------------
    I.selectOption('select[id="formTemplate:dataFunc:cbxCompetencia_input"]','12/2017');
    I.waitToHide("span[id='formTemplate:j_idt9_title']", 300);
    
    // Altera a Quantidade de Registros por Página (para 20 registros por página)
    // -----------------------------------------------------------------------------------
    I.selectOption('select[id="formTemplate:dataFunc:colTable_rppDD"]', '20');
    I.waitToHide("span[id='formTemplate:j_idt9_title']", 300);

    // -----------------------------------------------------------------------------------
    // Aqui deve começar o Looping por páginas
    // -----------------------------------------------------------------------------------
    
    // Pegar a quantidade de Páginas onde serão feitas as interações
    // -----------------------------------------------------------------------------------
    let pages = yield I.executeScript( () => {
        return parseInt(document.getElementsByClassName("ui-paginator-current")[0].innerText.split(" ")[12].split("/")[1]);
    });    
    I.say('Quantidade de páginas: ' + pages);
    var arrayPages = new Array(2); // TODO: Arrumar isso...
    
    // Looping para cada página
    // -----------------------------------------------------------------------------------
    for (let index = 0; index < arrayPages.length; index++) {
        I.say(index);


        // -----------------------------------------------------------------------------------
        // Aqui deve começar o Looping por registros
        // -----------------------------------------------------------------------------------

        // Pegar a quantidade de Linhas que serão percorridas
        // -----------------------------------------------------------------------------------
        let rows = yield I.executeScript(() => {
            var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
            return table.find("tr").length;
        });

        // Exibir a quantidades de linhas
        I.say('Quantidade de registros por página: ' + rows);
        var arrayRows = new Array(rows);

        // Looping para cada página
        // -----------------------------------------------------------------------------------
        for (let i = 1; i <= arrayRows.length; i++) {
            I.say('Linha: ' + i);
            
            // start to get data from datagrid, and start to mount the main object;
            var output = Object.assign({
                "nomeCompleto": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[2]'}),
                "lotacao": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[4]'}),
                "cargo": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[3]'}),
                "matricula": "",
                "admissao": "",
                "vencBasico": "",
                "liquido": ""
            });
            
            // click to open dialog to show the details!
            I.click({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[1]'});
            I.waitToHide("span[id='formTemplate:j_idt9_title']", 300);
            I.waitForVisible("span[id='formTemplate:j_idt11_title']");

            // get data from dialog!
            output.matricula = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[1]/td[2]'});
            output.admissao = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[3]/td[2]'});
            output.vencBasico = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colProv"]//table[1]//tr[1]/td[2]'});
            output.liquido = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colRend"]//table[1]//tr[1]/td[3]'});
            
            servidores.push(output);

            I.click("a[class*='ui-dialog-titlebar-close']");
            I.wait(5);
        }        
        I.say('Trocar de página e aguardar');
        I.click("span[class*='ui-paginator-next']");
        I.waitToHide("span[id='formTemplate:j_idt9_title']", 300);
    }

    // export output
    fs.writeFileSync("output/output.json", JSON.stringify(servidores), "utf8");

});