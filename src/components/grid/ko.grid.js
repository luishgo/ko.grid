(function () {
    // Private function

    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        var index = 0;
        for (var propertyName in data[0]) {
            columns.push(new ko.grid.Column(propertyName, propertyName, propertyName, propertyName, propertyName, propertyName, index));
            index++;
        }
        return columns;
    }

    // Grid
    ko.grid = {
        viewModel: function (configuration) {
            var self = this;

            // Linhas
            this.rows = ko.observableArray();
            this.initializeRows = function(newRows) {
                var rows = [];
                ko.utils.arrayForEach(newRows, function(newRow) {
                    newRow.selected = ko.observable(false);
                    rows.push(newRow);
                });
                self.rows.removeAll();
                self.rows(rows);
            };

           // Colunas
            this.columns = ko.observableArray();
            if (configuration.columns && configuration.columns.length > 0) {
            	var index = 0;
                ko.utils.arrayForEach(configuration.columns, function(column) {
                	var tempFilterable;
                	column.filterable == null || typeof column.filterable == 'undefined' ? tempFilterable = true : tempFilterable = column.filterable;
                    self.columns.push(new ko.grid.Column(column.name, column.subname, column.displayName, column.userDisplayTemplate, column.visible, column.orientation, tempFilterable, index));
                    index++;
                });
            } else {
                this.rows.subscribe(function(newValue) {
                    if (this.columns().length == 0) {
                        this.columns(getColumnsForScaffolding(ko.utils.unwrapObservable(this.rows)));
                    }
                }, this);
            };

            this.columns.serialize = function() {
                var orderFields = [];

                ko.utils.arrayForEach(self.columns(), function(column) {
                	var result = column.serialize();
                    if (result){orderFields.push(result);}
                }, self);
                return '/' + orderFields.join('@');
            };

            this.columns.conditions = function() {
                var conditionsFields = [];

                ko.utils.arrayForEach(self.columns(), function(column) {
                	var result = column.condition();
                	if (result){conditionsFields.push(result);}
                }, self);

                return conditionsFields.length > 0 ? '/' + conditionsFields.join('@') : '/-';
            };

            this.filteredColumns = ko.computed(function() {
                return ko.utils.arrayFilter(self.columns(), function(column) {
                    return column.filterCondition() != null;
                });
            });

            this.notFilteredColumns = ko.computed(function() {
            	return ko.utils.arrayFilter(self.columns(), function(column) {
                    return column.filterCondition() == null && column.filterable() == true;
                });
            });

            // Coluna com o identificador da linha
            this.idColumn = new ko.grid.Column(configuration.idColumn);

            // PaginaÃ§Ã£o
            this.pager = new ko.grid.Pager(configuration.dataSize, configuration.pageSize);

            // Filtro
            this.filter = new ko.grid.Filter();

            // SeleÃ§Ã£o de todas as linhas
            this.allSelected = ko.observable(false);
            this.allSelected.subscribe(function(newValue) {
                ko.utils.arrayForEach(this.rows(), function(row) {
                    row.selected(newValue);
                });
            }, this);

            // ConfiguraÃ§Ãµes do grid

            // Checkboxes para seleÃ§Ã£o de linhas
            this.includeCheckboxes = configuration.includeCheckboxes;
            if(configuration.includeCheckboxes == null) {
            	this.includeCheckboxes = false;
            }

            // Barra de ferramentas
            this.includeToolbar = configuration.includeToolbar;
            if(configuration.includeToolbar == null) {
            	this.includeToolbar = true;
            }

            // BotÃ£o para atualizar dados do grid
            this.includeToolbarRefresh = configuration.includeToolbarRefresh;
            if(configuration.includeToolbarRefresh == null) {
            	this.includeToolbarRefresh = true;
            }

            // BotÃ£o para download dos dados do grid
            this.includeToolbarDownload = configuration.includeToolbarDownload;
            if(configuration.includeToolbarDownload == null) {
            	this.includeToolbarDownload = false;
            }

            // Links para download dos dados do grid
            this.downloadLinkXLS = configuration.downloadLinkXLS;
            this.downloadLinkPDF = configuration.downloadLinkPDF;
            this.downloadLinkCSV = configuration.downloadLinkCSV;

            // BotÃ£o para filtrar dados do grid
            this.includeToolbarFilter = configuration.includeToolbarFilter;
            if(configuration.includeToolbarFilter == null) {
            	this.includeToolbarFilter = false;
            }

            // Quantidade de linhas apresentadas por pÃ¡gina
            this.includeToolbarPageSize = configuration.includeToolbarPageSize;
            if(configuration.includeToolbarPageSize == null) {
            	this.includeToolbarPageSize = true;
            }

            this.forceUpdate = ko.observable();

            // Coluna de aÃ§Ãµes para cada linha
            this.actions = configuration.actions;

            this.update = function() {
            	self.forceUpdate(true);
            };

            this.filterValue = function() {
            	
            	$('#toolbar-filter-value').val('');
            	
            	if (self.filter.selectedColumn().displayTemplate == 'as_date') {
            		$('#toolbar-filter-value').mask('99/99/9999');
            		
            	} else if (self.filter.selectedColumn().displayTemplate == 'as_date_time') {
            		$('#toolbar-filter-value').mask('99/99/9999 99:99');
            	
            	} else if (self.filter.selectedColumn().displayTemplate == 'as_cpf') {
            		$('#toolbar-filter-value').mask('999.999.999-99');
            	
            	} else {
            		if (typeof $('#toolbar-filter-value').data('mask') != 'undefined'){
            			$('#toolbar-filter-value').data('mask').remove();
		            	$('#toolbar-filter-value').removeAttr('maxlength');
		            	$('#toolbar-filter-value').removeAttr('autocomplete');
            		}
            	}
            };

             ko.computed(function() {
                // Loading...
            	$('#grid').append('<img id="carregando-grid" src="img/ajax-loader1.gif">');

            	this.forceUpdate();
            	this.forceUpdate(false);

            	this.allSelected(false);
                configuration.dataLoader(this.columns, this.pager, this.initializeRows);
            }, this).extend({ throttle: 1 });
        },

        // Coluna
        Column: function (name, subname, displayName, userDisplayTemplate, visible, orientation, filterable, index) {
        	
        	this.index = index;
            this.name = name;
            this.subname = subname;
            this.displayName = displayName;
            this.orientation = ko.observable(orientation);
            this.visible = ko.observable(visible != false);
            this.filterable = ko.observable(filterable);
            this.displayTemplate = userDisplayTemplate || 'ko_grid_display_column';

            this.displayFunction = function(data) {
				
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
            };

            this.toDate = function(data, isDateTime) {
            	
        		if (isNaN(parseInt(data))) {
        			return null;
        		}
            	
        		var date = new Date(parseInt(data));
        		var day = date.getDate();
        		var month = date.getMonth() + 1;
        		
        		var hours = date.getHours();
        		var minutes = date.getMinutes();
        		
        		if (day < 10) {
        			day = '0' + day;
        		}

        		if (month < 10) {
        			month = '0' + month;
        		}
        		
        		if (hours < 10) {
        			hours = '0' + hours;
        		}
        		
        		if (minutes < 10) {
        			minutes = '0' + minutes;
        		}
        		
        		if(!isDateTime) {
        			return day + '/' + month + '/' + date.getFullYear();
        		} else {
        			return day + '/' + month + '/' + date.getFullYear() + " " + hours + ":" + minutes;
        		}
        	};

            this.isOrdered = function() {
                return this.orientation() === 'asc' || this.orientation()  === 'desc';
            };

            this.filterCondition = ko.observable(null);

            this.changeOrder = function() {
                
            	if (this.orientation() === 'asc') {
                    this.orientation('desc');
                
                } else if (this.orientation() === 'desc') {
                    this.orientation('');
                    
                } else {
                    this.orientation('asc');
                }
            };

            this.formatValueCondition = function(){
            	return this.filterCondition().value.replace(/\//g, "-");
            };

            this.serialize = function() {
            	if(typeof this.subname === 'undefined') {
					return this.isOrdered() ? this.name + ',' + this.orientation() : null;
				} else {
					return this.isOrdered() ? this.name + '.' + this.subname + ',' + this.orientation() : null;
				}
            };

            this.condition = function() {
            	if(this.filterCondition() != null){
            		if(typeof this.subname === 'undefined') {
						return this.name + ',' + this.filterCondition().operation + ',' + this.formatValueCondition();
					} else {
						return this.name + '.' + this.subname + ',' + this.filterCondition().operation + ',' + this.formatValueCondition();
					}
            	}
            	return null;
            };
        },

        // Paginador
        Pager: function(dataSize, pageSize) {
            var self = this;

            this.dataSize = ko.observable(dataSize || 0);
            this.pageSize =  ko.observable(pageSize || 25);
            this.availablePageSizes = ko.observableArray(['15', '25', '50', '100', '500', 'Tudo']);
            if (pageSize == 10000) {
            	this.selectedPageSize = ko.observableArray(['Tudo']);            	
            } else {
            	this.selectedPageSize = ko.observableArray([pageSize.toString()]);
            }
            this.currentPageIndex = ko.observable(0);

            this.maxPageIndex = ko.computed(function () {
                return Math.ceil(this.dataSize() / this.pageSize()) - 1;
            }, this);

            this.pageSizeChange = function() {
            	if(self.selectedPageSize() == 'Tudo'){self.pageSize(10000 || 25);} else {self.pageSize(self.selectedPageSize() || 25);}

            	self.currentPageIndex(0);
            };
        },
        Filter: function() {
            var self = this;

            this.configurationPanel = ko.observable(false);
            this.conditionOperations = ['=', '!=', 'contÃ©m', 'nÃ£o contÃ©m', '<', '>'];
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
        }
    };

    // Templates used to render the grid
    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function(templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_grid_display_column", "<!-- ko text: $data --><!-- /ko -->");

    templateEngine.addTemplate("as_date", "<!-- ko text: $parent.toDate($data, false) --><!-- /ko -->");
    
    templateEngine.addTemplate("as_date_time", "<!-- ko text: $parent.toDate($data, true) --><!-- /ko -->");
    
    templateEngine.addTemplate("as_cpf", "<!-- ko text: $data --><!-- /ko -->");
    
    templateEngine.addTemplate("as_processo", "<!-- ko text: $data --><!-- /ko -->");

    templateEngine.addTemplate("ko_grid_toolbar", "\
			<!--ko if: includeToolbar -->\
				<div style=\"width: 600px; padding: 5px; margin: 5px; min-height: 30px;\" class=\"well\">\
					<div style=\"width: 100%;\">\
						<div data-bind=\"if: includeToolbarRefresh\" style=\"float: left; margin-right: 5px;\"><button id=\"toolbar-button-refresh\" data-bind=\"click: $root.update\" type=\"button\" class=\"btn btn-mini\" title=\"Atualizar\"><i class=\"icon-refresh\"></i></button></div>\
						<div data-bind=\"if: includeToolbarDownload\" style=\"float: left; margin-right: 5px;\"><a data-bind=\"attr: {href: downloadLinkXLS}\"><button id=\"toolbar-button-download\" type=\"button\" class=\"btn btn-mini\" title=\"Download\"><i class=\"icon-download\"></i></button></a></div>\
						<div data-bind=\"if: includeToolbarFilter\" style=\"float: left; margin-right: 5px;\"><button id=\"toolbar-button-filter\" data-bind=\"click: $root.filter.toggleConfigurationPanel\" type=\"button\" class=\"btn btn-mini\" title=\"Filtro\"><i class=\"icon-filter\"></i></button></div>\
						<div data-bind=\"if: includeToolbarPageSize, event: {change:  $root.pager.pageSizeChange}\" style=\"float: left; margin-right: 5px;\"><select data-bind=\"options: $root.pager.availablePageSizes, selectedOptions: $root.pager.selectedPageSize\" style=\"width: 80px;  margin: 0px;\"></select> registros por pÃ¡gina</div>\
					</div>\
					<!--ko if: $root.filter.configurationPanel -->\
    					<p></p>\
						<div style=\"width: 100%;\">\
							<fildset>\
								<legend>Filtro</legend>\
								<select id=\"toolbar-filter-column\" data-bind=\"click: $root.filterValue, options: $root.notFilteredColumns(), optionsText: 'displayName', value: $root.filter.selectedColumn\" style=\"margin: 0px;\"></select>\
								<select id=\"toolbar-filter-operation\" data-bind=\"options: $root.filter.conditionOperations\" class=\"input-small\" style=\"margin: 0px;\"></select>\
								<input id=\"toolbar-filter-value\" type=\"text\" style=\"margin: 0px;\">\
								<button id=\"toolbar-filter-button-add\" data-bind=\"click: function(data, event){$root.filter.addCondition($root.filter.selectedColumn, $('#toolbar-filter-operation').val(), $('#toolbar-filter-value').val());}\" type=\"button\" class=\"btn btn-mini\" title=\"Adicionar condiÃ§Ã£o\"><i class=\"icon-plus\"></i></button>\
							</fildset>\
							<!--ko if: $root.filteredColumns() != null -->\
								<p></p>\
								<table width=\"100%\">\
									<tbody data-bind=\"foreach: $root.filteredColumns()\">\
										<tr>\
											<td data-bind=\"text: $index \"></td>\
											<td data-bind=\"text: $data.displayName\" width=\"36%\"></td>\
											<td data-bind=\"text: $data.filterCondition().operation\" width=\"16%\"></td>\
											<td data-bind=\"text: $data.filterCondition().value\" width=\"36%\"></td>\
											<td><button id=\"toolbar-filter-button-remove\" data-bind=\"click: function(data, event){$root.filter.removeCondition($data);}\" type=\"button\" class=\"btn btn-mini\" title=\"Remover condiÃ§Ã£o\"><i class=\"icon-minus\"></i></button></td>\
										</tr>\
									</tbody>\
								</table>\
							<!--/ko-->\
						</div>\
					<!--/ko-->\
				</div>\
			<!--/ko-->");

		    templateEngine.addTemplate("ko_grid", "\
		  			<table class=\"table table-condensed table-hover table-striped\">\
		                <thead>\
		                    <tr>\
		                       <!--ko if: includeCheckboxes -->\
		                       	   <th><input id=\"all\" type=\"checkbox\" data-bind=\"checked: allSelected\"/></th>\
		                       <!--/ko--> \
		                       <!--ko foreach: columns -->\
		                           <th data-bind=\"click: changeOrder, visible: visible\"><!--ko text: displayName --><!--/ko-->\
		                           <!--ko if: isOrdered() -->\
		                            <i data-bind=\"css: {\
		                            	'icon-arrow-up': orientation() === 'asc',\
		                            	'icon-arrow-down': orientation() === 'desc'\
		                            }\"></i>\
		                           <!--/ko-->\
								   <!--ko if: filterCondition() -->\
		                            	<i class=\"icon-filter\"></i>\
		                           <!--/ko-->\
		                           </th>\
		                       <!--/ko-->\
		                       <!--ko if: actions != null -->\
		  					   	   <th>AÃ§Ãµes</th>\
		  					   <!--/ko-->\
		                    </tr>\
		                </thead>\
                        <tbody data-bind=\"foreach: rows\">\
                           <tr>\
                           		<!--ko if: $parent.includeCheckboxes -->\
                           		<td><input type=\"checkbox\" data-bind=\"checked: selected, value: $parent.idColumn.displayFunction($data), attr: {name: 'idsObjetos'}\" /></td>\
                           		<!--/ko-->\
                           		<!-- ko foreach: $parent.columns -->\
                               	<td data-bind=\"visible: visible \">\
                               		<!-- ko template: {name: displayTemplate, data: displayFunction($parent)} --><!-- /ko -->\
                               	</td>\
                               	<!-- /ko -->\
                               	<td data-bind=\"template: {name: $parent.actions, data: $data}\"></td>\
                            </tr>\
                        </tbody>\
                    </table>");
//click: function() {$parent.selected($parent.selected() ? false : true);}
    templateEngine.addTemplate("ko_grid_pageLinks", "\
                    <div class=\"pagination pagination-centered\">\
                      <ul id='ul-paginacao'>\
                        <li data-bind=\"css: {disabled: pager.currentPageIndex() == 0}\"><a href=\"#\" data-bind=\"click: function() { pager.currentPageIndex() != 0 ? pager.currentPageIndex(pager.currentPageIndex() - 1) : 0; }\">Anterior</a></li>\
                        <!-- ko foreach: ko.utils.range(0, pager.maxPageIndex) -->\
                        <li class='li-pagina li-visible' data-bind=\"css: { active: $data == $root.pager.currentPageIndex() }\"><a href=\"#\" data-bind=\"text: $data + 1, click: function() { $root.pager.currentPageIndex($data) }\">\
                        </a></li>\
                        <!-- /ko -->\
                        <li data-bind=\"css: {disabled: pager.currentPageIndex() == pager.maxPageIndex()}\"><a href=\"#\" data-bind=\"click: function() { pager.currentPageIndex() != pager.maxPageIndex() ? pager.currentPageIndex(pager.currentPageIndex() + 1) : 0; }\">PrÃ³ximo</a></li>\
                      </ul>\
                    <div style=\"float: right; margin-right: 5px;\">Mostrando de <span id='registros-min' data-bind=\"text: ($root.pager.currentPageIndex()*$root.pager.pageSize())+1\"/> a <span id='registros-max' data-bind=\"text: ($root.pager.currentPageIndex()*$root.pager.pageSize())\" /> de <span id='filtrados-final'></span> <span id='total-registros' data-bind=\"text: $root.pager.dataSize()\" /><span> registros</span></div>\
                    </div>");

    // The "grid" binding
    ko.bindingHandlers.grid = {
        init: function() {
            return { 'controlsDescendantBindings': true };
        },
        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
        update: function (element, viewModelAccessor, allBindingsAccessor) {
            var viewModel = viewModelAccessor(), allBindings = allBindingsAccessor();

            // Empty the element
            while(element.firstChild){ko.removeNode(element.firstChild);}

            // Allow the default templates to be overridden
            var toolbarTemplateName   = allBindings.gridTemplate || "ko_grid_toolbar",
                gridTemplateName      = allBindings.gridTemplate || "ko_grid",
                pageLinksTemplateName = allBindings.gridPagerTemplate || "ko_grid_pageLinks";

            // Render the grid toolbar
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(toolbarTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // Render the main grid
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            //document.getElementById('carregando-grid').setAttribute('style', 'display: none;');

            // Render the page links
            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");


            // Done loading
            //ko.removeNode(loadingElement);
            //$('#carregando-grid').hide();
        }
    };
})();