/// <reference path="./steps.d.ts" />
/*jshint esversion: 6 */
//'use strict'; 
// in this file you can append custom step methods to 'I' object


module.exports = function() {
    return actor({

        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.
        baseQueryString : 'http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml',        
        getDataPerLine : function(){
            
            // // -----------------------------------------------------------------------------------
            // // Aqui deve ser um Loop para pegar todos os dados por Linha
            // // -----------------------------------------------------------------------------------
            // // loop to get all records!
            // let rows = I.executeScript(function () {
            //     var table = $(document.getElementById("formTemplate:dataFunc:colTable_data"));
            //     return table.find("tr").length;
            // });

            // Exibir a quantidades de linhas
            I.say('Quantidade de registros por página: ' + rows);

            I.say('\n---- Current object! ---- \n');
        }
    }); 
};