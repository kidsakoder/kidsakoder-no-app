import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = request => {
  const component = portal.getComponent();
  const content = portal.getContent();
  const view = resolve('events.html');

  return {
    body: thymeleaf.render(view, { request, content, component }),
  };
};
