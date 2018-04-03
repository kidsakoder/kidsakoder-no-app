import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

let views = {
  layout: resolve('./one-column.html'),
};

exports.get = function(req) {

  // Find the current component.
  let component = portal.getComponent();

  // Define the model
  let model = {
    middleRegion: component.regions.middle
  };

  // Render a thymeleaf template
  let body = thymeleaf.render(views.layout, model);

  // Return the result
  return {
    body: body,
    contentType: 'text/html',
  };
};
