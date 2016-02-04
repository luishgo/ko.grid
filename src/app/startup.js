define(['jquery', 'knockout', 'bootstrap'], function($, ko) {

  ko.components.register('full-grid', { require: 'components/full-grid/full-grid' });

  var vm = {
    gridOptions: {
      viewModel: ko.observable(),
      pagerOptions: { dataSize: 34, pageSize: 10, viewModel: ko.observable() },  
      toolbarOptions: {},
      dataLoader: function(columns, pager, data) {
        console.log('Consultando dados');
        console.log(pager.currentPageIndex());
        console.log(pager.pageSize());
        console.log(columns.orderBy());
        console.log(columns.conditions());
        $.getJSON('app/dados.json', function(dados) {
          var begin = pager.currentPageIndex() * pager.pageSize();
          var end = begin + pager.pageSize();
          data(dados.slice(begin, end));
          if (columns.conditions() != '/-') {
            pager.filteredDataSize(20);
          } else {
            pager.filteredDataSize(pager.dataSize());
          }        
        })
      },
      columns: [
        {'name': 'numeroFormatado', 'displayName': 'Nº Processo', 'userDisplayTemplate': 'display_link_column'},
        {'name': 'municipio', 'displayName': 'Município'},
        {'name': 'orgao', 'displayName': 'Órgão'},
        {'name': 'relatorGabinete', 'displayName': 'Relator', 'style': {width: '200px'}},   
        {'name': 'tipo', 'displayName': 'Tipo', 'sortable': false},
        {'name': 'dataAbertura', 'displayName': 'Desde', 'userDisplayTemplate': 'as_date'},
        {'name': 'diasNaSituacao', 'displayName': 'Dias'},
        {'name': 'nmUltimoInstrutor', 'displayName': 'Último instrutor', 'style': {color: 'red'}},
        //Colunas Somente de Filtro
        {'name': 'dsSituacaoUltimoProtocolo', 'displayName': 'Situação do último protocolo', 'visible' : false, 'style': {color: 'gray'}},
        {'name': 'dsPendenciaUltimoProtocolo', 'displayName': 'Pendências do último protocolo', 'visible' : false},
      ],
      idColumn: 'id',
      actions: 'acoesLinhaGrid'      
    }
  }

  document.vm = vm;

  ko.applyBindings(vm);
});