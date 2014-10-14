define(["knockout", "text!./filter.html"], function(ko, filterTemplate) {

  var Filter = function(params) {
    var self = this;

    // Barra de ferramentas
    this.includeToolbar = params.includeToolbar || true;
    
    // Botão para atualizar dados do grid
    this.includeToolbarRefresh = params.includeToolbarRefresh || true;
    
    // Botão para download dos dados do grid
    this.includeToolbarDownload = params.includeToolbarDownload || false;
    
    // Links para download dos dados do grid
    this.downloadLinkXLS = params.downloadLinkXLS;
    this.downloadLinkPDF = params.downloadLinkPDF;
    this.downloadLinkCSV = params.downloadLinkCSV;

    // Botão para filtrar dados do grid
    this.includeToolbarFilter = params.includeToolbarFilter || false;

    // Quantidade de linhas apresentadas por página
    this.includeToolbarPageSize = params.includeToolbarPageSize || true;

    this.columns = params.columns;
    this.filteredColumns = ko.computed(function() {
      return ko.utils.arrayFilter(self.columns, function(column) {
        return column.filterCondition() != null;
      });
    });

    this.notFilteredColumns = ko.computed(function() {
      return ko.utils.arrayFilter(self.columns, function(column) {
          return column.filterCondition() == null && column.filterable() == true;
        });
    });

    this.availablePageSizes = ko.observableArray([15, 25, 50, 100, 500, 'Tudo']);

    this.pager = params.pager;

    this.selectedPageSize = this.pager.pageSize == 10000 ? ko.observableArray(['Tudo']) : ko.observableArray([this.pager.pageSize.toString()]);

    this.pageSizeChange = function() {
      self.pager.pageSize(self.selectedPageSize() == 'Tudo' ? 10000 : self.selectedPageSize()[0] || 25);
      self.pager.currentPageIndex(0);
    };

    this.configurationPanel = ko.observable(false);
    this.conditionOperations = ['=', '!=', 'contém', 'não contém', '<', '>'];
    this.selectedColumn = ko.observable();
    this.qtyFilterConditions = ko.observable(0);

    this.Condition = function(operation, value) {
      this.operation = operation;
      this.value = value;
    };

    this.toggleConfigurationPanel = function() {
      if(self.configurationPanel() == true){self.configurationPanel(false);} else {self.configurationPanel(true);}

      if(self.configurationPanel() == false) {
        if(self.qtyFilterConditions()) {
          $('#toolbar-button-filter').addClass('btn-info');
              $('#toolbar-button-filter').toggleClass('btn-inverse');
              $('#toolbar-button-filter i').toggleClass('icon-white');
        }
        else {
          $('#toolbar-button-filter').removeClass('btn-info');
              $('#toolbar-button-filter').toggleClass('btn-inverse');
              $('#toolbar-button-filter i').toggleClass('icon-white');
        }
      }
      else {
      $('#toolbar-button-filter').removeClass('btn-info');
          $('#toolbar-button-filter').toggleClass('btn-inverse');
          $('#toolbar-button-filter i').toggleClass('icon-white');
      }

    };

    this.addCondition = function(column, operation, value){
      condition = new this.Condition(operation, value);
      column().filterCondition(condition);
      self.qtyFilterConditions(self.qtyFilterConditions()+1);
      $('input#toolbar-filter-value').val('');
    };

    this.removeCondition = function(column){
      column.filterCondition(null);
      self.qtyFilterConditions(self.qtyFilterConditions()-1);
    };

    this.removeAllConditions = function(columns){
      ko.utils.arrayForEach(columns(), function(column) {
            column.filterCondition(null);
        });
      self.qtyFilterConditions(0);
    };

    this.filterValue = function() {
      $('#toolbar-filter-value').val('');      
      if (self.selectedColumn().displayTemplate == 'as_date') {
        $('#toolbar-filter-value').mask('99/99/9999');        
      } else if (self.selectedColumn().displayTemplate == 'as_date_time') {
        $('#toolbar-filter-value').mask('99/99/9999 99:99');      
      } else if (self.selectedColumn().displayTemplate == 'as_cpf') {
        $('#toolbar-filter-value').mask('999.999.999-99');      
      } else {
        if (typeof $('#toolbar-filter-value').data('mask') != 'undefined'){
          $('#toolbar-filter-value').data('mask').remove();
          $('#toolbar-filter-value').removeAttr('maxlength');
          $('#toolbar-filter-value').removeAttr('autocomplete');
        }
      }
    };


  }

  return {viewModel: Filter, template: filterTemplate};

});