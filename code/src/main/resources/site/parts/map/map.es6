import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = request => {
  const component = portal.getComponent();
  const content = portal.getContent();
  const view = resolve('map.html');

  return {
    body: thymeleaf.render(view, { request, content, component }),
    pageContributions: {
      headEnd: ['<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css" />'],
    },
  };
};
