const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

const initApp = () => {
  fetch(dataUrl)
    .then((response) => response.json())
    .then((data) => {
      const yMargin = 40;
      const width = 800;
      const height = 400;
      const dataSet = data.data;
      const years = dataSet.map((item) => new Date(item[0]).getFullYear());
      const dates = dataSet.map((item) => new Date(item[0]));
      const gdp = dataSet.map((item) => item[1]);
      const barWidth = width / dataSet.length;

      const tooltip = d3
        .select(".bargraph__graph")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      const overlay = d3
        .select(".bargraph__graph")
        .append("div")
        .attr("class", "overlay")
        .style("opacity", 0);

      const svg = d3
        .select(".bargraph__graph")
        .append("svg")
        .attr("width", width + 100)
        .attr("height", height + 60);

      const xScale = d3
        .scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([height, 0]);

      const linearScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([0, height]);

      const scaledData = gdp.map((item) => linearScale(item));

      const xAxis = d3.axisBottom().scale(xScale);
      const yAxis = d3.axisLeft().scale(yScale);

      d3.select(".bargraph__container")
        .append("div")
        .attr("class", "bargraph__title")
        .attr("id", "title")
        .text("United States GDP");

      svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(60, 400)");

      svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(60, 0)");

      d3.select("svg")
        .selectAll("rect")
        .data(scaledData)
        .enter()
        .append("rect")
        .attr("data-date", (d, i) => dataSet[i][0])
        .attr("data-gdp", (d, i) => dataSet[i][1])
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(dates[i]))
        .attr("y", (d, i) => height - d)
        .attr("width", barWidth)
        .attr("height", (d) => d)
        .attr("transform", "translate(60, 0)")
        .style("fill", "#C34A36")
        .on("mouseover", (d, i) => {
          overlay
            .transition()
            .duration(0)
            .style("height", d + "px")
            .style("width", barWidth + "px")
            .style("opacity", 0.9)
            .style("left", i * barWidth + 0 + "px")
            .style("top", height - d + "px")
            .style("transform", "translateX(60px)");

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              years[i] +
                "<br>" +
                "$" +
                gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
                " Billion"
            )
            .attr("data-date", dataSet[i][0])
            .style("left", i * barWidth + 30 + "px")
            .style("top", height - 100 + "px")
            .style("transform", "translateX(60px)");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
          overlay.transition().duration(200).style("opacity", 0);
        });
    });
};
