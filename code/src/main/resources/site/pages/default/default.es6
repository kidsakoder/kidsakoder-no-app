import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

let views = {
  defaultview: resolve('default.html'),
  header: resolve('header.html'),
  footer: resolve('footer.html'),
};

// Handle the GET request
exports.get = function(req) {
  // Get the content that is using the page
  let content = portal.getContent();
  var config = content.page.config;

  // Extract the main region which contains component parts
  let mainRegion = content.page.regions.main;

  // Image in header
  let image = portal.imageUrl({
    id: config.image,
    scale: 'block(800, 200)',
  });

  let header = thymeleaf.render(views.header);
  let footer = thymeleaf.render(views.footer);

  // Prepare the model that will be passed to the view
  let model = {
    mainRegion,
    headerHtml: portal.processHtml({
      value: `<div class="inner-wrapper" style="background-image: url(${image})">${header}</div>`,
    }),
    footerHtml: portal.processHtml({
      value: `<div class="inner-wrapper row around-sm center-xs">${footer}</div>`,
    }),
  };

  // Render HTML from the view file
  let body = thymeleaf.render(views.defaultview, model);

  // Return the response object
  return {
    body,
    pageContributions: {
      headEnd: [
        `<link rel="stylesheet" href="${portal.assetUrl({
            path: 'css/main.css'
        })}">`,
      ],
    },
  };
};
