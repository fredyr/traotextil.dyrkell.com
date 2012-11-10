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
        strip: function(string) {
            return string
                .replace(/&auml;/g, "ä")
                .replace(/&Auml;/g, "Ä")
                .replace(/&aring;/g, "å")
                .replace(/&Aring;/g, "Å")
                .replace(/&oring;/g, "ö")
                .replace(/&Oring;/g, "Ö");
        },
        render: function () {
            var md = this.strip(this.model.get("markdown"));
            $(this.el).html(markdown.toHTML(md));
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
                dataType: "html",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "text/html; charset=iso-8859-1");
                }
            });

        }
    });
  
    (function() {
        var footer_text = new Markdown({name: "sidfot"});
        var footer = new MarkdownView({
            el: "#footer-content",
            model: footer_text
        });
        footer_text.fetch({
            dataType: "html",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Accept", "text/html; charset=iso-8859-1");
            }
        });
  
        new Router();
        Backbone.history.start();
    })();

}).call(this);
