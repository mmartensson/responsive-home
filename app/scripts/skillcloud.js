'use strict';

var bonzo = require('../components/bonzo/bonzo.js');
var qwery = require('../components/qwery/qwery.js');
var bean  = require('../components/bean/bean.js');

function $(selector) {
  return bonzo(qwery(selector));
}

(function () {
  var selected;
  $('a.p-skill', '#skillcloud').each(function(element, index) {
     bean.on(element, 'click', function(event) {
       event.stop();

       if (selected) {
         bonzo(selected).removeClass('skillselected');
       }
       selected = element;

       var el = bonzo(element)
         .addClass('skillselected')

       var skill = el.attr('data-skill');
       var text = el.text();
       var desc = el.attr('title');
       if (desc) {
         text = text + ', ' + desc;
       }
       var prefix = '<i class="icon-2x icon-muted icon-pushpin pull-left"></i> Currently highlighted skill: ';
       var link = el.attr('href');
       if (link) {
         /* FIXME: Replace with icon-wikipedia when available (and link is Wikipedia) */
         var icon = 'icon-external-link';
         $('#skilldetails')
           .html(prefix + '<a href="' + link + '" rel="external">' + text + '</a>' + ' <i class="' + icon + '"></i>');
       } else {
         $('#skilldetails')
           .html(prefix + text);
       }

       $('span[data-skills]', 'div.resume').each(function(element, index) {
         var el = bonzo(element);
         var skills = el.attr('data-skills');
         if (new RegExp("\\b" + skill + "\\b", "g").test(skills)) {
           el.addClass('skillhighlight');
         } else {
           el.removeClass('skillhighlight');
         }
       });
    });
  });
})();
