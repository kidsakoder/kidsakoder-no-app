var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

var views = {
  newsItem: resolve('news-item.html')
};

// Handle the GET request
exports.get = function(req) {
    // Get the content that is using the page
    var component = libs.portal.getComponent();

    // Prepare the model that will be passed to the view
    var model = {
      title: component.config.title,
      url: component.config.url,
      image: libs.portal.imageUrl({
        id: component.config.image,
        scale: "block(450,275)"
      }),
      alt: component.config.alt
    };

    // Render HTML from the view file
    var body = libs.thymeleaf.render(views.newsItem, model);

    // Return the response object
    return {
        body: body,
    };
};
