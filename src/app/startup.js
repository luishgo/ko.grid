define(['jquery', 'knockout', 'bootstrap'], function($, ko) {

  ko.components.register('pager', { require: 'components/pager/pager' });
  ko.components.register('grid', { require: 'components/grid/grid' });
  ko.components.register('filter', { require: 'components/filter/filter' });
  ko.components.register('full-grid', { require: 'components/full-grid/full-grid' });

  var vm = {
    pager: { dataSize: 34, pageSize: 10 },
    dataLoader: function(columns, pager, data) {
      console.log('Consultando dados');
      console.log(pager.currentPageIndex());
      console.log(pager.pageSize());
      console.log(columns.serialize());
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
      {'name': 'relatorGabinete', 'displayName': 'Relator'},   
      {'name': 'tipo', 'displayName': 'Tipo'},
      {'name': 'dataAbertura', 'displayName': 'Desde', 'userDisplayTemplate': 'as_date'},
      {'name': 'diasNaSituacao', 'displayName': 'Dias'},
      {'name': 'nmUltimoInstrutor', 'displayName': 'Último instrutor'},
      //Colunas Somente de Filtro
      {'name': 'dsSituacaoUltimoProtocolo', 'displayName': 'Situação do último protocolo', 'visible' : false},
      {'name': 'dsPendenciaUltimoProtocolo', 'displayName': 'Pendências do último protocolo', 'visible' : false},
    ],
    idColumn: 'id',
    actions: 'acoesLinhaGrid'
  }

  document.vm = vm;

  ko.applyBindings(vm);
});