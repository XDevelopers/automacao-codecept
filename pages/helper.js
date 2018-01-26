/// <reference path="../steps.d.ts" />
/*jshint esversion: 6 */
//"use strict";

let I; 

module.exports =  {

    _init() {
        I = require('../steps_file.js')(); 
    }, 

    // insert your locators and methods here
    fields: {
        email:'#user_basic_email', 
        password:'#user_basic_password'
    }, 
    submitButton: {css:'#new_user_basic input[type=submit]'}, 

    sendForm(email, password) {
        I.fillField(this.fields.email, email); 
        I.fillField(this.fields.password, password); 
        I.click(this.submitButton); 
    }, 

    getDataPerLine: function*(rows) {
        
        let pages = yield I.executeScript( () => {
            return parseInt(document.getElementsByClassName("ui-paginator-current")[0].innerText.split(" ")[12].split("/")[1]);
        });
        I.say('Quantidade de páginas: ' + pages);

        var arrayPages = new Array(pages);
        var page;
        
        I.say('arrayPages length: ' + arrayPages.length);

        for (let index = 0; index < arrayPages.length; index++) {
            I.say(index);

            var test = yield I.getDataPerLine();


            
            I.wait(5);
        }

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
};