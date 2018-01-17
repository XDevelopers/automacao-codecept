/*jshint esversion: 6 */

function wait(func, poolingTime) {
    var sleepTime = poolingTime || 100;
    
    function _wait(func) {
        return new Promise((resolve, reject) => {
            sleep(sleepTime).then(() => {
                if (func()) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    return _wait(func)
        .catch(() => {
            return wait(func, poolingTime);
        });
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

function when(value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
}

function asyncForEach(arr, func) {
  return arr.reduce((promise, value, index) => {
    return promise
      .then(() => func(value, index));
  }, when());
}

//
// Como usar
//

//arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/*
asyncForEach(arr, (x) => sleep(1000)
    .then(() => console.log(x)))
    .then(() => console.log('Finished!'));

*/

function delay(){
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function delayedLog(item){
    await delay();
    console.log(item);
}

async function processArray(array){
    for (const item in array) {
        await delayedLog(item);
    }
    console.log('Done!');
}

function crawler(mesAno) {
    
    var url = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";
    var pages = parseInt($(".ui-paginator-current").text().split("/")[1].replace("]", "").trim()); 
    window.filiados = [];

    var total = parseInt($(".ui-paginator-current").text().split(" ")[9]); //4941;

    // function log(message) {
    //     console.log(new Date().toLocaleTimeString() + ' - ' + message); 
    // }

    function trocaPeriodo(mesAno) {
        var selectCompetencia = $("div [id='formTemplate:dataFunc:cbxCompetencia']");
        if (selectCompetencia){
            selectCompetencia
            .find("select option")
            .each(function (i, opt) {
                $(opt).removeAttr("selected"); 
            }); 

            // 06/2017
            if (mesAno !== undefined) {
                selectCompetencia
                .find("select option[value='" + mesAno + "']")[0]
                .setAttribute("selected", "selected"); 
            }
            else {
                selectCompetencia
                .find("select option")[2]
                .setAttribute("selected", "selected");
            }
            
            // Call trigger 
            selectCompetencia
            .find("select")
            .trigger("change");

            console.log('Trigger para mudar a competência!');
        }        
    }

    function trocaQuantPorPagina() {
        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .find("option")
            .each(function (i, opt) {
                $(opt).removeAttr("selected"); 
            }); 

        // set value to get more results per page
        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .find("option[value='20']")
            .attr("selected", "selected"); 

        $("select[id='formTemplate:dataFunc:colTable_rppDD']").trigger("change"); 

        console.log('trigger para mudar a quantidade de registros por página!'); 
        return wait(() => validaLinhas(9) && validaSeLoadingEstaOculto());
    }

    function trocaDePagina() {
        if ($("span.ui-paginator-page.ui-state-default.ui-corner-all.ui-state-active").length > 0){
            $("span.ui-paginator-page.ui-state-default.ui-corner-all.ui-state-active")
            .next()
            .trigger('click'); 

            console.log('trigger para mudar de página!');
        }
        return wait(() => validaLinhas(5) && validaSeLoadingEstaOculto());
    }

    function validaLinhas(lines) {
        return $(document.getElementById("formTemplate:dataFunc:colTable_data")).find("tr").size() > lines; 
    }

    function validaModal(visible) {
        if (visible) {
            return $(document.getElementById('formTemplate:j_idt11')).css("display") === "block"; 
        }
        else {
            return $(document.getElementById('formTemplate:j_idt11')).css("display") === "none"; 
        }
    }

    function validaSeLoadingEstaOculto() {
        return $(document.getElementById('formTemplate:j_idt9')).css("display") === "none"; 
    }
    
    function obtemDadosPorLinha(tr){
        var $tr = $(tr);
        return new Promise((resolve, reject) => {
            var dados = {
                NomeCompleto: $($tr.find("td")[1]).text().trim(), 
                Funcional : {
                    Cargo: $($tr.find("td")[2]).text().trim(), 
                    Local: $($tr.find("td")[3]).text().trim(), 
                    DataAdmissao: '',
                    Matriculas: []
                },
                Status: "PreCadastrado"
            };

            // trigger para abrir modal
            $($tr.find("td")[0]).trigger("click");

            return sleep(20000).then( () => {
                console.log('verificando se a modal está aberta para pegar os dados!');
                return wait( () => validaSeLoadingEstaOculto() && validaModal(true) )
                    .then( () => {
                        console.log('pegando dados da modal !');
                        var tbData = $($("[role='grid']")[0]); 
                        if($($("[role='grid']")[0]).length > 0) {

                            dados.NomeCompleto = tbData.find("tr")[1].children[1].innerText.trim();
                            dados.Funcional.DataAdmissao = tbData.find("tr")[2].children[1].innerText.trim();
                            // add Matricula
                            dados.Funcional.Matriculas.push({
                                Ativo: true, 
                                NumeroMatricula: tbData.find("tr")[0].children[1].innerText.trim()
                            }); 
                        }

                        // trigger para fechar a modal
                        $(".ui-dialog-titlebar-close").trigger("click"); 
                        resolve(dados);
                    });
            });
        });
    }

    function obtemDadosPorPagina(page){
        return new Promise((resolve, reject) => {
            var p = new Promise( (resolve, reject) => resolve() );
            var contador = 0;
            
            var tbody = $("tbody[id='formTemplate:dataFunc:colTable_data']");
            var rows = $(tbody).find("tr");
            var lines = Array.from(rows);

            asyncForEach(lines, (row) => sleep(5000)
            .then(() => {
                contador++;
                console.log('Linha: ' + $($(row).find("td")[1]).text().trim());
                p = p.then(() => obtemDadosPorLinha(row)).then(servidor => {
                    console.log('Dados do servidor: [' + servidor.NomeCompleto + ']'); 
                    console.log(servidor);
                    filiados.push(servidor);
                });
            }))
            .then(() => {
                console.log('Contador:', contador);
                if (contador >= 20)
                {
                    resolve(contador);
                }
            });
        });
    }    

    // - escolhe mês e ano!
    console.log('escolhe mês e ano! - ' + mesAno || "11/2017");
    trocaPeriodo(mesAno);

    wait(() => validaLinhas(1) && validaSeLoadingEstaOculto())
        .then( () => {
            console.log('muda a quantidade de registros por página!'); 
            return trocaQuantPorPagina();
        })
        .then( () => {
            console.log('começa a capturar dados dos servidores!'); 
            var table = $(document.getElementById("formTemplate:dataFunc:colTable_data")); 
            
            var countPages = parseInt($(".ui-paginator-current")
                .text()
                .split("/")[1]
                .replace(" ]", "")) - 240;

            let pages = [];
            for (var i = 1; i <= countPages; i++) { 
                pages.push(i); 
            }
            
            var p = new Promise( (resolve, reject) => resolve() );
            
            asyncForEach(pages, (page) => sleep(10000)
                .then(() => {
                    console.log('Obtém os dados da página: ', page);
                    
                    let lines = [0,1,2,3,4,5,6,7,8,9];
                    var contador = 0;
                    asyncForEach(lines, (row) => sleep(2000)
                    .then(() => {
                        
                        p = p
                        .then(() => { console.log('linhas:', row); })
                        .then(() => { console.log('Contador:', contador); })
                        .then(() => { contador++; });

                    }))
                    .then(() => {
                        console.log('Acabou as linhas');
                        return { test: 'nono' };
                    });

                    //return wait( () => obtemDadosPorPagina(page) == 20 );
                }))
                .then(() => {
                    console.log('Acabou Looping de Páginas!');
                    console.log(filiados);
                });
            
        });
}

crawler("11/2017");