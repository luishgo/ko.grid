define(['jquery', 'knockout', 'bootstrap', 'knockout-projections'], function($, ko, Grid) {

  ko.components.register('pager', { require: 'components/pager/pager' });
  ko.components.register('grid', { require: 'components/grid/grid' });

  var vm = {
    pager: {
      currentPageIndex: ko.observable(0),
      dataSize: ko.observable(30),
      pageSize: ko.observable(5)
    },
    dataLoader: function(columns, pager, data) {
      console.log(pager.currentPageIndex());
      data([
        {id: 1, name: 'Luis'},
        {id: 2, name: 'Luis H'},
      ])
    }  
  }

  document.vm = vm;

  ko.applyBindings(vm);


});