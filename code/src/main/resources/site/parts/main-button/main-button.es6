import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

let libs = { portal, thymeleaf, content };

let views = {
  buttonItem: resolve('main-button.html'),
};

exports.get = function(req) {
  let component = libs.portal.getComponent();
  let config = component.config;
  let btnUrl = "#";

  if (config.url) {
    if (config.url._selected === 'content') {
      let btnKey = config.url.content.key;
      if (btnKey) {
        btnUrl = libs.portal.pageUrl({
          id: btnKey,
        });
      }
    } else if (config.url._selected === 'text') {
      btnUrl = config.url.text.url;
    }
  }

  let image = libs.portal.imageUrl({
    id: component.config.image,
    scale: 'block(250, 250)',
  });

  let model = {
    title: component.config.title,
    url: btnUrl,
    bgimage: libs.portal.processHtml({
      value: `<div style="background-image: url(${image}})"></div>`,
    }),
    alt: component.config.alt,
  };

  let body = libs.thymeleaf.render(views.buttonItem, model);

  return {
    body,
  };
};
