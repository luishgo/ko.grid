define(["knockout", "text!./toolbar.html", 'jquery.mask'], function(ko, template) {
    
    var Toolbar = function(params) {
        var self = this;

        this.pager = params.pager;
        this.grid = params.grid;

        if(!params.toolbar) {
            this.includeToolbar = false;
            this.includeToolbarRefresh = false;
            this.includeToolbarDownload = false;
            this.includeToolbarFilter = false;
            this.includeToolbarPageSize = false;
            this.downloadLinkXLS = false;
            this.downloadLinkPDF = false;
            this.downloadLinkCSV = false;
        } else {
            // Barra de ferramentas
            this.includeToolbar = params.toolbar.includeToolbar !== false;

            // Botão para atualizar dados do grid
            this.includeToolbarRefresh = params.toolbar.includeToolbarRefresh !== false;

            // Botão para download dos dados do grid
            this.includeToolbarDownload = params.toolbar.includeToolbarDownload === true;

            // Links para download dos dados do grid
            this.downloadLinkXLS = params.toolbar.downloadLinkXLS;
            this.downloadLinkPDF = params.toolbar.downloadLinkPDF;
            this.downloadLinkCSV = params.toolbar.downloadLinkCSV;

            // Botão para filtrar dados do grid
            this.includeToolbarFilter = params.toolbar.includeToolbarFilter === true;

            // Quantidade de linhas apresentadas por página
            this.includeToolbarPageSize = params.toolbar.includeToolbarPageSize !== false;
        }

        this.filteredColumns = ko.computed(function() {
            if(self.grid.ready() ) {
                var columns = self.grid.viewModel().columns();
                return ko.utils.arrayFilter(columns, function(column) {
                    return column.filterCondition() != null;
                });
            } else {
                return [];
            }
        });

        this.notFilteredColumns = ko.computed(function() {
            if(self.grid.ready()) {
                var columns = self.grid.viewModel().columns();
                return ko.utils.arrayFilter(columns, function(column) {
                    return column.filterCondition() == null && column.filterable() == true;
                });
            } else {
                return [];
            }
        });

        this.update = function() {
            if(self.grid.ready()) {
                self.grid.viewModel().forceUpdate(true);
                self.grid.viewModel().forceUpdate(false);
            }
        }

        this.availablePageSizes = ko.observableArray([10, 15, 25, 50, 100, 500, 'Tudo']);

        this.selectedPageSize = this.pager.pageSize == 10000 ? ko.observableArray(['Tudo']) : ko.observableArray([this.pager.pageSize]);

        this.pageSizeChange = function() {
            if(self.pager.ready()) {
                self.pager.viewModel().pageSize(self.selectedPageSize()[0] === 'Tudo' ? 10000 : self.selectedPageSize()[0] || 25);
                self.pager.viewModel().currentPageIndex(0);
            }
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
            if(self.configurationPanel() == true) {
                self.configurationPanel(false);
            } else {
                self.configurationPanel(true);
            }

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

        this.addCondition = function(column, operation, value) {
            condition = new this.Condition(operation, value);
            column().filterCondition(condition);
            self.qtyFilterConditions(self.qtyFilterConditions() + 1);
            $('input#toolbar-filter-value').val('');
            self.pager.currentPageIndex(0);
        };

        this.removeCondition = function(column) {
            column.filterCondition(null);
            self.qtyFilterConditions(self.qtyFilterConditions() - 1);
            self.pager.currentPageIndex(0);
        };

        this.removeAllConditions = function(columns) {
            ko.utils.arrayForEach(columns(), function(column) {
                column.filterCondition(null);
            });
            self.qtyFilterConditions(0);
        };

        this.filterValue = function() {
            $('#toolbar-filter-value').val('');
            if(self.selectedColumn().displayTemplate === 'as_date') {
                $('#toolbar-filter-value').mask('99/99/9999');
            } else if(self.selectedColumn().displayTemplate === 'as_date_time') {
                $('#toolbar-filter-value').mask('99/99/9999 99:99');
            } else if(self.selectedColumn().displayTemplate === 'as_cpf') {
                $('#toolbar-filter-value').mask('999.999.999-99');
            } else {
                if(typeof $('#toolbar-filter-value').data('mask') !== 'undefined') {
                    $('#toolbar-filter-value').data('mask').remove();
                    $('#toolbar-filter-value').removeAttr('maxlength');
                    $('#toolbar-filter-value').removeAttr('autocomplete');
                }
            }
        };

        if(params.toolbar.viewModel) { // permitir o acesso externo ao viewModel criado
            params.toolbar.viewModel(this);
        }
        if(params.toolbar.ready) {
            self.ready = params.toolbar.ready;
            self.ready(true);
        }
    };

    return {viewModel: Toolbar, template: template};

});