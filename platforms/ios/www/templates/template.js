(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['feedbackSlider'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"sliderDivContainer\" id=\"sliderContainer"
    + alias3(((helper = (helper = helpers.ID || (depth0 != null ? depth0.ID : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ID","hash":{},"data":data}) : helper)))
    + "\">\r\n\r\n    <div>\r\n        <p class=\"valueText\" id=\"\">"
    + alias3(((helper = (helper = helpers.sliderText || (depth0 != null ? depth0.sliderText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"sliderText","hash":{},"data":data}) : helper)))
    + "</p>\r\n        <div class=\"icon ion-arrow-left-b sliderIconLeft\"></div>\r\n        <input class=\"slider sliderInput\" id=\"slider"
    + alias3(((helper = (helper = helpers.ID || (depth0 != null ? depth0.ID : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ID","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" data-slider-min=\"1\" data-slider-max=\"10\" data-slider-step=\"1\" data-slider-value=\"5\" value=\"5\" />\r\n        <div class=\"icon ion-arrow-right-b sliderIconRight\"></div>\r\n    </div>\r\n\r\n    <div class=\"valueBox\">\r\n        <p class=\"sliderValue\">5</p>\r\n    </div>\r\n</div>";
},"useData":true});
templates['reportMedium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"reportSquareMedium\" id=\"reportMetric"
    + alias3(((helper = (helper = helpers.ID || (depth0 != null ? depth0.ID : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ID","hash":{},"data":data}) : helper)))
    + "\">\r\n    <p class=\"reportSquareTitle\">"
    + alias3(((helper = (helper = helpers.reportTitle || (depth0 != null ? depth0.reportTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"reportTitle","hash":{},"data":data}) : helper)))
    + "</p>\r\n</div>";
},"useData":true});
templates['reportSmall'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"reportSquareSmall\" id=\"reportMetric"
    + alias3(((helper = (helper = helpers.ID || (depth0 != null ? depth0.ID : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ID","hash":{},"data":data}) : helper)))
    + "\">\r\n    <p class=\"reportSquareTitle\">"
    + alias3(((helper = (helper = helpers.reportTitle || (depth0 != null ? depth0.reportTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"reportTitle","hash":{},"data":data}) : helper)))
    + "</p>\r\n</div>";
},"useData":true});
templates['reportSquare'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"reportSquareBig\" id=\"reportMetric"
    + alias3(((helper = (helper = helpers.ID || (depth0 != null ? depth0.ID : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ID","hash":{},"data":data}) : helper)))
    + "\">\r\n    <p class=\"reportSquareTitle\">"
    + alias3(((helper = (helper = helpers.reportTitle || (depth0 != null ? depth0.reportTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"reportTitle","hash":{},"data":data}) : helper)))
    + "</p>\r\n</div>";
},"useData":true});
})();
