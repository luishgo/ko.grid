define(["knockout", "text!./full-grid.html", 'components/full-grid/columns'], function(ko, template, Column) {

  var FullGrid = function(params) {
    this.pager = {
      currentPageIndex: ko.observable(0),
      dataSize: ko.observable(params.pager.dataSize || 0),
      pageSize: ko.observable(params.pager.pageSize || 0),
      filteredDataSize: ko.observable(params.pager.dataSize|| 0)
    };
    this.dataLoader = params.dataLoader;
    this.columns = Column.createColumns({columns: params.columns});
    this.idColumn = new Column({name: params.idColumn});
    this.actions = params.actions;
  }

  return {viewModel: FullGrid, template: template}
});