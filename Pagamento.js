class Pagamento {

  constructor() {
    this.data = ''
    this.continua = 0
    this.transacao = ''
    this.clisitefApi = new AgenteClisitefAPI()
    this.clisitefApi.ConfigurarSitef(
      new ConfiguracoesSitef('127.0.0.1', '11400155', '5555555555',
                    '[17;18;19;28;34;35;3031;];', '11467807000155',
                    '11467807000155', 'CAIXA', 'SEXTA XERA'
                  )
    )
  }

  inicarPagamento = async(transacoes) => {
    let resp

    try {
      //Percorre o vetor de transações, realizando todas elas.
      for(let i = 0; i < transacoes.length; i++){
        this.transacao = transacoes[i]
        this.transacao.gerarDataHoraTransacao()
  
        //Inicia a transação enviando dados de configuração e da transação do index atual no laço "for".
        resp = await this.clisitefApi.startTransaction(await this.idSessaoAtual(), this.transacao)
          .then(response => { return response })
          .catch(error => { throw error })
        
        //Caso clisitefStatus seja 10000 signfica que a transação foi iniciada com sucesso
        //e está aguardando o "continueTransaction".
        if(resp.clisitefStatus === 10000){
          
          //Executa o conteudo do while pelo menos uma vez com o "do while" 
          //para confirmar que continua com estado de sucesso.
          do{
            resp = await this.clisitefApi.continueTransaction(await this.idSessaoAtual(), this.data, this.continua)
              .then(response => { return response })
              .catch(error => { throw error })
            
            //Executa e/ou guarda dados para envio para o Sitef de acordo
            //com o comando especificado em resp.commandId
            this.fluxoSitef(resp.commandId, resp.data)

            //Coleta os dados de transação. Ex.: Comprovante.
            //Os dados que serão guardados são identificados de acordo com o campo resp.fieldId
            //Tambem coleta os dados para uma transação com cartão digitado para envio ao Sitef. 
            this.coletaDadosDaTransacao(resp.fieldId, resp.data)
          }

          while(resp.clisitefStatus === 10000)
        }

        //Para de percorrer o laço de transações, caso alguma delas termine com estado diferente de 0(não OK) 
        if(resp.clisitefStatus != 0) break
      }

      //Bloco que finaliza a(s) transação(ões) dependendo do estado final da(s) mesma(s):
      //Caso de sucesso[== 0], confirma a(s) transação(ões) pendente(s)
      //Caso de falha[!= 0] cancela a(s) transação(ões) pendente(s)
      if (resp.clisitefStatus === 0) {
        await this.clisitefApi.finishTransaction(await this.idSessaoAtual(), this.transacao, 1)
          .then(response => { console.log(response) })
          .catch(error => { throw error })
      }
      else{
        await this.clisitefApi.finishTransaction(await this.idSessaoAtual(), this.transacao, 0)
          .then(response => { console.log(response) })
          .catch(error => { throw error })
      }
      console.log(transacoes)

    } 
    catch (error) { console.error(error) }
  }
  
   idSessaoAtual = async() => {
    let sessionResp = await this.clisitefApi.getSession()

    if (sessionResp.serviceStatus == 0) {
      return sessionResp.sessionId 
    }
    else{
      return await this.clisitefApi.createSession('00000000', 'REST0001')
        .then(response => { return response.sessionId })
        .catch(error => { throw error })
    }
  }

  cancelar = () => { this.continua = -1 }

  coletaDadosDaTransacao = (fieldId, buffer) => {
    switch (fieldId) {
      
      case 121: 
        //COMPROVANTE DA TRANSAÇÃO
        this.transacao.Comprovante = buffer
        break

      case 132: 
        //TIPO DO CARTÃO UTILIZADO
        this.transacao.TipoCartao = buffer
        break
      case 133:
        this.transacao.NsuSitef = buffer
        break
      case 134:
        this.transacao.NsuHost = buffer
        break
      case 157:
        this.transacao.CodigoEstabelecimento = buffer
        break

      //Coleta dos dados do cartão digitado
      case 512:
          this.data = this.transacao.NumeroCartaoDig
          break
      case 513:
          this.data = this.transacao.DataCartaoDig
          break
      case 514:
          this.data = this.transacao.CodigoCartaoDig
          break
    }
  }

  fluxoSitef = (comando, buffer) => {
    switch (comando){

      //Comandos que trazem mensagens no campo data
      case 1:
      case 2:
      case 3:
      case 22:
        console.log(buffer)
        break

      case 21: 
      console.log(this.transacao)
        //Caso o tipo do cartão seja "digitado(2)" ele solicitará o tipo. 
        //Caso contrário, solicitará a forma de financiamento.
        this.data = this.transacao.TipoCartaoSitef == 2 ? this.transacao.TipoCartaoSitef : this.transacao.Financiamento
        break
      case 30:
        this.data = this.transacao.NumeroDeParcelas
        break
    }
  }
}