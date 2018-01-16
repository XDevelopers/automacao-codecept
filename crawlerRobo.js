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

arr = [1,2,3,4,5,6,7,8,9];
/*
asyncForEach(arr, (x) => sleep(1000)
    .then(() => console.log(x)))
    .then(() => console.log('Finished!'));

*/

function crawler(mesAno) {
    
    var url = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";
    var pages = parseInt($(".ui-paginator-current").text().split("/")[1].replace("]", "").trim()); 
    window.filiados = [];

    var total = parseInt($(".ui-paginator-current").text().split(" ")[9]); //4941;

    function log(message) {
        console.log(new Date().toLocaleTimeString() + ' - ' + message); 
    }

    function trocaPeriodo() {
        $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select option")
            .each(function (i, opt) {
                $(opt).removeAttr("selected"); 
            }); 

        // 06/2017
        if (mesAno !== undefined) {
            $("div [id='formTemplate:dataFunc:cbxCompetencia']")
                .find("select option[value='" + mesAno + "']")[0]
                .setAttribute("selected", "selected"); 
        }
        else {
            $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select option")[2]
            .setAttribute("selected", "selected"); 
        }
        
        // Call trigger 
        $("div [id='formTemplate:dataFunc:cbxCompetencia']").find("select").trigger("change");
        log('trigger para mudar a competência!');        
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

        log('trigger para mudar a quantidade de registros por página!'); 
        return wait(() => validaLinhas(9) && validaSeLoadingEstaOculto());
    }

    function trocaDePagina() {
        if ($("span.ui-paginator-page.ui-state-default.ui-corner-all.ui-state-active").length > 0){
            $("span.ui-paginator-page.ui-state-default.ui-corner-all.ui-state-active")
            .next()
            .trigger('click'); 

            log('trigger para mudar de página!');
        }
        return wait(() => validaLinhas(9) && validaSeLoadingEstaOculto());
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
                log('verificando se a modal está aberta para pegar os dados!');
                return wait( () => validaSeLoadingEstaOculto() && validaModal(true) )
                    .then( () => {
                        log('pegando dados da modal !');
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

    // - escolhe mês e ano!
    log('escolhe mês e ano! - ' + mesAno || "11/2017");
    trocaPeriodo();

    wait( () => validaLinhas(1) && validaSeLoadingEstaOculto())
        .then( () => {
            log('muda a quantidade de registros por página!'); 
            return trocaQuantPorPagina();
        })
        .then( () => {
            log('foram encontrados ' + total + ' registros');
            log('começa a capturar dados dos filiados!'); 
            var table = $(document.getElementById("formTemplate:dataFunc:colTable_data")); 
            
            var rows = $(table).find("tr");
            var p = new Promise((resolve, reject) => resolve() );
            
            arr = Array.from(rows);
            console.log(arr);
            asyncForEach(arr, (row) => sleep(5000)
                .then(() => {
                    //console.log(row);
                    //console.log('Linha: ' + $($(row).find("td")[1]).text().trim());
                    p = p.then(() => obtemDadosPorLinha(row)).then(servidor => {
                        log('dados do servidor: [' + servidor.NomeCompleto + ']'); 
                        console.log(servidor);
                        filiados.push(servidor);            
                    });
                }))
                .then(() => {
                    console.log('Finished!');
                    console.log(filiados);
                });
            
        })
        .then( () => {
            log('- Terminou - ');
            console.log(filiados);
        });
}

crawler("11/2017");