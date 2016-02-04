define(["knockout", "text!./grid.html", "./columns"], function(ko, template, Column) {
    "use strict";

    var Grid = function(params) {
        var self = this;
        
        this.pagerOptions = params.pager;
        if(params.grid) {
            // Se houver uma opção chamada "grid", consideramos que todos os parâmetros
            // estarão dentro dela (exceto o pager)...
            params = params.grid;
        } //... caso contrário, os parâmetros serão obtidos individualmente a partir de "params" mesmo

        // Colunas
        this.columns = Column.createColumns({columns: params.columns});

        this.idColumn = new Column({name: params.idColumn});

        // Coluna de ações para cada linha
        this.actions = params.actions;

        // Seleção de linhas
        // 'checkbox', 'radio' ou null/'none'
        this.selectionType = params.selectionType;

        // Linhas
        this.rows = ko.observableArray();

        this.allSelected = ko.observable(false);
        this.allSelected.subscribe(function(newValue) {
            ko.utils.arrayForEach(this.rows(), function(row) {
                row.selected(newValue);
            });
        }, this);

        this.initializeSingleRow = function(newRow) {
            newRow.selected = ko.observable(false);
        };

        this.initializeRows = function(newRows) {
            var rows = [];
            ko.utils.arrayForEach(newRows, function(newRow) {
                self.initializeSingleRow(newRow);
                rows.push(newRow);
            });
            self.rows.removeAll();
            self.rows(rows);
        };
        
        this.allReady = params.allReady;

        this.forceUpdate = ko.observable();
        
        ko.computed(function() {
            self.allSelected(false);

            self.forceUpdate();

            if(!self.allReady || self.allReady()) {
                var pager = self.pagerOptions && self.pagerOptions.viewModel ? self.pagerOptions.viewModel() : undefined;
                params.dataLoader(self.columns, pager, self.initializeRows);
            }
        }).extend({throttle: 1});

        if(params.viewModel) { // permitir o acesso externo ao viewModel criado
            params.viewModel(self);
        }
        if(params.ready) {
            self.ready = params.ready;
            self.ready(true);
        }
    };

    return {viewModel: Grid, template: template};
});