class DadosDeTransacao{

    constructor()
    {
        this.Funcao = ''
        this.Valor = ''
        this.Financiamento = ''
        this.NumeroDeParcelas = ''
        this.CupomFiscal = ''
        this.PacoteHash = ''
        this.CupomFiscal = ''
        this.DataFiscal = ''
        this.HoraFiscal = ''
        this.DataHoraTransacao = ''
        this.Comprovante = ''
        this.TipoCartao = ''
        this.NsuSitef = ''
        this.NsuHost = ''
        this.CodigoEstabelecimento = '' 
        this.TipoCartaoSitef = ''
        this.NumeroCartaoDig = ''
        this.DataCartaoDig = ''
        this.CodigoCartaoDig = ''
    }

    gerarDataHoraTransacao = () => {
        let data, hora

        data = moment().format('DD/MM/YYYY')
        hora = moment().format('HH:mm:ss')

        this.DataFiscal = moment().format('YYYYMMDD')
        this.HoraFiscal = moment().format('HHmmss')
        this.DataHoraTransacao = `${data} ${hora}`
    }
}