define(["knockout", "text!./grid.html"], function(ko, gridTemplate) {

  var Grid = function(params) {
    var self = this;
    this.rows = ko.observableArray();
    this.allSelected = ko.observable(false);
    this.allSelected.subscribe(function(newValue) {
        ko.utils.arrayForEach(this.rows(), function(row) {
            row.selected(newValue);
        });
    }, this);
    this.initializeRows = function(newRows) {
      var rows = [];
      ko.utils.arrayForEach(newRows, function(newRow) {
          newRow.selected = ko.observable(false);
          rows.push(newRow);
      });
      self.rows.removeAll();
      self.rows(rows);
    };
    ko.computed(function() {
      this.allSelected(false);
      params.dataLoader(this.columns, this.pager, this.initializeRows);
    }, this).extend({ throttle: 1 });
  }

  return { viewModel: Grid, template: gridTemplate };

});
