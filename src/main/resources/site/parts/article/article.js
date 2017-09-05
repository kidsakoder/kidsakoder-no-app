var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    content: require('/lib/xp/content'),
    i18nLib: require('/lib/xp/i18n'),
    util: require('/lib/enonic/util')
};

var views = {
  articleView: resolve('article.html')
}

// Handle GET requests
exports.get = function(req) {

    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    // Define the model
    var model = content;

    // Get the top image
    if (content.data.image) {
        model.topImage = {
            content: libs.content.get({key: content.data.image}),
            image: libs.portal.imageUrl({id: content.data.image.image, scale: "block(1,1)"}),
            caption: content.data.caption || ''
        };
    }

    if (content.data.body){
        model.body = libs.portal.processHtml({value: content.data.body});
    }

    // Generate URL to self
    model.url = libs.portal.pageUrl({ id: model._id, type: 'absolute'});
    model.encodedUrl = encodeURIComponent(model.url);

    // Get all tags related to this content into our model
    model.tags = libs.util.data.forceArray(content.data.tags);

    // Render a thymeleaf template
    var body = libs.thymeleaf.render(views.articleView, model);

    // Return the result
    return {
        body: body,
        contentType: 'text/html'
    };

};
