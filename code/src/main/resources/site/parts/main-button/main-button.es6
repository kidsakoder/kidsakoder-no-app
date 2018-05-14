import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
 
const views = {
  buttonItem: resolve('main-button.html'),
};
 
exports.get = () => {
  const component = portal.getComponent();
  const { config } = component;
  let btnUrl = '#';
 
  if (config.url) {
    if (config.url._selected === 'content') {
      const btnKey = config.url.content.key;
      if (btnKey) {
        btnUrl = portal.pageUrl({
          id: btnKey,
        });
      }
    } else if (config.url._selected === 'text') {
      btnUrl = config.url.text.url;
    }
  }
 
  const image = portal.imageUrl({
    id: component.config.image,
    scale: 'block(250, 250)',
  });
 
  const model = {
    title: component.config.title,
    url: btnUrl,
    bgimage: portal.processHtml({
      value: `<div style="background-image: url(${image})"></div>`,
    }),
    alt: component.config.alt,
  };
 
  const body = thymeleaf.render(views.buttonItem, model);
 
  return { body };
};
