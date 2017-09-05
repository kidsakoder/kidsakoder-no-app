var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

var views = {
  layout: resolve('./three-column.html'),
  css: resolve('./three-column-css.html')
}

exports.get = function(req) {

  // Find the current component.
  var component = portal.getComponent();

  // Define the model
  var model = {
    leftRegion: component.regions.left,
    middleRegion: component.regions.middle,
    rightRegion: component.regions.right
  };

  // Render a thymeleaf template
  var body = thymeleaf.render(views.layout, model);

  // Return the result
  return {
    body: body,
    contentType: 'text/html',
    pageContributions: {
      headEnd: thymeleaf.render(views.css, {})
    }
  };

};
