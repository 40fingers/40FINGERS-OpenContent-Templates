(function ($) {
    $(document).ready(function () {
        initPage(document);
    });
    $(document).on("opencontent.change", function (event, element) {
        initPage(element);
    });
    var template = '';
    function initPage(element) {
        $(".jplist", element).each(function () {

            var moduleScope = $(this),
                self = moduleScope,
                sf = $.ServicesFramework($(this).attr('data-moduleid'));

            var $list = $('#oc-photo-album .list')
			    , template = Handlebars.compile($('#jplist-template').html());

            $(this).jplist({
                itemsBox: ".list"
                , itemPath: ".list-item"
                , panelPath: ".jplist-panel"
                , deepLinking: true
                , dataSource: {
                    type: 'server'
                    , server: {
                        ajax: {
                            data: {}
                                , url: sf.getServiceRoot('OpenContent') + "JplistAPI/List"
							    , dataType: 'json'
							    , type: 'POST'
                                , beforeSend: sf.setModuleHeaders
                        }
                    }
                    , render: function (dataItem, statuses) {
                        $list.html(template(dataItem.content));
                    }
                }
            });
        });
    }
    if (typeof Handlebars != 'undefined') {
        Handlebars.registerHelper('formatDateTime', function (context, format) {
            if (window.moment && context && moment(context).isValid()) {
                var f = format || "DD/MM/YYYY";
                return moment(context).format(f);
            } else {
                return context;   //  moment plugin is not available, context does not have a truthy value, or context is not a valid date
            }
        });       
    }
}(jQuery));