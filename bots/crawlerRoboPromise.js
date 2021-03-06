function crawler(mesAno){
    
    var url = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";
	//var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
    //var rows = $(table).find("tr");
    var pages = parseInt($(".ui-paginator-current").text().split("/")[1].replace("]","").trim());
    var servidores = [];
    var servidor = { 
        nome: '', 
        cargo: '', 
        lotacao: '',
        matricula: '',
        admissao: '',
        vencimentoBasico: '',
        liquido:''
    };
    var total = parseInt($(".ui-paginator-current").text().split(" ")[9]);//4941;

    //return new Promise((resolve, reject) => {});

    function log(message){
        console.log(new Date().toLocaleTimeString() + ' - ' + message);
    }

    function setPeriod(){
        $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select option")
            .each(function(i, opt){
                $(opt).removeAttr("selected");
            });

        // 06/2017
        if(mesAno !== undefined){
            $("div [id='formTemplate:dataFunc:cbxCompetencia']")
                .find("select option[value='" + mesAno + "']")[0]
                .setAttribute("selected", "selected");
        }
        else{
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
            .each(function(i, opt){
                $(opt).removeAttr("selected");
            });

        // set value to get more results per page
        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .find("option[value='20']")
            .attr("selected", "selected");

        $("select[id='formTemplate:dataFunc:colTable_rppDD']").trigger("change");

        log('trigger para mudar a quantidade de registros por página!');
    }

    function checkLines(lines){
        return $(document.getElementById("formTemplate:dataFunc:colTable_data")).find("tr").size() > lines;
    }

    // - escolhe mês e ano!
    return new Promise((resolve, reject) => {
        log('escolhe mês e ano!');

        // setPeriod();

        // var interval = setInterval(function(){
        //     log('aguardando carregamento da tabela!');
        //     if(checkLines(1)){
        //         clearInterval(interval);
        //         resolve();
        //     }
        // }.bind(this), 5000);

        resolve();
    })
    // - mudar a quantidade de registros por página!
    .then(function(response){
        return new Promise((resolve, reject) => {
            log('mudar a quantidade de registros por página!');
            // changePagination();

            // var interval = setInterval(function(){
            //     log('aguardando carregamento da tabela!');
            //     if(checkLines(1)){
            //         clearInterval(interval);
            //         resolve();
            //     }
            // }.bind(this), 5000);

            resolve();
        })
        // - começa a capturar dados dos funcionários!
        .then(function(response){
            log('começa a capturar dados dos servidores!');
            var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
            var rows = $(table).find("tr");
            var promiseArr = [];

            rows.map(function (i, tr) {
                promiseArr.push(
                    new Promise((resolve, reject) => {
                        var servidor = {
                            nome: $($(tr).find("td")[1]).text().trim(),
                            cargo: $($(tr).find("td")[2]).text().trim(),
                            lotacao: $($(tr).find("td")[3]).text().trim(),
                            matricula: '',
                            admissao: '',
                            vencimentoBasico: '',
                            liquido: ''
                        };
                        log('dados do servidor: [' + $($(tr).find("td")[1]).text() + ']');

                        return new Promise((resolve, reject) => {
                                // abre modal para capturar os demais dados do servidor atual!
                                log('abre a modal para capturar os demais dados do servidor atual!');
                                $($(tr).find("td")[0]).trigger("click");

                                var interval = setInterval(function(){
                                    //log('aguardando carregamento da tabela!');
                                    if($(document.getElementById('formTemplate:j_idt11')).css("display") === "block"){
                                        clearInterval(interval);
                                        //resolve();
                                    }
                                }.bind(this), 5000);
                            }).then(function(){
                                return new Promise((resolve, reject) => {
                                    console.log(servidor);

                                    var tbData = $($("[role='grid']")[0]);
                                    var currentName = servidor.nome;
                                    var nome = tbData.find("tr")[1].children[1].innerText.trim();
                            
                                    if(currentName === nome){
                                        var tbProventos = $($("[role='grid']")[1]);
                                        var tbRendimentos = $($("[role='grid']")[3]);

                                        servidor.matricula = tbData.find("tr")[0].children[1].innerText.trim();
                                        servidor.admissao = tbData.find("tr")[2].children[1].innerText.trim();
                                        servidor.vencimentoBasico = tbProventos.find("tr")[1].children[1].innerText.trim();
                                        servidor.liquido = tbRendimentos.find("tr td")[2].innerText.trim();

                                        console.log(servidor);
                                    }
                                    
                                    resolve();

                                }).then(function(){
                                    return new Promise((resolve, reject) => {
                                        // fecha a modal dos dados do servidor atual!
                                        log('fecha a modal dos dados do servidor atual!');
                                        $(".ui-dialog-titlebar-close").trigger("click");

                                        var interval = setInterval(function(){
                                        //log('aguardando carregamento da tabela!');
                                        if($(document.getElementById('formTemplate:j_idt11')).css("display") === "none"){
                                            clearInterval(interval);
                                            resolve();
                                        }
                                    }.bind(this), 5000);
                                    });                                
                                })
                                .then(function(){
                                    console.warn(servidor);
                                    resolve(servidor);
                                });     
                            });
                    })
                    .then(function(result){
                         console.warn(result);                 
                    })
                );
            });

            return Promise.all(promiseArr)
            .then(results => {
                console.log(results);
            });
            
        });
    });
}