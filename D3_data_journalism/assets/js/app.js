// Set folder route where data is contained
var route = "assets/data/data.csv"

// #########################################################
// PART I. CREATE SVG CANVAS
// #########################################################

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"); 

// #########################################################
// PART II. BASIC CHART ELEMENTS; AXES GROUPS
// #########################################################

// Define axes scales 
var xScale = d3.scaleLinear()
    .domain([0, 22]) //xDomain[0], xDomain[1]
    .range([ 0, width ]);

var yScale = d3.scaleLinear()
    .domain([0, 25]) // yDomain[0], yDomain[1]
    .range([ height, 0]);

// Define X and Y axes
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// Create group elements
svg.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("id", "yAxis")
    .call(yAxis);

// Create D3 selectors for dropdowns
var dropDownAll = d3.selectAll(".custom-select")
var dropDown1 = d3.select("#variable1")
var dropDown2 = d3.select("#variable2")

// Create an array of elements that will be appended to dropdown
var dropDownOpt = ["poverty", "age", "income", "healthcare", "obesity", "smokes"]

// Add options to dropdown lists
dropDownOpt.forEach(factor => {
    var option = dropDownAll.append("option")
    option
        .attr("value", factor)
        .text(factor)
})

// Create event handlers and a function to pass new inputs
// Event handler calling function on change
var change = dropDownAll.on("change", inputChange)

//Set defaults for initial rendering
// Default values
var xDefault = "poverty";
var yDefault = "healthcare";

// Renders initial scatterplot
function init() { 
    renderScatter(xDefault, yDefault)
}
init();

// Function grabbing new input and passing it along
function inputChange() {
    var dropDown1Prop = dropDown1.property("value");
    var dropDown2Prop = dropDown2.property("value");

    if (dropDown1Prop === "Choose...") {
        var input1 = xDefault
    } else {
        input1 = dropDown1Prop    
    }
    console.log(input1)
    if (dropDown2Prop === "Choose...") {
        //console.log("yes")
        var input2 = yDefault
    } else {
        input2 = dropDown2Prop    
    }
    renderScatter(input1, input2)
}

// Create a function that returns the min and max to adjust graph axes dynamically
function axesDomain(series) {
    function min (series) {
        var seriesNum = series.map(d => parseFloat(d))
        var seriesMin = d3.min(seriesNum, d => d)
        return seriesMin
    }
    function max (series) {
        var seriesNum = series.map(d => parseFloat(d))
        var seriesMax = d3.max(seriesNum, d => d)
        return seriesMax
    }
    var seriesMin = min(series);
    var seriesMax = max(series);
    
    return [seriesMin, seriesMax]
}

function renderScatter(xData, yData) {
    // Remove existing scatterplot
    svg.selectAll("circle").remove()

    d3.csv(route).then(function(data) {
        // Call Domain function to reset axes dynamically
        var xDomain = axesDomain(
            data.map(data => data[xData])
        );
        var yDomain = axesDomain(
            data.map(data => data[yData])
        );

        // Add scale to X axis and append "g" tag to svg
        xScale.domain([xDomain[0], xDomain[1]]);
        d3.select("#xAxis")
            .transition().duration(500)
            .call(xAxis)

        // Add scale to X axis and append "g" tag to svg
        yScale.domain([yDomain[0], yDomain[1]]);
        d3.select("#yAxis")
            .transition().duration(500)
            .call(yAxis)

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[xData]))
            .attr("cy", d => yScale(d[yData]))
            .attr("r", 5)
            .style("fill", "#69b3a2")
    })
}

// function rescale() {
//     yScale.domain([0,Math.floor((Math.random()*90)+11)])  // change scale to 0, to between 10 and 100
//     vis.select(".yaxis")
//             .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
//             .call(yAxis); 
// }
