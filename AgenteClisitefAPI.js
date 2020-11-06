class AgenteClisitefAPI {

    constructor() {
        this.baseUrl = 'https://127.0.0.1/agente/clisitef'
        this.timeout = 10000
    }

    ConfigurarSitef(configSitef) {
        this.ConfiguracoesSitef = configSitef
    }

    async requisicaoBase(requestMethod, requestUrl, parameters = null) {
        let requisicao = {
            url: `${this.baseUrl}/${requestUrl}`,
            method: requestMethod,
            data: parameters,
            timeout: this.timeout
        }
       
        return await $.ajax(requisicao)
        .then(response => {
            if(requestUrl != 'session') console.warn(`${requestUrl}: `, response)
            return response
        })
        .catch((error) => {
            error = !error.responseJSON ? error : error.responseJSON.serviceMessage
            throw new Error(`Falha na requisição "${requestUrl}":\n ${error}`)
        })
    }
    
    async sitefState() {
        return await this.requisicaoBase('GET', 'state')
    }

    async createSession(storeId, terminalId) {
        const parametros = {
            sitefIp: this.ConfiguracoesSitef.ip,
            storeId: storeId,
            terminalId: terminalId,
            trnInitParameters: this.ConfiguracoesSitef.parametrosAdicionaisTransacao
        }

       return await this.requisicaoBase('POST', 'session', parametros)
    }

    async getSession() {
        return await this.requisicaoBase('GET', 'session')
    }

    async deleteSession() {
        return await this.requisicaoBase('delete', 'session')
    }

    async startTransaction(sessionId, transacao) {
        const parametros = {
            sessionId: sessionId,
            functionId: transacao.Funcao,
            trnAmount: transacao.Valor,
            taxInvoiceNumber: transacao.CupomFiscal,
            taxInvoiceDate: transacao.DataFiscal,
            taxInvoiceTime: transacao.HoraFiscal,
            sitefIp: this.ConfiguracoesSitef.ip,
            cashierOperator: this.ConfiguracoesSitef.operador,
            trnAdditionalParameters: this.ConfiguracoesSitef.parametrosAdicionaisTransacao,
            trnInitParameters: this.ConfiguracoesSitef.parametrosAdicionaisConfiguracao
        }

        return await this.requisicaoBase('POST', 'startTransaction', parametros)
    }

    async continueTransaction(sessionId, params, cod) {
        const parametros = {
            sessionId: sessionId,
            continue: cod,
            data: params
        }

        return await this.requisicaoBase('POST', 'continueTransaction', parametros)
    }

    async finishTransaction(sessionId, transacao, confirma) {
        const parametros = {
            sessionId: sessionId,
            taxInvoiceNumber: transacao.CupomFiscal,
            taxInvoiceDate: transacao.DataFiscal,
            taxInvoiceTime: transacao.HoraFiscal,
            confirm: confirma
        }

        return await this.requisicaoBase('POST', 'finishTransaction', parametros)
    }

    async finishOutTransaction(sessionId, transacao, confirma) {
        const parametros = {
            sessionId: sessionId,
            sitefIp: this.ConfiguracoesSitef.sitefIp,
            storeId: this.ConfiguracoesSitef.storeId,
            terminalId: this.ConfiguracoesSitef.terminalId,
            taxInvoiceNumber: transacao.CupomFiscal,
            taxInvoiceDate: transacao.DataFiscal,
            taxInvoiceTime: transacao.HoraFiscal,
            confirm: confirma
        }

        return await this.requisicaoBase('POST', 'finishTransaction', parametros)
    }
}


