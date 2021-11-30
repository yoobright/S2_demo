var part_map = {};

const color_map = [
  '#fbb4ae',
  '#b3cde3',
  '#ccebc5',
  '#decbe4',
  '#fed9a6',
  '#ffffcc',
  '#e5d8bd',
  '#fddaec',
  '#f2f2f2',
]


function toggle_part_view(p) {
  var data_selceted = p.attr("data_selceted");
  // console.log('svg click!!!!', this.id, data_selceted);
  if (data_selceted == "true") {
    p.attr("data_selceted", "false");
    p.classed("st1", true);
    p.classed("st1_selected", false);
  } else {
    p.attr("data_selceted", "true");
    p.classed("st1", false);
    p.classed("st1_selected", true);
  }
}

function clear_part_view(p) {
  p.attr("data_selceted", "false");
  p.classed("st1", true);
  p.classed("st1_selected", false);
}

function tooltipd3(tltp_name) {
  /**
   * @Class tooltip - d3 object tooltip
   * Requiere [d3.js](https://github.com/mbostock/d3)
   */

  "use strict";

  var s = {};
  s.name = tltp_name ? tltp_name : "tooltipd3";
  s.w = 0; // width tooltip
  s.h = 0; // height tooltip

  s.t = d3
    .select("body")
    .append("div") // tooltip html node
    .attr("class", s.name)
    .style("opacity", 1e-6)
    .style("position", "absolute");

  s.t.on("click", s.mouseout);

  s.mouseover = function (html) {
    /** @param {string} html - Is the content for tooltip */
    s.t.html(html).transition().duration(300).style("opacity", 1);

    /** After innerhtml on tooltip get w & h */
    s.get_t_size();
  };

  s.mousemove = function () {
    var l = d3.event.pageX - s.w / 2;
    l = l < 0 ? 0 : l;
    s.t
      .style("left", l + "px")
      .style("top", d3.event.pageY - s.h - 10 + "px")
      .style("opacity", 1);
  };

  s.mouseout = function () {
    s.t
      .transition()
      .duration(300)
      .style("opacity", 1e-6)
      .each(function () {
        s.t.html("");
      });
  };

  /** Get width and height of tooltip and set w & h of Tooltip class */
  s.get_t_size = function () {
    var size = s.t.node().getBoundingClientRect();
    s.w = size.width;
    s.h = size.height;
  };

  return s;
}

d3.xml("body_view2.svg").then((data) => {
  var svg_container = d3.select("#svg-container")
  if (svg_container.empty())
    return;

  svg_container.node().append(data.documentElement);
  var s = svg_container.select("svg");
  var p_list = s.selectAll("polygon");
  p_list.attr("data_selceted", "false");

  p_list.on("click", function () {
    var p = d3.select(this);
    toggle_part_view(p);
  });

  var tooltip = tooltipd3();
  var t_list = s.selectAll("text").filter(function () {
    // console.log(d3.select(this).classed('st_label'))
    return !d3.select(this).classed("st_label");
  });

  t_list.on("click", function () {
    d3.event.preventDefault();
    // console.log(this);
    var this_node = d3.select(this);
    // console.log(this_node);
    var num = this_node.text();
    // console.log(num);
    var id_name = "#part_x5F_".concat(num);
    // console.log(id_name);
    var part_p = d3.select(this.parentNode).select(id_name);
    // console.log(part_p);
    toggle_part_view(part_p);
  })
  .on("mouseover", function () {
    var this_node = d3.select(this);
    var num = this_node.text();
    var html = "part <b>" + num + "</b>";
    tooltip.mouseover(html); // pass html content
  })
  .on("mousemove", tooltip.mousemove)
  .on("mouseout", tooltip.mouseout);

  // console.log(s);
});


$("#body_part_btn").click(function(){
  console.log("add_test_btn pressed!!!");
  var b_list = $("#body_part_list_group");
  b_list.append("<li class='list-group-item'>An item</li>");
  var b_list_li = b_list.children("li");

  for(i = 0; i< b_list_li.length; i++) {
    $(b_list_li[i]).css("background-color", color_map[i % 9]);
  }
});
$("#body_clear_btn").click(function(){
  console.log("body_clear_btn pressed!!!");
  var p_list = d3.select("#svg-container").select("svg").selectAll("polygon")
  console.log(p_list);
  clear_part_view(p_list);
  var b_list = $("#body_part_list_group");
  b_list.children().remove();
});