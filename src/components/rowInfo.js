export default [
    {
      name: 'PAIS ORIGEM',
      key: 'cargaPaisProcedenciaNome',
    },
    {
      name: 'CIDADE ORIGEM',
      key: 'fornecedorCidade',
    },
    {
      name: 'ESTADO DESTINO',
      key: 'importadorEnderecoUf'
    },
    {
      name: 'CIDADE DESTINO',
      key:'urfDespachoNome',
    },
    {
      name: 'DATA DO EMBARQUE',
      key:'conhecimentoCargaEmbarqueData',
    },
    {
      name: 'DI',
      key:'numeroDI',
    },
    {
      //Não existe no xml, fica ao lado de REFERENCIA LEADERLOG (RS): (perguntar)
      name: 'REF.',
      key:null,
    },
    {
      name: 'MODAL',
      key:'viaTransporteNome',
    },
    {
        name: 'VEICULO',
        key:'viaTransporteNomeVeiculo',
    },
    {
        name: 'MOEDA',
        key:'condicaoVendaMoedaNome',
    },
    {
        name: 'FOB',
        key:'condicaoVendaValorMoeda',
    },
    {
        
        name: 'FRETE',
        key:'freteValorMoedaNegociada',
    },
    {
        //(fob + frete)*10% 
        name: 'DESPESAS',
        key:'despesa',
    },
    {
        // (fob + frete + despesas)*10%
        name: 'L. ESPERADOS',
        key:'lucroEsperado',
    },
    {
        //Não encontrei
        name: 'IMPOSTOS (em Reais)',
        key: 'impostosEmReais',
    }
  ]