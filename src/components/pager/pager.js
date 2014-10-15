define(["knockout", "text!./pager.html"], function(ko, pagerTemplate) {

  // Paginador
  var Pager = function Pager(params) {
    this.dataSize = params && params.dataSize || ko.observable(0);
    this.filteredDataSize = params && params.filteredDataSize || ko.observable(0);
    this.pageSize =  params && params.pageSize || ko.observable(25);
    this.currentPageIndex = params && params.currentPageIndex || ko.observable(0);

    this.maxPageIndex = ko.computed(function () {
      return Math.ceil(Math.min(this.dataSize(), this.filteredDataSize()) / this.pageSize()) - 1;
    }, this);

    this.minRows = ko.computed(function() {
      return this.currentPageIndex() * this.pageSize() + 1;
    }, this);

    this.maxRows = ko.computed(function() {
      var max = this.currentPageIndex() * this.pageSize() + this.pageSize();
      var limit = Math.min(this.dataSize(), this.filteredDataSize());
      return Math.min(max, limit);
    }, this);

  }

  return { viewModel: Pager, template: pagerTemplate };

});