// async resetTransactions () {
//     let context = this
//     let trn = {};
//     let pendingTrn = [];
//     let taxInvoiceNumber;
//     let taxInvoiceDate;
//     let taxInvoiceTime;
//     let hasTransactionPending;
//     let addparams = context.config.trnDisabled + "[ParmsClient=1=" + context.config.cnpjLoja + ";2=" + context.config.cnpjCF + ";]";
//     let initParams =  "[ParmsClient=1=" + context.config.cnpjLoja + ";2=" + context.config.cnpjCF + "]";
//     //context.showMessage('info', "Verificando Transações", '');
//     await fs.access(`axios{__static}/data/cupom.json`, fs.F_OK, async (err) => {
//         if (err) {
//             console.error(err);
//             let dataStart = {
//                 sitefIp: context.config.ipSitef,
//                 storeId: context.config.storeId,
//                 terminalId: "CF" + context.config.serial.substring(4),
//                 comprovante: "",
//                 comprovante2: "",
//                 forma_pagamento: "",
//                 nParcelas: "",
//                 nsuSitef: "",
//                 nsuHost: "",
//                 codEstabelecimento: "",
//                 tipoCartao: "",
//                 sessionId: "",
//             Id: "",
//                 trnAmount: "",
//                 taxInvoiceNumber: "",
//                 taxInvoiceDate: "",
//                 taxInvoiceTime: "",
//                 cashierOperator: "CAIXA",
//                 trnAdditionalParameters: addparams,
//                 trnInitParameters: initParams,
//                 agreementCode: "",
//                 confirma: "0",
//             };
//             await context.setCupom(dataStart);
//         }
//         let cupom = await context.getCupom().then(response => {
//             return response;
//         }).catch(error => {
//             console.log(error)
//         });
//         if (cupom === undefined || cupom === "" || cupom === null) {
//             let dataStart = {
//                 sitefIp: context.config.ipSitef,
//                 storeId: context.config.storeId,
//                 terminalId: "CF" + context.config.serial.substring(4),
//                 comprovante: "",
//                 comprovante2: "",
//                 forma_pagamento: "",
//                 nParcelas: "",
//                 nsuSitef: "",
//                 nsuHost: "",
//                 codEstabelecimento: "",
//                 tipoCartao: "",
//                 sessionId: "",
//             Id: "",
//                 trnAmount: "",
//                 taxInvoiceNumber: "",
//                 taxInvoiceDate: "",
//                 taxInvoiceTime: "",
//                 cashierOperator: "CAIXA",
//                 trnAdditionalParameters: addparams,
//                 trnInitParameters: initParams,
//                 agreementCode: "",
//                 confirma: "0",
//             };
//             await context.setCupom(dataStart);
//             cupom = await context.getCupom().then(response => {
//                 return response;
//             }).catch(error => {
//                 console.log(error)
//             });
//         }

//         cupom.terminalId = "CF" + context.config.serial.substring(4),
//         cupom.sitefIp = context.config.ipSitef;
//         cupom.storeId = context.config.storeId;
//         cupom.trnAdditionalParameters = addparams;
//         cupom.trnInitParameters = initParams;
//         await context.setCupom(cupom);
//         await context.abandonPackage(context.config.serial).catch(error => {
//             console.log(error)
//         });

//         let resp = await context.createSession(cupom).then(response => {
//             console.log("Sessao Criada na primeira vez:\n", response.sessionId);
//             return response;
//         }).catch(async error => {
//             console.error(error)
//         });
//         //Se o serviço falhar em iniciar uma sessão, irá tentar novamente.
//         while (resp == undefined || resp.serviceStatus !== 0 ) {
//             resp = await context.createSession(cupom).then(response => {
//                 return response;
//             }).catch(async error => {
//                 context.keepAlive()
//                 console.log(error);
//             });
//             console.log("Sessao Criada na segunda vez:\n" + resp.sessionId);
//         }

//         cupom.sessionId = resp.sessionId;
//         cupomId = "130";
//         console.log("Cupom: \n", cupom);
//         resp = await context.startTransaction(cupom).then(response => {
//             return response;
//         }).catch(error => {
//             console.log(error);
//         });

//         cupom.confirma = "0";
//         cupom.taxInvoiceDate = "00000000"
//         cupom.taxInvoiceNumber = "0000000"
//         cupom.taxInvoiceTime = "000000"

//         resp = await context.finishOutTransaction(cupom).then(response => {
//             return response;
//         }).catch(error => {
//             context.closeMessage()
//             console.log(error);
//         });
//         console.log("respFinish:", resp);
//     //     if (resp.clisitefStatus === 10000) {
//     //         let parametros = "";
//     //         resp = await context.continueTransaction(cupom.sessionId, data, "0").then(response => {
//     //             return response;
//     //         }).catch(error => {
//     //             console.log(error);
//     //         });
//     //         console.log("respContinue:\n", resp);
//     //         if(resp == undefined){
//     //             context.keepAlive()

