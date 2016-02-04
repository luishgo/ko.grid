define(["knockout", "text!./grid-pager.html",
    'components/pager/pager', 'components/grid/grid'], function (ko, template, Pager, Grid) {

    "use strict";
    ko.components.register('pager', Pager);
    ko.components.register('grid', Grid);

    var GridAndPager = function(params) {
        var self = this;

        this.pager = params.pager;
        this.pager.ready = ko.observable(false);

        this.grid = params.grid;
        this.grid.ready = ko.observable(false);
        this.grid.allReady = ko.computed(function() {
            return self.pager.ready() && self.grid.ready();
        });
    };

    return {viewModel: GridAndPager, template: template};
});