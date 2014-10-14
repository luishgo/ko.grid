define(['jquery', 'knockout', 'bootstrap', 'knockout-projections'], function($, ko, Grid) {

  ko.components.register('pager', { require: 'components/pager/pager' });
  ko.components.register('grid', { require: 'components/grid/grid' });
  ko.components.register('filter', { require: 'components/filter/filter' });

  var vm = {
    pager: {
      currentPageIndex: ko.observable(0),
      dataSize: ko.observable(30),
      pageSize: ko.observable(5)
    },
    dataLoader: function(columns, pager, data) {
      console.log(pager.currentPageIndex());
      console.log(columns.serialize());
      data([
        {id: 1, name: 'Luis'},
        {id: 2, name: 'Luis H'},
      ])
    },
    columns: ko.observableArray([
      {'name': 'id', 'displayName': 'ID'},
      {'name': 'name', 'displayName': 'Name'},
    ])
  }

  document.vm = vm;

  ko.applyBindings(vm);


});