/*jshint esversion: 6 */
function crawler(){    
    /*jshint -W087 */    
    var url = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";
	var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
    var rows = $(table).find("tr");
    var pages = parseInt($(".ui-paginator-current").text().split("/")[1].replace("]","").trim());
    var timer = {};    
    var servidores = [];
    var total = parseInt($(".ui-paginator-current").text().split(" ")[9]);//4941;
    var timeout = 40000; // 60000 == 1 Min

    var setPeriod = function(){
        $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select option")
            .each(function(i, opt){
                $(opt).removeAttr("selected");
            });
        // 06/2017
        $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select option")[2]
            .setAttribute("selected", "selected");
        // Call trigger 
        $("div [id='formTemplate:dataFunc:cbxCompetencia']")
            .find("select").trigger("change");
        
        console.log('- Call trigger to set period! - ' + new Date().toLocaleTimeString());
    };

    var changePagination = function() {
        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .find("option")
            .each(function(i, opt){
                $(opt).removeAttr("selected");
            });
        // set value to get more results per page
        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .find("option[value='20']")
            .attr("selected", "selected");

        $("select[id='formTemplate:dataFunc:colTable_rppDD']")
            .trigger("change");

        console.log('- Call trigger to change pagination! - ' + new Date().toLocaleTimeString());
    };

    var getLine = function (tr) {
        var servidor = { 
            nome: $(tr).find("td")[1].innerText.trim(), 
            cargo: $(tr).find("td")[2].innerText.trim(), 
            lotacao: $(tr).find("td")[3].innerText.trim(),
            matricula: '',
            admissao: '',
            vencimentoBasico: '',
            liquido:''
        };
        console.log(servidor);
        console.log('- Call trigger to open modal with details! - ' + new Date().toLocaleTimeString());
        $($(tr).find("td")[0]).trigger("click");

        // Wait to open and to get the details
        setTimeout(function(){
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

                console.log('- Updated the object [servidor] - ' + new Date().toLocaleTimeString());
            }

            console.log(servidor);
            console.log('- Call trigger to close modal with details! - ' + new Date().toLocaleTimeString());
            $(".ui-dialog-titlebar-close").trigger("click");
            return servidor;

        }, 5000);
    };

    var getDataFromModal = function(servidor, tr){
        /*jshint -W087 */
        //debugger;
        //console.log(tr);        

        // - Call trigger to open modal with details!
        console.log('- Call trigger to open modal with details! - ' + new Date().toLocaleTimeString());
        $($(tr).find("td")[0]).trigger("click");

        // Wait to open and to get the details
        setTimeout(function(){
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

                    console.log('- Updated the object [servidor] - ' + new Date().toLocaleTimeString());
                }

        }, 30000);
        
        console.log('- After opening the modal with details! - ' + new Date().toLocaleTimeString());

        setTimeout(function(){
            console.log('- Entrou no setTimeout do getDataFromModal - ' + new Date().toLocaleTimeString());
            // Check if Dialog is visible!
            //if($("[role='dialog']")[1].style.display === "block"){
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

                    console.log('- Updated the object [servidor] - ' + new Date().toLocaleTimeString());
                }

                if(servidor.matricula.length <= 0) console.log('Merda!');
            //}
            console.log(servidor);
            
        }, 30000);

        // - Call trigger to close modal with details!
        setTimeout(function(){
            console.log('- Call trigger to close modal with details! - ' + new Date().toLocaleTimeString());
            $(".ui-dialog-titlebar-close").trigger("click");
        }, 5000);

        return servidor;
    };

    var getServidores = function(){
        var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
        var rows = $(table).find("tr");

        rows.each(function(i, tr){
            //debugger;
            if($(rows[i]).find("td").length > 1){
                setTimeout(function(){
                    console.log('- Entrou no index:[' + i + '] - ' + new Date().toLocaleTimeString());
                    console.log('- Dados da Linha:[' + i + '] - ' + new Date().toLocaleTimeString());
                    //var servidor = getLine(rows[i]);
                    
                    // setTimeout(function(){
                    //     console.log('- Entrou para pegar os detalhes da linha :[' + i + '] - ' + new Date().toLocaleTimeString());
                    //     servidor = getDataFromModal(servidor, rows[i]);
                    //     console.log(servidor);
                    //     console.log('- Pegou os detalhes da linha :[' + i + '] - ' + new Date().toLocaleTimeString());
                    // }, 30000);

                    var servidor = { 
                        nome: $(tr).find("td")[1].innerText.trim(), 
                        cargo: $(tr).find("td")[2].innerText.trim(), 
                        lotacao: $(tr).find("td")[3].innerText.trim(),
                        matricula: '',
                        admissao: '',
                        vencimentoBasico: '',
                        liquido:''
                    };
                    console.log(servidor);
                    console.log('- Call trigger to open modal with details! - ' + new Date().toLocaleTimeString());
                    $($(tr).find("td")[0]).trigger("click");

                    // Wait to open and to get the details
                    setTimeout(function(){
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

                            console.log('- Updated the object [servidor] - ' + new Date().toLocaleTimeString());
                        }

                        console.log(servidor);
                        console.log('- Call trigger to close modal with details! - ' + new Date().toLocaleTimeString());
                        $(".ui-dialog-titlebar-close").trigger("click");
                        return servidor;

                    }, 5000);

                    console.log('- Test Matricula: {' + servidor.matricula + '} - ' + new Date().toLocaleTimeString());
                    if(servidores.find(serv => serv.matricula === servidor.matricula) === undefined){
                        console.log('- Entrou no index:[' + i + '] - ' + new Date().toLocaleTimeString());
                        servidores.push(servidor);
                        console.log(servidores);
                    }

                    // Wait to call the next page
                    // setTimeout(function(){
                    //     // if(i === 9){
                    //     //     // Click to the next page for more results!
                    //     //     $(".ui-paginator-next").trigger("click");
                    //     //     console.log('- Call trigger to get the next page for more results! - ' + new Date().toLocaleTimeString());
                            
                    //     //     timer = setTimeout(function(){
                    //     //         console.log('- Call getServidores againg to get more data! - ' + new Date().toLocaleTimeString());
                    //     //         getServidores();
                    //     //     }, 30000);
                    //     // }

                    //     // if(servidores.length === total){
                    //     //     clearTimeout(timer);
                    //     //     console.log('- Call clearTimeout(timer) method to stop Crawler! - ' + new Date().toLocaleTimeString());
                    //     // }

                    // }, 40000);

                }, 20000);                
            }            
        });    
    };

    var execute = function(){
        // choose period -> 06/2017
        setPeriod();

        setTimeout(function(){
            // Change the Pagination to get more results!
            changePagination();

            // After changing pagination start the Crawler!
            setTimeout(function(){
                getServidores(table);

            }, 30000);

        }, timeout);
    };

    execute();
}




    function devilPost(){
        var postUrl = "http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml";

        $.ajax({
            url: postUrl,
            type: 'POST',
            dataType: 'xml',
            data: jQuery.param({ 
                'javax.faces.partial.ajax': true,
                'javax.faces.source': 'formTemplate:dataFunc:colTable',
                'javax.faces.partial.execute': 'formTemplate:dataFunc:colTable',
                'javax.faces.partial.render': 'formTemplate:colDetail',
                'javax.faces.behavior.event': 'rowSelect',
                'javax.faces.partial.event': 'rowSelect',
                'formTemplate:dataFunc:colTable_instantSelectedRowKey': 'javax.xml.bind.JAXBElement@1fa3d129',
                'formTemplate': 'formTemplate',
                'formTemplate:dataFunc': 'formTemplate:dataFunc',
                'formTemplate:dataFunc:cbxCompetencia_focus': '',
                'formTemplate:dataFunc:cbxCompetencia_input': '07/2017',
                'formTemplate:dataFunc:cbxCargo_focus': '',
                'formTemplate:dataFunc:cbxCargo_input': '',
                'formTemplate:dataFunc:nome': '',
                'formTemplate:dataFunc:colTable_rppDD': 20,
                'formTemplate:dataFunc:colTable_selection': 'javax.xml.bind.JAXBElement@1fa3d129',
                'javax.faces.ViewState': '4497142003737468346:308119096026829837',
                'javax.faces.ViewState': '4497142003737468346:308119096026829837'
            }),
            beforeSend: function(request) {
                request.setRequestHeader("Accept", 'application/xml, text/xml, */*;');
                //request.setRequestHeader("Accept-Encoding", 'gzip, deflate');
                request.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; charset=UTF-8');
                //request.setRequestHeader("Cookie", 'JSESSIONID=d6c7c260866a4612048c8d620da8');
                request.setRequestHeader("Faces-Request", 'partial/ajax');
                //request.setRequestHeader("Host", 'smgp.araucaria.pr.gov.br');
                //request.setRequestHeader("Origin", 'http://smgp.araucaria.pr.gov.br');
                //request.setRequestHeader("Proxy-Connection", 'keep-alive');
                //request.setRequestHeader("Referer", 'http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml');
                //request.setRequestHeader("User-Agent", 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36');
                request.setRequestHeader("X-Requested-With", 'XMLHttpRequest');                
            },
            success: function (response) {
                console.log(response);
                console.log(response.status);
            },
            error: function (data) {
                console.log("error: " + data);
            }
        }); 
    }