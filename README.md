# automacao-codecept

## Some commands needed - "as administrator"
$ Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force

$ npm install -g npm-windows-upgrade

$ npm-windows-upgrade

$ wget https://nodejs.org/download/release/latest/win-x64/node.exe -OutFile 'C:\Program Files\nodejs\node.exe'


$ [sudo] npm install -g selenium-standalone

$ selenium-standalone install

$ selenium-standalone start



"Nightmare":{
    "url":"http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml",
    "show": true,
    "restart":true,
    "windowSize": "1024x768"
},

$ npm install -g nightmare nightmare-upload

$ npm install -g codeceptjs

$ npm install codeceptjs-webdriverio --save-dev

$ codeceptjs run --steps

$ codeceptjs run --steps sismmar_test.js