import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as menu from '/lib/enonic/menu';

const views = {
  defaultview: resolve('default.html'),
  header: resolve('header.html'),
  footer: resolve('footer.html'),
};

// Handle the GET request
exports.get = () => {
  // Get the content that is using the page
  const content = portal.getContent();
  const { page: { config } } = content;

  // Extract the main region which contains component parts
  const mainRegion = content.page.regions.main;

  // Image in header
  const image = portal.imageUrl({
    id: config.image,
    scale: 'block(800, 200)',
  });

  const header = thymeleaf.render(views.header, {
    menuItems: menu.getMenuTree(1),
  });
  const footer = thymeleaf.render(views.footer);

  // Prepare the model that will be passed to the view
  const model = {
    mainRegion,
    headerHtml: portal.processHtml({
      value: `
<div
  class="inner-wrapper row middle-xs center-xs start-sm"
  style="background-image: url(${image})"
>${header}</div>`,
    }),
    footerHtml: portal.processHtml({
      value: `
<div
  class="inner-wrapper row around-sm center-xs"
>${footer}</div>`,
    }),
  };

  // Render HTML from the view file
  const body = thymeleaf.render(views.defaultview, model);

  // Return the response object
  return {
    body,
    pageContributions: {
      headEnd: [`<link rel="stylesheet" href="${portal.assetUrl({
        path: 'css/main.css',
      })}">`],
    },
  };
};
