const FuncaoFinanciamento = {
    A_VISTA: 1,
    PARCELADO: 2
}

const TipoCartao = {
    MAGNETICO_CHIP: 1,
    DIGITADO: 2
}

const FuncaoPagamento = {
    DEBITO:  2,
    CREDITO: 3
}

//Retorna o nome do Enum como String em lowerCase
enumString = (val, Enumerator) => {
    return Object.keys(Enumerator).find(i => Enumerator[i] === val).toLowerCase()
}

Object.freeze([FuncaoFinanciamento, TipoCartao, FuncaoPagamento])