# AgenteClisitef

Projeto para execução de pagamentos via API com o auxílio do serviço AgenteClisitef e um PinPad


## Como usar

Conecte um PinPad ao computador e execute a ultima versão do SitDemo



Instancie a classe de pagamentos e um vetor para guardar as transações:
```js
    let pag = new Pagamento()
    let transacoes = []
```

Instancie e popule uma ou mais transações(cartões) com os dados coletados:
```js
    let transacao1 = new DadosDeTransacao()
    let transacao2 = new DadosDeTransacao()
    let transacao3 = new DadosDeTransacao()

    transacao1.Funcao = FuncaoPagamento.DEBITO
    transacao1.Financiamento = FuncaoFinanciamento.A_VISTA
    transacao1.NumeroDeParcelas = FuncaoFinanciamento.A_VISTA
    transacao1.TipoCartaoSitef = TipoCartao.MAGNETICO_CHIP
    transacao1.Valor = 100
    transacao1.CupomFiscal = '000000'
    
    transacao2.Funcao = FuncaoPagamento.CREDITO
    transacao2.Financiamento = FuncaoFinanciamento.A_VISTA
    transacao2.NumeroDeParcelas = FuncaoFinanciamento.A_VISTA
    transacao2.TipoCartaoSitef = TipoCartao.MAGNETICO_CHIP
    transacao2.Valor = 1000
    transacao2.CupomFiscal = '000000'

    transacao3.Funcao = FuncaoPagamento.CREDITO
    transacao3.Financiamento = FuncaoFinanciamento.PARCELADO
    transacao3.NumeroDeParcelas = 5
    transacao3.TipoCartaoSitef = TipoCartao.MAGNETICO_CHIP
    transacao3.Valor = 10000
    transacao3.CupomFiscal = '000000'

    transacoes.push(transacao1, transacao2, transacao3)
```


Agora, só iniciar um pagamento
```js
    pag.inicarPagamento(transacoes)
```


## License
[MIT](https://choosealicense.com/licenses/mit/)