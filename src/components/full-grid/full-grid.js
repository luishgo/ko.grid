define(["knockout", "text!./full-grid.html", 'components/pager/pager',
    'components/grid/grid', 'components/toolbar/toolbar'], function(ko, template, Pager, Grid, Toolbar) {

    "use strict";
    ko.components.register('pager', Pager);
    ko.components.register('grid', Grid);
    ko.components.register('toolbar', Toolbar);

    var FullGrid = function(params) {
        var self = this;

        this.pager = params.pager;
        this.pager.ready = ko.observable(false);

        this.toolbar = params.toolbar;
        this.toolbar.ready = ko.observable(false);
        
        this.grid = params.grid;
        this.grid.ready = ko.observable(false);
        this.grid.allReady = ko.computed(function() {
            return self.pager.ready() && self.grid.ready() && self.toolbar.ready();
        });

    };

    return {viewModel: FullGrid, template: template};
});