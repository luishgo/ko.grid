define(["knockout", "text!./pager.html"], function(ko, pagerTemplate) {

  // Paginador
  var Pager = function Pager(params) {
    this.dataSize = params && params.dataSize || ko.observable(0);
    this.pageSize =  params && params.pageSize || ko.observable(25);
    this.availablePageSizes = ko.observableArray(['15', '25', '50', '100', '500', 'Tudo']);

    this.selectedPageSize = this.pageSize == 10000 ? ko.observableArray(['Tudo']) : ko.observableArray([this.pageSize.toString()]);

    this.currentPageIndex = params && params.currentPageIndex || ko.observable(0);

    this.maxPageIndex = ko.computed(function () {
      return Math.ceil(this.dataSize() / this.pageSize()) - 1;
    }, this);

  }

  Pager.prototype.pageSizeChange = function() {
    this.pageSize(this.selectedPageSize() == 'Tudo' ? 10000 : this.selectedPageSize() || 25);
    this.currentPageIndex(0);
  };

  return { viewModel: Pager, template: pagerTemplate };

});

