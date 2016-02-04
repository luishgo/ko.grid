define(["knockout", "text!./pager.html"], function (ko, pagerTemplate) {
    "use strict";

    var Pager = function Pager(params) {
        var self = this;

        if(params.pager) {
            // Se houver uma opção chamada "pager", consideramos que todos os parâmetros
            // estarão dentro dela...
            params = params.pager;
        } //... caso contrário, os parâmetros serão obtidos individualmente a partir de "params" mesmo

        this.dataSize = ko.observable(params && params.dataSize || 0);
        this.filteredDataSize = ko.observable(params && params.filteredDataSize || this.dataSize());
        this.pageSize = ko.observable(params && params.pageSize || 25);
        this.events = params && params.events;

        this.maxPageIndex = ko.computed(function () {
            return Math.ceil(Math.min(this.dataSize(), this.filteredDataSize()) / this.pageSize()) - 1;
        }, this);
        
        var pageIndex;
        if(params && params.currentPageIndex !== null
                && typeof(params.currentPageIndex) !== 'undefined'
                && params.currentPageIndex >= 0) {
            if(params.currentPageIndex <= this.maxPageIndex()) {
                pageIndex = Number(params.currentPageIndex);
            } else {
                pageIndex = this.maxPageIndex();
            }
        } else {
            pageIndex = 0;
        }

        this.currentPageIndex = ko.observable(pageIndex);

        this.minRows = ko.computed(function () {
            if(Number(this.dataSize()) === 0) {
                return 0;
            } else {
                return this.currentPageIndex() * this.pageSize() + 1;
            }
        }, this);

        this.maxRows = ko.computed(function () {
            var max = this.currentPageIndex() * this.pageSize() + this.pageSize();
            var limit = Math.min(this.dataSize(), this.filteredDataSize());
            return Math.min(max, limit);
        }, this);

        this.anterior = function() {
            if(self.currentPageIndex() === 0) {
                return;
            }
            var newPageNumber = self.currentPageIndex() - 1;
            var podeProsseguir = true;
            if(self.events && self.events.beforePageChange) {
                podeProsseguir = self.events.beforePageChange(this, newPageNumber);
            }
            if(podeProsseguir) {
                self.currentPageIndex(newPageNumber);
            }
        };

        this.proximo = function() {
            if(self.currentPageIndex() === self.maxPageIndex()) {
                return;
            }
            var newPageNumber = self.currentPageIndex() + 1;
            var podeProsseguir = true;
            if(self.events && self.events.beforePageChange) {
                podeProsseguir = self.events.beforePageChange(this, newPageNumber);
            }
            if(podeProsseguir) {
                self.currentPageIndex(newPageNumber);
            }
        };

        this.goToPage = function(pageNumber) {
            if(self.currentPageIndex() === pageNumber) {
                return;
            }
            var podeProsseguir = true;
            if(self.events && self.events.beforePageChange) {
                podeProsseguir = self.events.beforePageChange(this, pageNumber);
            }
            if (podeProsseguir) {
                self.currentPageIndex(pageNumber);
            }
        };
        
        if(params.viewModel) { // permitir o acesso externo ao viewModel criado
            params.viewModel(this);
        }
        if(params.ready) {
            self.ready = params.ready;
            self.ready(true);
        }
    };

    return {viewModel: Pager, template: pagerTemplate};
});