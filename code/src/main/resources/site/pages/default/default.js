var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf')
};

var views = {
  defaultview: resolve('default.html')
}

// Handle the GET request
exports.get = function(req) {
    // Get the content that is using the page
    var content = libs.portal.getContent();

    // Extract the main region which contains component parts
    var mainRegion = content.page.regions.main;

    // Prepare the model that will be passed to the view
    var model = {
        mainRegion: mainRegion
    }

    // Render HTML from the view file
    var body = libs.thymeleaf.render(views.defaultview, model);

    var customStyles = '<link rel="stylesheet" href="' + libs.portal.assetUrl({
            path: 'css/style.min.css'
        }) + '">';

    // Return the response object
    return {
        body: body,
        pageContributions: {
          headEnd: [
              customStyles
          ]
        }

    }
};
