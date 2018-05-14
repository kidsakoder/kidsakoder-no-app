import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
 
const views = {
  buttonItem: resolve('button.html'),
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

 
  const model = {
    title: component.config.title,
    url: btnUrl,
  };
 
  const body = thymeleaf.render(views.buttonItem, model);
 
  return { body };
};
