import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

exports.get = function(req) {
    var model = {};

    var site = portal.getSite();

    // Get all the country contents (in the current site)
    var result = content.query({
        start: 0,
        count: 100,
        contentTypes: [
            app.name + ':news-element'
        ],
        "query": "_path LIKE '/content" + site._path + "/*'"
    });

    var hits = result.hits;
    var news-elements = [];

    // Loop through the contents and extract the needed data
    for(var i = 0; i < hits.length; i++) {

        var news-element = {};
        news-element.name = hits[i].displayName;
        news-elements.push(news-element);
    }

    // Add the country data to the model
    model.news-elements = news-elements;

    // Specify the view file to use
    var view = resolve('news-list.html');

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};
