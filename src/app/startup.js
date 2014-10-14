define(['jquery', 'knockout', 'components/pager/pager', 'components/grid/grid', 'bootstrap', 'knockout-projections'], function($, ko, Pager, Grid) {

  ko.components.register('pager', { viewModel: Pager.viewModel, template: Pager.template });
  ko.components.register('grid', { viewModel: Grid.viewModel, template: Grid.template });

  var vm = {
    dataLoader: function(columns, pager, data) {
      data([
        {id: 1, name: 'Luis'},
        {id: 2, name: 'Luis H'},
      ])
    }  
  }

  ko.applyBindings(vm);


});