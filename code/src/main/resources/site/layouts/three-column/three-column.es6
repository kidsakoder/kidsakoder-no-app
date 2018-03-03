import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

let views = {
  layout: resolve('./three-column.html'),
};

exports.get = function(req) {

  // Find the current component.
  let component = portal.getComponent();

  // Define the model
  let model = {
    leftRegion: component.regions.left,
    middleRegion: component.regions.middle,
    rightRegion: component.regions.right,
  };

  // Render a thymeleaf template
  let body = thymeleaf.render(views.layout, model);

  // Return the result
  return {
    body: body,
    contentType: 'text/html',
  };
};
