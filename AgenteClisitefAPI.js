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