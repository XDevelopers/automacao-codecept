'use strict'; 
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor( {

        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.
        baseQueryString : 'http://smgp.araucaria.pr.gov.br/PortalTransparencia/faces/restricted/dataFunc.xhtml',
        pagePrimeiroAcesso : {
            pergunta: 'De qual forma você deseja receber o seu primeiro acesso?',
            buttonPorEmail: 'E-mail',   //'input[id=PrimeiroAcessoPorEmail]',
            buttonPorCelular: 'input[id=PrimeiroAcessoPorCelular]',
            buttonCancelar: 'input[id*=Cancelar]',
            buttonEnviar: 'Enviar',
        },
        pageEsqueciMinhaSenha : {
            pergunta : 'De qual forma você deseja recuperar a senha?',
            buttonPorEmail: 'E-mail',   //'input#btnTrocarSenhaEmail'
            buttonPorCelular: 'Celular',
            buttonCancelar: 'input[id*=Cancelar]',
            buttonEnviar: 'Enviar',
            campoEmail: 'input[id=txtEmail]',
            campoCelular: '[id=txtCelular]',
            msgConfirmeEmail: 'Confirme seu E-mail para enviarmos um link de cadastro para uma nova senha!',
            msgConfirmeCelular: 'Confirme seu Celular para enviarmos um SMS com um link de cadastro para uma nova senha!'
            
        },
        pageMensagem:{
            msgSucessoEmail : 'O e-mail foi enviado com sucesso. Dentro de alguns minutos verifique sua caixa de e-mail.',
            msgSucessoCelular: 'O SMS foi enviado com sucesso. Dentro de alguns minutos verifique a mensagem no seu celular .',
            msgAcessoValido : 'O usuário já realizou um acesso válido no sistema',
            msgCelularNaoCorresponde: 'O número de celular não corresponde com o cadastrado no sistema. Entre em contato com o seu RH.'
        },
        pageLogin : {
            campoUsuario : 'input[id=txtUsuario]',
            buttonEsqueciSenha: 'Esqueci minha senha',
            buttonPrimeiroAcesso: 'Primeiro acesso'
        },
        readFileData : function(){
            
        }
    }); 
}