define(["knockout", "text!./pager.html"], function(ko, pagerTemplate) {

      // Paginador
  function Pager(params) {
    var self = this;

    this.dataSize = ko.observable(params && params.dataSize || 0);
    this.pageSize =  ko.observable(params && params.pageSize || 25);
    this.availablePageSizes = ko.observableArray(['15', '25', '50', '100', '500', 'Tudo']);

    this.selectedPageSize = this.pageSize == 10000 ? ko.observableArray(['Tudo']) : ko.observableArray([this.pageSize.toString()]);

    this.currentPageIndex = ko.observable(0);

    this.maxPageIndex = ko.computed(function () {
      return Math.ceil(this.dataSize() / this.pageSize()) - 1;
    }, this);

    this.pageSizeChange = function() {
      self.pageSize(self.selectedPageSize() == 'Tudo' ? 10000 : self.selectedPageSize() || 25);
      self.currentPageIndex(0);
    };
  }

  return { viewModel: Pager, template: pagerTemplate };

});