//     //         }else{
//     //             while (resp.clisitefStatus === 10000) {
//     //                 resp = await context.continueTransaction(cupom.sessionId, data, "0").then(response => {
//     //                     return response;
//     //                 }).catch(error => {
//     //                     console.log(error);
//     //                 });
//     //                 console.log("respContinue:\n", resp);
//     //                 if(resp == undefined){
//     //                     context.keepAlive()

//     //                 }else{
//     //                     if (resp.fieldId === 210 && resp.data !== "0") {
//     //                         hasTransactionPending = true;
//     //                         console.log("************>>>>>>>>>>>>>: ", resp.parametros);
//     //                         context.showMessage('info', "Cancelando transações pendentes...", '');
//     //                     }
//     //                     else if(resp.fieldId === 210 && resp.parametros == "0"){
//     //                         context.closeMessage();
//     //                     }
//     //                     switch (resp.fieldId) {
//     //                         case 160:
//     //                             taxInvoiceNumber = resp.data;
//     //                             break;
//     //                         case 163:
//     //                             taxInvoiceDate = resp.data;
//     //                             break;
//     //                         case 164:
//     //                             taxInvoiceTime = resp.data;
//     //                             break;
//     //                         case 161:
//     //                             trn = {
//     //                                 taxInvoiceNumber: taxInvoiceNumber,
//     //                                 taxInvoiceDate: taxInvoiceDate,
//     //                                 taxInvoiceTime: taxInvoiceTime,
//     //                                 sessionId: resp.sessionId,
//     //                                 confirma: "0",
//     //                                 storeId: cupom.storeId,
//     //                                 terminalId: cupom.terminalId,
//     //                                 sitefIp: cupom.sitefIp
//     //                             };
//     //                             pendingTrn.push(trn);
//     //                             break;
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     }
//     //     //Verifica se tem transação pendente
//     //     if (resp.clisitefStatus !== 10000 && hasTransactionPending) {
//     //         cupom.confirma = "0";
//     //         resp = await context.finishOutTransaction(cupom).then(response => {
//     //             return response;
//     //         }).catch(error => {
//     //             context.closeMessage()
//     //             console.log(error);
//     //         });
//     //         // console.log("teste");
//     //         // for (let i in pendingTrn) {
//     //         //     console.log(pendingTrn[i]);
//     //         //     resp = await context.finishOutTransaction(pendingTrn[i]).then(response => {
//     //         //         return response;
//     //         //     }).catch(error => {
//     //         //         console.log(error);
//     //         //     });
//     //         //     console.log("respFinish:", resp);
//     //         // }
//     //         // //verifica se é possivel extornar
//     //         // let verifyRefund = await context.verifyRefund(cupom).then(resp => {
//     //         //     return resp.data;
//     //         // });
//     //         // console.log("Verify Refund: ", verifyRefund);
//     //         // if (verifyRefund.status === 200) {
//     //         //     //realiza extorno
//     //         //     let confirmRefund = await context.confirmRefund(cupom).then(resp => {
//     //         //         return resp.data;
//     //         //     });
//     //         //     console.log("Refund", confirmRefund);
//     //         // }
//     //         // setTimeout(() => {
//     //         //     context.showMessage('ok', 'Transação cancelada!', ' ')
//     //         //     setTimeout(() => {
//     //         //         context.closeMessage()
//     //         //     }, 3000);
//     //         // }, 2000);
//     //     } else { // se n tiver transação pendente, finaliza fora de uma transação
//     //         console.log("finalizou pelo else");
//     //         cupom.confirma = "0";
//     //         resp = await context.finishOutTransaction(cupom).then(response => {
//     //             return response;
//     //         }).catch(error => {
//     //             context.closeMessage()
//     //             console.log(error);
//     //         });
//     //         console.log("respFinish:", resp);
//     //         context.closeMessage()
//     //     }
//     })
// }