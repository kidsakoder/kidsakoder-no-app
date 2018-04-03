var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf')
};

exports.get = function (request) {
  var component = libs.portal.getComponent();
  var content = libs.portal.getContent();
  var view = resolve('events.html');

  return {
    body: libs.thymeleaf.render(view, { request, content, component })
  };
};
