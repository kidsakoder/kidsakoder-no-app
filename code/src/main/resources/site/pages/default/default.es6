import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

let libs = { portal, thymeleaf };

let views = {
  defaultview: resolve('default.html')
};

// Handle the GET request
exports.get = function(req) {
    // Get the content that is using the page
    let content = libs.portal.getContent();
    var config = content.page.config;

    // Extract the main region which contains component parts
    let mainRegion = content.page.regions.main;

    // Prepare the model that will be passed to the view
    let model = {
        mainRegion,
        //Get the image for top of website
        image: libs.portal.imageUrl({
          id: config.image,
          scale: "block(800, 250)"
        })
    }

    // Render HTML from the view file
    let body = libs.thymeleaf.render(views.defaultview, model);

    let customStyles = `
    <link rel="stylesheet" href="${libs.portal.assetUrl({
        path: 'css/style.min.css'
    })}">
    <link rel="stylesheet" href="${libs.portal.assetUrl({
        path: 'css/main.css'
    })}">`;

    // Return the response object
    return {
        body,
        pageContributions: {
          headEnd: [
              customStyles
          ]
        }
    }
};
