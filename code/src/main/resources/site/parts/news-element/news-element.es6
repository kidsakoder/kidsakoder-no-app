import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = req => {
  const component = portal.getComponent();
  const content = portal.getContent();
  const view = resolve('news-element.html');

  return {
    body: thymeleaf.render(view, {
      request: req,
      content,
      component,
    }),
  };
};
