const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = () => {
  fetch(dataUrl)
    .then((response) => response.json())
    .then((data) => {
      initApp(data);
    });
};

const createDate = (hourAndMinuteString) => {
  const date = new Date();
  date.setMinutes(
    Number(hourAndMinuteString.split(":")[0]),
    Number(hourAndMinuteString.split(":")[1])
  );
  return date;
};

/*
* Data Format
{
  "Time": "36:50",
  "Year": 1995,
  "Place": 1,
  "Seconds": 2210,
  "Name": "Marco Pantani",
  "Nationality": "ITA",
  "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
  "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
}
*/

const initApp = (data) => {
  const height = 400;
  const width = 800;
  const padding = 40;
  const circleRadius = 5;
  const timeFormat = d3.timeFormat("%M:%S");
  const timeAndYear = data.map((item) => {
    const date = new Date();
    date.setFullYear(item.Year);
    return [createDate(item.Time), date];
  });

  const tooltip = d3
    .select(".scatterplot__graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  d3.select(".scatterplot__container")
    .append("div")
    .attr("class", "scatterplot__title")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing");

  d3.select(".scatterplot__container")
    .append("div")
    .attr("class", "scatterplot__legend")
    .attr("id", "legend")
    .text("World Record x Year");

  const yScale = d3
    .scaleTime()
    .domain([
      d3.min(timeAndYear, (d) => d[0]),
      d3.max(timeAndYear, (d) => d[0]),
    ])
    .range([padding, height - padding]);

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(timeAndYear, (d) => d[1]),
      d3.max(timeAndYear, (d) => d[1]),
    ])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  const svg = d3
    .select(".scatterplot__graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);

  svg
    .selectAll("circle")
    .data(timeAndYear)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => d[1])
    .attr("data-yvalue", (d, i) => d[0])
    .attr("cx", (d, i) => xScale(d[1]))
    .attr("cy", (d, i) => yScale(d[0]))
    .attr("r", circleRadius)
    .on("mouseover", (d, i) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `${data[i].Name}, ${data[i].Nationality}<br>Year: ${data[i].Year} - Time: ${data[i].Time}<br>${data[i].Doping}`
        )
        .attr("data-year", d[1])
        .style("left", i + 30 + "px")
        .style("top", height - 100 + "px")
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
};
