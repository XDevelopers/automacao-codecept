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

    //return new Promise((resolve, reject) => {});

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
        return {
            nome:$($(tr).find("td")[1]).text().trim(), 
            cargo:$($(tr).find("td")[2]).text().trim(), 
            lotacao:$($(tr).find("td")[3]).text().trim(), 
            matricula:'', 
            admissao:'', 
            vencimentoBasico:'', 
            liquido:''
        };
    }

    // - escolhe mês e ano!
    log('escolhe mês e ano!' + mesAno); 
    setPeriod(); 

    var getDadosModal = function (intevalo, tr) {
        // abre modal para capturar os demais dados do servidor atual!
        log('abre a modal para capturar os demais dados do servidor atual - [' + servidor.nome + '] !'); 
        $($(tr).find("td")[0]).trigger("click");

        if (checkLoadingIsHide() && checkDialog(true)) {
            console.log('limpou');
            clearInterval(intevalo);            
        }
    };

    var interval1 = setInterval(function () {
        
        log('aguardando carregamento da tabela!'); 
        if (checkLines(1) && checkLoadingIsHide()) {
            clearInterval(interval1); 

            log('muda a quantidade de registros por página!'); 
            changePagination(); 

            var interval2 = setInterval(function () {
                
                log('aguardando carregamento da tabela!'); 
                if (checkLines(9) && checkLoadingIsHide()) {
                    clearInterval(interval2); 
                    
                    log('começa a capturar dados dos servidores!'); 
                    var table = $(document.getElementById("formTemplate:dataFunc:colTable_data")); 
                    var rows = $(table).find("tr");

                    for (var i = 0; i < rows.length; i++) {
                        var tr = rows[i];

                        // pega os primeiro dados da grid normal!
                        var servidor =  getLineData(tr);

                        log('dados do servidor: [' + servidor.nome + ']'); 
                        console.log(servidor);

                        var interval3 = setInterval(getDadosModal(interval3, tr), 5000);
                    }
                }

            }, 5000); 
        }

    }, 5000);

}