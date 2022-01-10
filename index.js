var part_map = {};

const color_map = [
  "#fbb4ae",
  "#b3cde3",
  "#ccebc5",
  "#decbe4",
  "#fed9a6",
  "#ffffcc",
  "#e5d8bd",
  "#fddaec",
  "#f2f2f2",
];

const red_map = [
  "#fbb4ae",
  "#f3a09b",
  "#eb8c87",
  "#e37874",
  "#db6461",
  "#d3504d",
  "#cb3c3a",
  "#c32827",
  "#bb1413",
  "#b30000",
];


const bodyItemTemplate = ({ id, itemId, name }) => `
<li class='list-group-item d-flex align-items-center body-item' id='${itemId}' body_id='${id}'>
  <div class="row">
  <div class="col" >${name}</div>
  <div class="btn-group btn-group-toggle level-btn col" data-toggle="buttons" >
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option1" autocomplete="off" value="1"> 1
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option2" autocomplete="off" value="2"> 2
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option3" autocomplete="off" value="3"> 3
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option4" autocomplete="off" value="4"> 4
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option5" autocomplete="off" value="5"> 5
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option6" autocomplete="off" value="6"> 6
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option7" autocomplete="off" value="7"> 7
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option8" autocomplete="off" value="8"> 8
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option9" autocomplete="off" value="9"> 9
  </label>
  <label class="btn btn-outline-primary btn-xs">
    <input type="radio" name="options" id="option9" autocomplete="off" value="10"> 10
  </label>
  </div>
  </div>
</li>
`;

function togglePartView(p, body_id) {
  var dataSelceted = p.attr("data_selceted");
  // console.log('svg click!!!!', this.id, data_selceted);
  if (dataSelceted == "true") {
    p.attr("data_selceted", "false");
    p.classed("st1", true);
    p.classed("st1_selected", false);
    p.style("opacity", 0.5);
    p.style("fill", "");
    delBodyPartItem(body_id);
  } else {
    p.attr("data_selceted", "true");
    p.classed("st1", false);
    p.classed("st1_selected", true);
    p.style("opacity", 0.4);
    add_body_part_item(body_id);
  }
}

function clearPartView(p) {
  p.attr("data_selceted", "false");
  p.classed("st1", true);
  p.classed("st1_selected", false);
  p.style("opacity", 0.5);
  p.style("fill", "");
}

function updateBodyPartItemColor(items) {
  for (i = 0; i < items.length; i++) {
    $(items[i]).css("background-color", color_map[i % 9]);
  }
}
function add_body_part_item(body_id) {
  var bList = $("#body_part_list_group");
  var itemId = "body_item_" + body_id;

  if ($(bList).find("#" + itemId).length == 0) {
    var item = bodyItemTemplate({
      id: body_id,
      itemId: itemId,
      name: "Part" + String(body_id),
    });

    bList.append(item);

    var items = bList.children("li");
    updateBodyPartItemColor(items);
  }
}

function delBodyPartItem(bodyID) {
  var bList = $("#body_part_list_group");
  var itemID = "body_item_" + bodyID;
  $(bList)
    .find("#" + itemID)
    .remove();

  var items = bList.children("li");
  updateBodyPartItemColor(items);
}

function getPartViewById(id) {
  var partId = "part_x5F_" + id;
  var sel = "#svg-container svg polygon";
  return $(sel).filter("#" + partId);
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
    s.getTSize();
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
  s.getTSize = function () {
    var size = s.t.node().getBoundingClientRect();
    s.w = size.width;
    s.h = size.height;
  };

  return s;
}

d3.xml("body_view2.svg").then((data) => {
  var svgContainer = d3.select("#svg-container");
  if (svgContainer.empty()) return;

  svgContainer.node().append(data.documentElement);
  var s = svgContainer.select("svg");
  var pList = s.selectAll("polygon");
  pList.attr("data_selceted", "false");

  pList.on("click", function () {
    var p = d3.select(this);
    var body_id = p.attr("id").split("_")[2];
    if (body_id.match(/\d+/)) {
      togglePartView(p, body_id);
    }
  });

  var tooltip = tooltipd3();
  var bodyTextList = s.selectAll("text").filter(function () {
    // console.log(d3.select(this).classed('st_label'))
    return !d3.select(this).classed("st_label");
  });

  bodyTextList
    .on("click", function () {
      d3.event.preventDefault();
      var thisNode = d3.select(this);
      var bodyID = thisNode.text();
      var idName = "#part_x5F_".concat(bodyID);
      var partPolygon = d3.select(this.parentNode).select(idName);

      togglePartView(partPolygon, bodyID);
    })
    .on("mouseover", function () {
      var thisNode = d3.select(this);
      var num = thisNode.text();
      var html = "part <b>" + num + "</b>";
      tooltip.mouseover(html); // pass html content
    })
    .on("mousemove", tooltip.mousemove)
    .on("mouseout", tooltip.mouseout);

  // console.log(s);
});

$("#body_part_btn").click(function () {
  console.log("add_test_btn pressed!!!");
});

$("#body_clear_btn").click(function () {
  console.log("body_clear_btn pressed!!!");
  var pList = d3.select("#svg-container").select("svg").selectAll("polygon");
  console.log(pList);
  clearPartView(pList);
  var bList = $("#body_part_list_group");
  bList.children().remove();
});


$("#body_clear_btn").click(function () {
  console.log("body_clear_btn pressed!!!");
  var pList = d3.select("#svg-container").select("svg").selectAll("polygon");
  console.log(pList);
  clearPartView(pList);
  var bList = $("#body_part_list_group");
  bList.children().remove();
});


function updadeBodyRedLevel(body_id, level) {
  var p = getPartViewById(body_id);
  p.css("opacity", 1.0);
  p.css("fill", red_map[level -1]);
}


$("#body_part_list_group").on("change", "input", function () {
  var body_id = $(this).parents(".body-item").attr("body_id");
  var level = parseInt($(this).val());
  // console.log($(this).parents())
  updadeBodyRedLevel(body_id, level);
});




