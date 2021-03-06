// Set folder route where data is contained
var route = "assets/data/data.csv"

// #############################################################
// PART I. CREATE SVG CANVAS
// #############################################################

// Establish area
var margin = {top: 30, right: 30, bottom: 60, left: 60},
    width = 510 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "canvas")
  .append("g")
    .attr("class", "scatter")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")"); 

// #############################################################
// PART II. BASIC CHART ELEMENTS; AXES GROUPS, SCALES & LABELS
// #############################################################

// Define axes scales 
var xScale = d3.scaleLinear()
    .domain([])
    .range([ 0, width ]);

var yScale = d3.scaleLinear()
    .domain([])
    .range([ height, 0]);

// Create axes generators
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

//Set defaults for initial rendering
// Default values
var xDefault = "poverty";
var yDefault = "healthcare";

// Renders initial scatterplot
function init() { 
    renderScatter(xDefault, yDefault)
}
init();

// Event handler calling inputChange function on change
var change = dropDownAll.on("change", inputChange)

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
        var input2 = yDefault
    } else {
        input2 = dropDown2Prop    
    }
    renderScatter(input1, input2)
}

// Function that returns the min and max to adjust graph axes dynamically
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
    // Remove existing data (circles, text and labels)
    svg.selectAll("circle").remove()
    svg.selectAll(".textCircle").remove()
    svg.select(".xAxisLabel").remove()
    svg.select(".yAxisLabel").remove()

    // Call the data
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

        //Wrap your circles and texts inside a <g>; https://stackoverflow.com/questions/36954426/adding-label-on-a-d3-scatter-plot-circles
        var gDots = svg.selectAll("gdot")
            .data(data)
            .enter()
            .append('g');
            
        // Add scatterplot circles
        gDots.append("circle")
            .attr("cx", d => xScale(d[xData]))
            .attr("cy", d => yScale(d[yData]))
            .attr("r", 10)
            .attr("class", "dataCirle")
            .style("fill", "#69b3a2");
            
        gDots.append("text")
            .text(function(d){
                return d.abbr
            })
            .attr("x", function(d) {
                return xScale(d[xData])
            })
            .attr("y", function(d){
                return yScale(d[yData])
            })
            .attr("font-size", 7.5)
            .attr("class", "textCircle")
            .attr("transform", "translate(-5, 3)")
            
        const xLabelCap = xData.charAt(0).toUpperCase() + xData.slice(1)
        svg.append("text")
            .attr("class", "xAxisLabel")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + width / 2 + "," + (height + 45) + ")")
            .text(xLabelCap);

        const yLabelCap = yData.charAt(0).toUpperCase() + yData.slice(1)
        console.log(yLabelCap)
        svg.append("text")
            .attr("class", "yAxisLabel")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (0 - margin.right) +","+ (height / 2) + ")rotate(-90)")
            .text(yLabelCap);
        
        // Step 1: 
        // var toolTip = d3.select("svg").append("div")
        //     .attr("class", "tooltip");
        
        // // Step 2: Add an onmouseover event to display a tooltip
        // // ========================================================
        // gDots.on("mouseover", function(d) {
        //     var state = d.state 
        //     toolTip.style("display", "block");
        //      toolTip.html(`<strong>${state}</strong>`);
        //})
        // // Step 3: Add an onmouseout event to make the tooltip invisible
        // .on("mouseout", function() {
        //     toolTip.style("display", "none");
        // });
    });
}
