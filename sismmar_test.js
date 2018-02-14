/// <reference path="./steps.d.ts" />
/*jshint esversion: 6 */
var fs = require("fs");
var output = require('codeceptjs').output;

try {

    Feature('Crawler - SISMMAR');

    //Scenario('Pegar alguns dados do Portal da Transparência', (I, helper) => { 
    // Desta forma meio que executará com 'promises'
    Scenario('Pegar todos os dados do Mágistério do Portal da Transparência', function*(I) {

        var timeout = 500;
        var servidores = [];

        // Carrega a Página Inicial
        // -----------------------------------------------------------------------------------
        I.amOnPage(I.baseQueryString);

        // Seleciona o Período desejado (Geralmente o Mês anterior)
        // select element by label, choose option by text
        // -----------------------------------------------------------------------------------
        I.selectOption('select[id="formTemplate:dataFunc:cbxCompetencia_input"]', '11/2017');
        I.waitToHide("span[id='formTemplate:j_idt9_title']", timeout);

        // Altera a Quantidade de Registros por Página (para 20 registros por página)
        // -----------------------------------------------------------------------------------
        I.selectOption('select[id="formTemplate:dataFunc:colTable_rppDD"]', '20');
        I.waitToHide("span[id='formTemplate:j_idt9_title']", timeout);

        var hearder = "NomeCompleto;Matricula;Admissao;Cargo;Lotacao;VencimentoBasico;Liquido;\n";
        fs.appendFileSync("output/sismmar.csv", hearder, "utf8");

        var magisterio = [
            "PEDAGOGO",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA I",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II - ARTE",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II - CIENCIAS",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II - EDUC.FISICA",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II - HISTORIA",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II - LÍNGUA INGLESA",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II -GEOGRAFIA",
            "PROFISSIONAL DO MAGISTÉRIO - DOCENCIA II -MATEMATICA",
            "PROFISSIONAL DO MAGISTÉRIO DOC II - LÍNGUA PORTUGUESA"
        ];

        for (let j = 0; j < magisterio.length; j++) {
            const cargo = magisterio[j];

            // Altera o Cargo para um dos cargos válidos
            // -----------------------------------------------------------------------------------
            I.selectOption('select[id="formTemplate:dataFunc:cbxCargo_input"]', cargo);
            I.waitToHide("span[id='formTemplate:j_idt9_title']", timeout);

            // -----------------------------------------------------------------------------------
            // Aqui deve começar o Looping por páginas
            // -----------------------------------------------------------------------------------
            var professionais = [];

            // Pegar a quantidade de Páginas onde serão feitas as interações
            // -----------------------------------------------------------------------------------
            let pages = yield I.executeScript(() => {
                return parseInt(document.getElementsByClassName("ui-paginator-current")[0].innerText.split(" ")[12].split("/")[1]);
            });
            I.say('Quantidade de páginas: ' + pages);
            var arrayPages = new Array(pages);

            // Looping para cada página
            // -----------------------------------------------------------------------------------
            for (let index = 0; index < arrayPages.length; index++) {
                I.say('Página:' + index);

                // -----------------------------------------------------------------------------------
                // Aqui deve começar o Looping por registros
                // -----------------------------------------------------------------------------------
                try {

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
                            "nomeCompleto": yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[2]' }),
                            "lotacao": yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[4]' }),
                            "cargo": yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[3]' }),
                            "matricula": "",
                            "admissao": "",
                            "vencBasico": "",
                            "liquido": ""
                        });

                        // Click to open dialog to show the details!
                        I.click({ xpath: './/*[@id="formTemplate:dataFunc:colTable_data"]/tr[' + i + ']/td[1]' });
                        I.waitToHide("span[id='formTemplate:j_idt9_title']", timeout);
                        I.waitForVisible("span[id='formTemplate:j_idt11_title']", timeout);

                        // get data from dialog!
                        output.matricula = yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[1]/td[2]' });
                        output.admissao = yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:colDetail"]/table[1]//tr[3]/td[2]' });

                        // Validação para os Proventos
                        // -----------------------------------------------------------------------------------
                        let proventos = yield I.executeScript(() => {
                            // document.evaluate('XPATH HERE', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            
                            var label = document.evaluate('.//*[@id="formTemplate:colProv"]//table[1]//tr[1]/td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            var vencBasico = document.evaluate('.//*[@id="formTemplate:colProv"]//table[1]//tr[1]/td[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                            // Validar se existe a coluna e se está escrito 'VENCIMENTO BÁSICO'
                            if (label && label.innerText === "VENCIMENTO BÁSICO"){
                                return document.evaluate('.//*[@id="formTemplate:colProv"]//table[1]//tr[1]/td[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null;
                            }
                            else{
                                return false;
                            }                            
                        });
                        if (proventos) { // .//*[@id="formTemplate:colProv"]//table[1]/tbody/tr[1]/td
                            // Perform some test logic
                            output.vencBasico = yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:colProv"]//table[1]//tr[1]/td[2]' });
                        }
                        else{
                            output.vencBasico = '0.0';
                        }

                        // Validação para os Rendimentos
                        // -----------------------------------------------------------------------------------
                        let rendimentos = yield I.executeScript(() => {
                            // document.evaluate('XPATH HERE', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            return document.evaluate('.//*[@id="formTemplate:colRend"]//table[1]//tr[1]/td[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null;
                        });
                        if (rendimentos) {
                            output.liquido = yield I.grabTextFrom({ xpath: './/*[@id="formTemplate:colRend"]//table[1]//tr[1]/td[3]' });
                        }
                        else{
                            output.liquido = '0.0';
                        }

                        servidores.push(output);
                        professionais.push(output);

                        // Monta uma Linha separada por ; para gerar um CSV
                        // -----------------------------------------------------------------------------------
                        var stringLine = output.nomeCompleto + ";" +
                        output.matricula + ";"+
                        output.admissao + ";"+
                        output.cargo + ";"+
                        output.lotacao + ";\""+
                        output.vencBasico.replace(",", "") + "\";\""+
                        output.liquido.replace(",", "") + "\";\n";
                        fs.appendFileSync("output/sismmar.csv", stringLine, "utf8");

                        I.click("a[class*='ui-dialog-titlebar-close']");
                        I.say("Profissional: "+ output.nomeCompleto);
                        I.wait(5);
                    }
                } catch (error) {
                    fs.writeFileSync("output/output_with_error.json", JSON.stringify(error), "utf8");
                    console.error(error);
                    // export output
                    fs.writeFileSync("error.json", error, "utf8");
                }

                I.say('Trocar de página e aguardar');
                I.click("span[class*='ui-paginator-next']");
                I.waitToHide("span[id='formTemplate:j_idt9_title']", timeout);
            } // Termina Looping das páginas
            
            //  Depois de Finalizar as páginas de cada cargo gerar um arquivo
            fs.writeFileSync("output/sismmar-cargo-" + cargo + ".json", JSON.stringify(professionais), "utf8");
            fs.appendFileSync("output/sismmar-" + cargo + ".json", JSON.stringify(servidores), "utf8");
        }

        // export output
        fs.writeFileSync("output/output.json", JSON.stringify(servidores), "utf8");

    });
} catch (error) {
    console.error(error);
    fs.writeFileSync("error.json", error, "utf8");
}