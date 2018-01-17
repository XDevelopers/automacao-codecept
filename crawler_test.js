/// <reference path="./steps.d.ts" />
/*jshint esversion: 6 */
var fs = require("fs");
var output = require('codeceptjs').output;

// try {
//     var inputFromCLI = JSON.parse(process.env.input);
//     Object.keys(inputFromCLI).forEach(function mergeInput (key) {
//         input[key] = inputFromCLI[key];
//     });
// } catch (error) {
//     console.log("{status:'error',applicationNumber:'',message:'missing input'}");
// }

Feature('Crawler');
Scenario('Get DATA from Portal da Transparência', function* (I) {

    var servidores = [];

    // Carrega a Página Inicial
    I.amOnPage(I.baseQueryString);
    I.waitForElement("table[id='formTemplate:dataFunc:filtro']", 5);

    // Seleciona o Período desejado (Geralmente o Mês anterior)
    // select element by label, choose option by text
    I.selectOption('select[id="formTemplate:dataFunc:cbxCompetencia_input"]','12/2017');
    I.wait(20);
    I.waitForValue('//input', "GoodValue");

    // Altera a Quantidade de Registros por Página (para 20 registros por página)
    I.selectOption('select[id="formTemplate:dataFunc:colTable_rppDD"]', '20');
    I.wait(30);

    //var rows = yield I.grabNumberOfVisibleElements({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr'});
    
    // loop to get all records!
    let rows = yield I.executeScript(function () {
        var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
        return table.find("tr").length;
        //return $x('//*[@id="formTemplate:dataFunc:colTable_data"]/tr').length;
    });

    I.say(rows);

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
    I.say(output);
    I.say('\n---- --------------- ---- \n');

    // click to open dialog to show the details!
    I.click({xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[1]/td'});
    I.wait(15);

    // get data from dialog!
    output.matricula = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr/td[2]'});
    output.admissao = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[3]/td[2]'});
    output.vencBasico = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colProv"]//table[1]//tr/td[2]'});
    output.liquido = yield I.grabTextFrom({xpath: './/*[@id="formTemplate:colRend"]//table[1]//tr/td[3]'});

    I.say('\n---- Current object! ----\n');
    I.say(output);
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