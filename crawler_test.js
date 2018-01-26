/// <reference path="./steps.d.ts" />
/*jshint esversion: 6 */
var fs = require("fs");
var output = require('codeceptjs').output;

Feature('Crawler');

//Scenario('Pegar alguns dados do Portal da Transparência', (I) => { // Desta forma meio que executará com 'promises'
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
    let pages = yield I.executeScript(function () {
        return parseInt(document.getElementsByClassName("ui-paginator-current")[0].innerText.split(" ")[12].split("/")[1]);
    });    
    I.say('Quantidade de páginas: ' + pages);
    var arrayPages = new Array(pages);
    var page;
    I.say('arrayPages length: ' + arrayPages.length);
    // for (page in arrayPages) {
    //     var text = arrayPages[page];
    //     I.say(text);
    //     I.wait(5);
    // }

    for (let index = 0; index < arrayPages.length; index++) {
        I.say(index);




        
        I.wait(5);
    }

    // -----------------------------------------------------------------------------------
    // Aqui deve ser um Loop para pegar todos os dados por Linha
    // -----------------------------------------------------------------------------------
    // loop to get all records!
    let rows = yield I.executeScript(function () {
        var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
        return table.find("tr").length;
    });

    // Exibir a quantidades de linhas
    I.say('Quantidade de registros por página: ' + rows);

    // start to get data from datagrid, and start to mount the main object;
    var output = Object.assign({
        "nomeCompleto": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[1]/td[2]'}),
        "lotacao": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[1]/td[4]'}),
        "cargo": yield I.grabTextFrom({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[1]/td[3]'}),
        "matricula": "",
        "admissao": "",
        "vencBasico": "",
        "liquido": ""
    });

    I.say('\n---- Current object! ---- \n');
    console.log(output);
    I.say('\n---- --------------- ---- \n');

    // click to open dialog to show the details!
    I.click({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[1]/td'});
    I.waitToHide("span[id='formTemplate:j_idt9_title']", 300);
    I.waitForVisible("span[id='formTemplate:j_idt11_title']");
    //I.wait(15);

    // get data from dialog!
    output.matricula = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr/td[2]'});
    output.admissao = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[3]/td[2]'});
    output.vencBasico = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colProv"]//table[1]//tr/td[2]'});
    output.liquido = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colRend"]//table[1]//tr/td[3]'});

    I.say('\n---- Current object! ----\n');
    console.log(output);
    I.say('\n---- --------------- ----\n');

    if(servidores.find(serv => serv.matricula === output.matricula) === undefined){
        servidores.push(output);
    }

    // export output
    fs.writeFileSync("output/output.json", JSON.stringify(servidores), "utf8");

    // grabResults: function* () {
    //     let liAmount = yield I.grabNumberOfVisibleElements("//li")
    //     let returnment = []
    //     for (let i = 0; i < liAmount; i++) {
    //         let result = yield I.grabTextFrom(`//li[${i+1}]//h2`)
    //         let description = yield I.grabTextFrom(`//li[${i+1}]h3`)
    //         returnment.push([result, description])
    //     }
    //     return returnment
    // },
    //
    // Scenario.only('test', function* (I, mainPage) {
    //     let result = yield* mainPage.grabResults()
    //     console.log(result)
    // })

    // // inject hidden field with application number
    // I.executeScript(function () {
    //     var applicationNumber = $("tila-doc").prop('applicationNumber');
    //     $("tila-doc").append("<input type='hidden' id='applicationNumber' value='" + applicationNumber + "' />");
    // });
});

// Feature('Cenário-001 - testando for');

// Scenario('Acessar Alertas', (I) => {
//     I.say('eita');
//     I.Login();
    
//     var person = {fname:"John", lname:"Doe", age:25, sex:"MMM"}; 

//     var text = "";
//     var x;
//     var fs = require('fs');
//     fs.appendFile("teste.txt", 'INICIO\n'); 
//     for (x in person) {
//         text += person[x];
//         I.say(text);
       

//         I.wait(5);
//     }
//     fs.appendFile("teste.txt", text+'\n'); 
    
//     I.wait(10);
    
// });