class ConfiguracoesSitef{

    constructor(ip, idLoja, serial, trnAdd, cnpjLoja, cnpjCF, operador, mensagemPermanente)
    {
        this.ip = ip
        let id = serial.substring(-1, -4)
        this.idTerminal = id
        this.idLoja = idLoja
        this.cnpjLoja = cnpjLoja
        this.cnpjCF = cnpjCF
        this.operador = operador
        this.parametrosAdicionaisTransacao = trnAdd
        this.parametrosAdicionaisConfiguracao = trnAdd + "[ParmsClient=1=" + cnpjLoja + ";2=" + cnpjCF + ";]"
        this.mensagemPermanenteSitef = `  ${mensagemPermanente}  `
    }
}
