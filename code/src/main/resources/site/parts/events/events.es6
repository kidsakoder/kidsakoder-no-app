var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf')
};

exports.get = function (req) {
  var component = libs.portal.getComponent();
  var content = libs.portal.getContent();
  var view = resolve('events.html');

  return {
    body: libs.thymeleaf.render(view, {
      request: req,
      content: content,
      component: component
    })
  };
};
