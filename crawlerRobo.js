function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

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
arr = [1,2,3,4,5,6,7,8,9]
asyncForEach(arr, (x) => sleep(1000).then(() => console.log(x)))
  .then(() => console.log('Finished!'))

function crawler(mesAno) {
    
    var url = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";
    var pages = parseInt($(".ui-paginator-current").text().split("/")[1].replace("]", "").trim()); 
    var servidores = []; 
    var servidor =  {
        nome:'', 
        cargo:'', 
        lotacao:'', 
        matricula:'', 
        admissao:'', 
        vencimentoBasico:'', 
        liquido:''
    }; 
    var total = parseInt($(".ui-paginator-current").text().split(" ")[9]); //4941;

    function log(message) {
        console.log(new Date().toLocaleTimeString() + ' - ' + message); 
    }

    function setPeriod() {
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

    function changePagination() {
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
        return wait( () => checkLines(9) && checkLoadingIsHide());
    }

    function checkLines(lines) {
        return $(document.getElementById("formTemplate:dataFunc:colTable_data")).find("tr").size() > lines; 
    }

    function checkDialog(visible) {
        if (visible) {
            return $(document.getElementById('formTemplate:j_idt11')).css("display") === "block"; 
        }
        else {
            return $(document.getElementById('formTemplate:j_idt11')).css("display") === "none"; 
        }
    }

    function checkLoadingIsHide() {
        return $(document.getElementById('formTemplate:j_idt9')).css("display") === "none"; 
    }

    function step(iteration) {
        if (iteration === 10)return; 
        setImmediate(() =>  {
            console.log('setImmediate iteration:${iteration}');
            step(iteration + 1); // Recursive call from nextTick handler. 
        });
    }
    //step(0);

    function getLineData(tr){
        console.log('getLineData', tr);
        var $tr = $(tr);
        return new Promise((resolve, reject) => {
            var dados = {
                nome:$($tr.find("td")[1]).text().trim(), 
                cargo:$($tr.find("td")[2]).text().trim(), 
                lotacao:$($tr.find("td")[3]).text().trim(), 
                matricula:'', 
                admissao:'', 
                vencimentoBasico:'', 
                liquido:''
            };

            $($tr.find("td")[0]).trigger("click");

            return sleep(20000).then( () => {
                log('verificando se a modal está aberta para pegar os dados!');
                return wait( () => checkLoadingIsHide() && checkDialog(true)).then( () => {
                    log('pegando dados da modal !');
                    var tbData = $($("[role='grid']")[0]); 
                    var currentName = dados.nome; 
                    var nome = tbData.find("tr")[1].children[1].innerText.trim();
                    console.log(nome);
                    if (currentName === nome) {
                        var tbProventos = $($("[role='grid']")[1]); 
                        var tbRendimentos = $($("[role='grid']")[3]); 

                        dados.matricula = tbData.find("tr")[0].children[1].innerText.trim(); 
                        dados.admissao = tbData.find("tr")[2].children[1].innerText.trim(); 
                        dados.vencimentoBasico = tbProventos.find("tr")[1].children[1].innerText.trim(); 
                        dados.liquido = tbRendimentos.find("tr td")[2].innerText.trim();
                    }

                    $(".ui-dialog-titlebar-close").trigger("click"); 
                    resolve(dados);
                })
            });
        });
    }

    // - escolhe mês e ano!
    log('escolhe mês e ano! - ' + mesAno); 
    setPeriod(); 

    wait( () => checkLines(1) && checkLoadingIsHide())
        .then( () => {
            log('muda a quantidade de registros por página!'); 
            return changePagination();
        })
        .then( () => {
            log('começa a capturar dados dos servidores!'); 
            var table = $(document.getElementById("formTemplate:dataFunc:colTable_data")); 
            var rows = $(table).find("tr");

            var p = new Promise((resolve, reject) => resolve() );

            rows.each((_, tr) => {
                console.log('line: ' + $($(tr).find("td")[1]).text().trim());

                // pega os primeiro dados da grid normal!
                p = p.then(() => getLineData(tr)).then(servidor => {
                    log('dados do servidor: [' + servidor.nome + ']'); 
                    console.log(servidor);
                });
            });

            return p;
        });
}

crawler();