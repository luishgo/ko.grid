define(["knockout"], function(ko) {

  // function getColumnsForScaffolding(data) {
  //   if ((typeof data.length !== 'number') || data.length === 0) {
  //     return [];
  //   }
  //   var columns = [];
  //   var index = 0;
  //   for (var propertyName in data[0]) {
  //     columns.push(new Column({name: propertyName}));
  //     index++;
  //   }
  //   return columns;
  // }

  var Column = function (params) {
    this.name = params.name;
    this.subname = params.subname;
    this.displayName = params.displayName;
    this.orientation = ko.observable(params.orientation);
    this.visible = ko.observable(params.visible != false);
    this.filterable = ko.observable(params.filterable || true);
    this.displayTemplate = params.userDisplayTemplate || 'ko_grid_display_column';
    this.filterCondition = ko.observable(null);
  }

  Column.prototype.displayFunction = function(data) {
    if (typeof this.name == 'function') {
      return this.name(data);
    } else if (typeof this.subname === 'undefined') {
      return data[this.name];
    } else {
      if(data[this.name] == null) {
        return null;
      }
      return data[this.name][this.subname];
    }
  }

  Column.prototype.toDate = function(data, isDateTime) {
    if (isNaN(parseInt(data))) {
      return null;
    }
      
    var date = new Date(parseInt(data));
    var day = date.getDate();
    var month = date.getMonth() + 1;

    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (day < 10) { day = '0' + day; }

    if (month < 10) { month = '0' + month; }

    if (hours < 10) { hours = '0' + hours; }

    if (minutes < 10) { minutes = '0' + minutes; }

    if(!isDateTime) {
      return day + '/' + month + '/' + date.getFullYear();
    } else {
      return day + '/' + month + '/' + date.getFullYear() + " " + hours + ":" + minutes;
    }
  };  

  Column.prototype.isOrdered = function() {
    return this.orientation() === 'asc' || this.orientation()  === 'desc';
  };

  Column.prototype.changeOrder = function() {
    if (this.orientation() === 'asc') {
      this.orientation('desc');
    } else if (this.orientation() === 'desc') {
      this.orientation('');
    } else {
      this.orientation('asc');
    }
  };

  Column.prototype.formatValueCondition = function(){
    return this.filterCondition().value.replace(/\//g, "-");
  };

  Column.prototype.serialize = function() {
    if(typeof this.subname === 'undefined') {
      return this.isOrdered() ? this.name + ',' + this.orientation() : null;
    } else {
      return this.isOrdered() ? this.name + '.' + this.subname + ',' + this.orientation() : null;
    }
  };

  Column.prototype.condition = function() {
    if(this.filterCondition() != null){
      if(typeof this.subname === 'undefined') {
        return this.name + ',' + this.filterCondition().operation + ',' + this.formatValueCondition();
      } else {
        return this.name + '.' + this.subname + ',' + this.filterCondition().operation + ',' + this.formatValueCondition();
      }
    }
    return null;
  };

  Column.createColumns = function(params) {
    var columns = ko.observableArray();
    if (params.columns && params.columns.length > 0) {
      ko.utils.arrayForEach(params.columns, function(columnParam) {
        columns.push(new Column(columnParam));
      });
    } else {
      // this.rows.subscribe(function(newValue) {
      //   if (this.columns().length == 0) {
      //     this.columns(getColumnsForScaffolding(ko.utils.unwrapObservable(this.rows)));
      //   }
      // }, this);
    };    
    
    columns.serialize = function() {
      var orderFields = [];
      ko.utils.arrayForEach(columns(), function(column) {
        var result = column.serialize();
        if (result) { orderFields.push(result); }
      });
      
      return '/' + orderFields.join('@');
    };

    columns.conditions = function() {
      var conditionsFields = [];
      ko.utils.arrayForEach(columns(), function(column) {
        var result = column.condition();
        if (result) { conditionsFields.push(result); }
      });

      return conditionsFields.length > 0 ? '/' + conditionsFields.join('@') : '/-';
    };

    return columns;
  };

  return Column;
});