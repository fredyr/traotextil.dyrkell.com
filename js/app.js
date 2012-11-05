(function(window){

    var Markdown = Backbone.Model.extend({
        initialize: function(options) {
            this.name = options.name;
            this.baseUrl = "/content";
        },
        url: function() {
            return this.baseUrl + '/' + this.name + '.txt.html';
        },
        parse: function(resp) {
            return {markdown: resp};
        }
    });

    var MarkdownView = Backbone.View.extend({
        initialize: function(options) {
            this.el = options.el;
            this.model.on('change', this.render, this);
        },
        render: function () {
            $(this.el).html(markdown.toHTML(this.model.get("markdown")));
            return this;
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            ":page": "show_page",
            "": "show_page"
        },
        show_page: function(page) {
            // default page
            if(page === undefined) {
                page = "traotextil";
            }
            var start_text = new Markdown({name: page});
            var start_page = new MarkdownView({
                el: "#page-content",
                model: start_text
            });
            start_text.fetch({
                dataType: "text"
                // beforeSend: function(xhr) {
                //     xhr.overrideMimeType("text/html; charset=iso-8859-1");
                // }
            });

        }
    });
  
    (function() {
        var footer_text = new Markdown({name: "sidfot"});
        var footer = new MarkdownView({
            el: "#footer-content",
            model: footer_text
        });
        footer_text.fetch({dataType: "text"});
  
        new Router();
        Backbone.history.start();
    })();

}).call(this);
