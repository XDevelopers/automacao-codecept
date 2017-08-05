const fs = require("fs");
//var input = require('./input.json');
const output = require('codeceptjs').output;
var appNumber = "";

// try {
//     var inputFromCLI = JSON.parse(process.env.input);
//     Object.keys(inputFromCLI).forEach(function mergeInput (key) {
//         input[key] = inputFromCLI[key];
//     });
// } catch (error) {
//     console.log("{status:'error',applicationNumber:'',message:'missing input'}");
// }

Feature('Crawler');

Scenario('End to End Crawler', function* (I) {

    var servidores = [{}];

    // load the main page
    I.amOnPage("http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml");
    I.wait(30);

    // set the period
    // select element by label, choose option by text
    I.selectOption('select[id="formTemplate:dataFunc:cbxCompetencia_input"]','06/2017');
    I.wait(15);

    // change the pagination to return more results!
    I.selectOption('select[id="formTemplate:dataFunc:colTable_rppDD"]', '20');
    I.wait(30);

    // start to get data from datagrid, and start to mount the main object;
    // create output object
    var output = Object.assign({
        // nome -> $('tbody[id="formTemplate:dataFunc:colTable_data"]').find("tr td")[1];
        //var password = yield I.grabTextFrom('#password');
        nomeCompleto: yield I.grabValueFrom('tbody[id="formTemplate:dataFunc:colTable_data"] tr td:eq(1)'),
    }, input);

    // export output
    fs.writeFile("output.json", JSON.stringify(output), "utf8");

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

    // // login into Merchant Portal
    // I.fillField("#username", input.merchantUsername);
    // I.fillField("#password", input.merchantPassword);
    // I.click("#log-in");

    // I.wait(15);

    // // see the dashboard
    // I.seeInCurrentUrl("/#/dashboard");
    // I.see("Welcome KRYSTAL BROWN");
    // I.seeElement("//a[@href='#/dtm-application']");

    // // start new Application
    // I.click("//a[@href='#/dtm-application']");

    // I.wait(10);

    // // see the short form step
    // I.seeInCurrentUrl("/#/dtm-application/type:dtm-v2/id:");
    // I.seeElement("//ui-input[@name='firstName']");
    // I.seeElement("//ui-input[@name='lastName']");
    // I.seeElement("//ui-options[@name='dobMonth']");
    // I.seeElement("//ui-input[@name='dobDay']");
    // I.seeElement("//ui-input[@name='dobYear']");
    // I.seeElement("//ui-input[@name='ssn']");
    // I.seeElement("//ui-input[@name='email']");
    // I.seeElement("//ui-input[@name='address']");
    // I.seeElement("//ui-input[@name='city']");
    // I.seeElement("//ui-options[@name='state']");
    // I.seeElement("//ui-input[@name='zip']");
    // I.seeElement("//ui-input[@name='phone']");
    // I.seeElement("//ui-options[@name='homeOwnership']");
    // I.seeElement("//ui-input[@name='rentMortgagePayment']");
    // I.seeElement("//ui-input[@name='annualGrossIncome']");
    // I.seeElement("//ui-options[@name='employmentStatus']");
    // I.seeElement("//ui-input[@name='loanAmount']");
    // I.seeElement("//ui-checkbox[@name='agreeToTerms']");
    // I.seeElement("//ui-checkbox[@name='consentToESign']");
    // I.seeElement("#submit");

    // // fill the short-form
    // I.fillField("ui-input[name='firstName'] input", input.firstName);
    // I.fillField("ui-input[name='lastName'] input", input.lastName);
    // I.selectOption("ui-options[name='dobMonth'] select", input.dobMonth);
    // I.fillField("ui-input[name='dobDay'] input", input.dobDay);
    // I.fillField("ui-input[name='dobYear'] input", input.dobYear);
    // I.fillField("ui-input[name='ssn'] input", input.ssn);
    // I.fillField("ui-input[name='email'] input", input.email);
    // I.fillField("ui-input[name='address'] input", input.address);
    // I.fillField("ui-input[name='city'] input", input.city);
    // I.selectOption("ui-options[name='state'] select", input.state);
    // I.fillField("ui-input[name='zip'] input", input.zipCode);
    // I.fillField("ui-input[name='phone'] input", input.phoneNumber);
    // I.selectOption("ui-options[name='homeOwnership'] select", input.homeOwnership);
    // I.fillField("ui-input[name='rentMortgagePayment'] input", input.rentMortgagePayment);
    // I.fillField("ui-input[name='annualGrossIncome'] input", input.annualGrossIncome);
    // I.selectOption("ui-options[name='employmentStatus'] select", input.employmentStatus);
    // I.fillField("ui-input[name='loanAmount'] input", input.loanAmount);

    // // agree with terms and e-sign consent
    // I.checkOption("ui-checkbox[name='agreeToTerms'] input");
    // I.checkOption("ui-checkbox[name='consentToESign'] input");

    // // submit the application
    // I.click("#submit");

    // // wait for soft-pull, business rules and data verification
    // I.wait(65);

    // // see available offers
    // I.see("Congratulations! You Qualify for $15,000.00");
    // I.seeElement("//ui-button[contains(.,'Get This Loan')]");

    // // get preferred offer
    // I.click("//ui-button[contains(.,'Get This Loan')]");

    // I.wait(13);

    // // auto payment enrollment
    // I.seeElement("//input[@name='autoPay']");

    // // opt out for auto pay
    // I.checkOption("#radio2");
    // I.click("//button-primary[contains(., 'Continue')]");

    // I.wait(10);

    // // inject hidden field with application number
    // I.executeScript(function () {
    //     var applicationNumber = $("tila-doc").prop('applicationNumber');
    //     $("tila-doc").append("<input type='hidden' id='applicationNumber' value='" + applicationNumber + "' />");
    // });

    // I.wait(13);

    

    // console.log("{applicationNumber:'" + output.applicationNumber + "',status:'ok',message:''}");

    
    // // sign loan agreement
    // I.checkOption("//ui-checkbox[@name='agreeToTerms']//input");
    // I.click("//ui-button[contains(.,'Submit')]");

    // I.wait(10);

    // // completed the application
    // I.see("Your loan is ready to fund!");

});
