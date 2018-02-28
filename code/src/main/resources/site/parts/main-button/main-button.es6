var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf')
};

var views = {
  buttonItem: resolve('main-button.html'),
  css: resolve('main-button-css.html')
}

exports.get = function (req) {
  var component = libs.portal.getComponent();
  var model = {
    title: component.config.title,
    image: libs.portal.imageUrl({
      id: component.config.image,
      scale: "block(450, 275)"
    }),
    alt: component.config.alt
  }

  var body = libs.thymeleaf.render(views.buttonItem, model);

  return {
    body: body,
    pageContributions: {
      headEnd: libs.thymeleaf.render(views.css, model)
    }
  }
};
