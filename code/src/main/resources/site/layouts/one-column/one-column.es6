import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

const views = {
  layout: resolve('./one-column.html'),
};

exports.get = () => {

  // Find the current component.
  const component = portal.getComponent();

  // Define the model
  const model = {
    middleRegion: component.regions.middle,
  };

  // Render a thymeleaf template
  const body = thymeleaf.render(views.layout, model);

  // Return the result
  return {
    body,
    contentType: 'text/html',
  };
};
