var libs = {
  portal: require('/lib/xp/portal'),
  thymeleaf: require('/lib/xp/thymeleaf'),
  content : require('/lib/xp/content'),
};

var views = {
  buttonItem: resolve('main-button.html'),
  css: resolve('main-button-css.html')
}

exports.get = function(req) {
  var component = libs.portal.getComponent();
  var config = component.config;
  var btnUrl = "#";

  if (config.url) {
    if (config.url._selected === 'content') {
      var btnKey = config.url.content.key;
      if (btnKey) {
        btnUrl = libs.portal.pageUrl({
          id: btnKey
        });
      }
    } else if (config.url._selected === 'text') {
      btnUrl = config.url.text.url;
    }
  }

  var model = {
    title: component.config.title,
    url: btnUrl,
    image: libs.portal.imageUrl({
      id: component.config.image,
      scale: "block(250, 250)"
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
