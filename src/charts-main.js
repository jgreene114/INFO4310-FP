function getViewportDimensions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;

    return {
        viewportWidth,
        viewportHeight,
        vw,
        vh
    };
}

async function drawCharts(dimensions) {
    // console.log(dimensions)

    // LINE PLOT
    const svgLine = d3.select("svg#lineplot")
        .attr("height", dimensions.viewportHeight / 3 * 2)
        .attr("width", dimensions.viewportWidth / 5 * 3)
    const widthLine = svgLine.attr("width");
    const heightLine = svgLine.attr("height");
    const marginLine = { top: 40, right: 10, bottom: 50, left: 60 };
    const chartWidthLine = widthLine - marginLine.left - marginLine.right;
    const chartHeightLine = heightLine - marginLine.top - marginLine.bottom;

    let annotationsLine = svgLine.append("g").attr("id", "annotations");
    let chartAreaLine = svgLine.append("g").attr("id", "points")
        .attr("transform", `translate(${marginLine.left},${marginLine.top})`);

    // BAR CHART
    const svgBar = d3.select("svg#barchart")
        .attr("height", dimensions.viewportHeight / 3 * 2)
        .attr("width", dimensions.viewportWidth / 5 * 3);
    const widthBar = svgBar.attr("width");
    const heightBar = svgBar.attr("height");
    const marginBar = { top: 50, right: 60, bottom: 50, left: 50 };
    const chartWidthBar = widthBar - marginBar.left - marginBar.right;
    const chartHeightBar = heightBar - marginBar.top - marginBar.bottom;

    let annotationsBar = svgBar.append("g").attr("id", "annotations");
    let chartAreaBar = svgBar.append("g").attr("id", "points")
        .attr("transform", `translate(${marginBar.left},${marginBar.top})`);

    // MDR PLOT
    const svgMdr = d3.select("svg#mdrplot");
    const widthMdr = svgMdr.attr("width");
    const heightMdr = svgMdr.attr("height");
    const marginMdr = { top: 40, right: 10, bottom: 50, left: 60 };
    const chartWidthMdr = widthMdr - marginMdr.left - marginMdr.right;
    const chartHeightMdr = heightMdr - marginMdr.top - marginMdr.bottom;

    let annotationsMdr = svgMdr.append("g").attr("id", "annotations");
    let chartAreaMdr = svgMdr.append("g").attr("id", "points")
        .attr("transform", `translate(${marginMdr.left},${marginMdr.top})`);

    // BUBBLE CHART
    const svgBubble = d3.select("svg#bubblechart")
        .attr("width", dimensions.viewportWidth / 5 * 3.4);
    const widthBubble = svgBubble.attr("width");
    const heightBubble = svgBubble.attr("height");
    const marginBubble = { top: 20, right: 10, bottom: 50, left: 50 };
    const chartWidthBubble = widthBubble - marginBubble.left - marginBubble.right;
    const chartHeightBubble = heightBubble - marginBubble.top - marginBubble.bottom;

    let annotationsBubble = svgBubble.append("g").attr("id", "annotations");
    let chartAreaBubble = svgBubble.append("g").attr("id", "points")
        .attr("transform", `translate(${marginBubble.left},${marginBubble.top})`);

    return {
        svgMdr, widthMdr, heightMdr, marginMdr, chartWidthMdr, chartHeightMdr, annotationsMdr, chartAreaMdr,

        svgLine, widthLine, heightLine, marginLine, chartWidthLine, chartHeightLine,
        annotationsLine, chartAreaLine,

        svgBar, widthBar, heightBar, marginBar, chartWidthBar, chartHeightBar,
        annotationsBar, chartAreaBar,

        svgBubble, widthBubble, heightBubble, marginBubble, chartWidthBubble, chartHeightBubble,
        annotationsBubble, chartAreaBubble
    };
}

const requestDataCharts = async function () {
    const dimensions = getViewportDimensions();

    let {
        svgMdr, widthMdr, heightMdr, marginMdr, chartWidthMdr, chartHeightMdr, annotationsMdr, chartAreaMdr,

        svgLine, widthLine, heightLine, marginLine, chartWidthLine, chartHeightLine,
        annotationsLine, chartAreaLine,

        svgBar, widthBar, heightBar, marginBar, chartWidthBar, chartHeightBar,
        annotationsBar, chartAreaBar,

        svgBubble, widthBubble, heightBubble, marginBubble, chartWidthBubble, chartHeightBubble,
        annotationsBubble, chartAreaBubble
    } = await drawCharts(dimensions)

    // MDR PLOT
    const mdr = await d3.csv("./data/mdr-sst.csv");

    const parseDate = d3.timeParse("%m%d");
    mdr.forEach(d => {
        d.MMDD = parseDate(String(d.MMDD).padStart(4, '0'));
        for (let year = 2013; year <= 2024; year++) {
            d[year] = +d[year];
        }
    });

    // console.log(mdr)

    // Y Axis
    const thermalScale = d3.scaleLinear().domain([0, 80]).range([chartHeightMdr, 0]);
    let leftAxisMdr = d3.axisLeft(thermalScale)
    let leftGridlinesMdr = d3.axisLeft(thermalScale)
        .tickSize(-chartWidthMdr - 10)
        .tickFormat("")
    annotationsMdr.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${marginMdr.left - 10},${marginMdr.top})`)
        .call(leftAxisMdr)
    annotationsMdr.append("g")
        .attr("class", "y gridlines")
        .attr("transform", `translate(${marginMdr.left - 10},${marginMdr.top})`)
        .call(leftGridlinesMdr)
        .attr("stroke-dasharray", "5,5");

    // X Axis
    const monthScaleMdr = d3.scaleTime()
        .domain(d3.extent(mdr, d => d.MMDD))
        .range([0, chartWidthMdr]);
    let bottomAxisMdr = d3.axisBottom(monthScaleMdr).tickFormat(d3.timeFormat("%b"));
    let bottomGridlinesMdr = d3.axisBottom(monthScaleMdr)
        .tickSize(-chartHeightMdr - 10)
        .tickFormat("");
    annotationsMdr.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${marginMdr.left},${chartHeightMdr + marginMdr.top + 10})`)
        .call(bottomAxisMdr);
    annotationsMdr.append("g")
        .attr("class", "x gridlines")
        .attr("transform", `translate(${marginMdr.left},${chartHeightMdr + marginMdr.top + 10})`)
        .call(bottomGridlinesMdr)
        .attr("stroke-dasharray", "5,5");

    // Title
    svgMdr.append("text")
        .attr("x", widthMdr / 2)
        .attr("y", marginMdr.top - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Arial")
        .text("Ocean Heat Content in Main Development Region (10-20N 85-25W)");

    // Y Axis Label
    svgMdr.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -(heightMdr / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "Arial")
        .text("kJ/cm2");

    const lineGenMdr = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => monthScaleMdr(d.MMDD))
        .y(d => thermalScale(d.value))
        .curve(d3.curveMonotoneX);

    const dataByYearMdr = Object.keys(mdr[0]).filter(d => d !== 'MMDD' && d !== 'CLIMO').map(year => {
        return {
            year: year,
            values: mdr.map(d => {
                return {
                    MMDD: d.MMDD,
                    value: d[year]
                };
            }).filter(d => !isNaN(d.value))
        };
    });


    chartAreaMdr.selectAll(".line")
        .data(dataByYearMdr)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", d => lineGenMdr(d.values))
        .attr("fill", "none")
        .attr("stroke", d => d.year === "2024" ? "orange" : d.year === "2023" ? "black" : "lightgray")
        .attr("stroke-width", 2);

    // Label 2024
    const lastElement2024 = mdr.filter(d => !isNaN(d[2024])).slice(-1)[0];

    chartAreaMdr.append("circle")
        .attr("cx", monthScaleMdr(lastElement2024.MMDD))
        .attr("cy", thermalScale(lastElement2024[2024]))
        .attr("r", 5)
        .attr("fill", "orange");

    chartAreaMdr.append("text")
        .attr("x", monthScaleMdr(lastElement2024.MMDD) - 15)
        .attr("y", thermalScale(lastElement2024[2024]) - 15)
        .attr("text-anchor", "start")
        .style("font-family", "Arial")
        .attr("fill", "orange")
        .text("2024");

    // Label 2023
    const midpointIndex2023 = Math.floor(mdr.filter(d => !isNaN(d[2023])).length / 2);
    const midpointElement2023 = mdr.filter(d => !isNaN(d[2023]))[midpointIndex2023];

    chartAreaMdr.append("text")
        .attr("x", monthScaleMdr(midpointElement2023.MMDD) - 10)
        .attr("y", thermalScale(midpointElement2023[2023]) - 30)
        .attr("text-anchor", "start")
        .style("font-family", "Arial")
        .attr("fill", "black")
        .text("2023");

    // Label 2013-22
    const midpointIndex2018 = Math.floor(mdr.filter(d => !isNaN(d[2018])).length / 2);
    const midpointElement2018 = mdr.filter(d => !isNaN(d[2018]))[midpointIndex2018];

    chartAreaMdr.append("text")
        .attr("x", monthScaleMdr(midpointElement2018.MMDD) + 10)
        .attr("y", thermalScale(midpointElement2018[2018]))
        .attr("text-anchor", "start")
        .style("font-family", "Arial")
        .attr("fill", "gray")
        .text("2013-22");


    // LINE PLOT
    const sst = await d3.csv("./data/sst.csv");
    // console.log(sst)

    // Y axis
    const tempExtent = d3.extent(sst, d => d['Temperature']);
    const tempScale = d3.scaleLinear().domain(tempExtent).range([chartHeightLine, 0]);
    let leftAxisLine = d3.axisLeft(tempScale)
    let leftGridlinesLine = d3.axisLeft(tempScale)
        .tickSize(-chartWidthLine - 10)
        .tickFormat("")
    annotationsLine.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${marginLine.left - 10},${marginLine.top})`)
        .call(leftAxisLine)
    annotationsLine.append("g")
        .attr("class", "y gridlines")
        .attr("transform", `translate(${marginLine.left - 10},${marginLine.top})`)
        .call(leftGridlinesLine)
        .attr("stroke-dasharray", "5,5");

    // X Axis
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthScale = d3.scaleLinear()
        .domain([1, 12])
        .range([0, chartWidthLine]);
    let bottomAxisLine = d3.axisBottom(monthScale).tickFormat(d => monthNames[d - 1]);
    let bottomGridlinesLine = d3.axisBottom(monthScale)
        .tickSize(-chartHeightLine - 10)
        .tickFormat("")
    annotationsLine.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${marginLine.left},${chartHeightLine + marginLine.top + 10})`)
        .call(bottomAxisLine);
    annotationsLine.append("g")
        .attr("class", "x gridlines")
        .attr("transform", `translate(${marginLine.left},${chartHeightLine + marginLine.top + 10})`)
        .call(bottomGridlinesLine)
        .attr("stroke-dasharray", "5,5");

    // Title
    svgLine.append("text")
        .attr("x", widthLine / 2)
        .attr("y", marginLine.top - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Arial")
        .text("Niño Regions Sea Surface Temperatures (1982-2024)");

    // Y Axis Label
    svgLine.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -(heightLine / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "Arial")
        .text("Sea Surface Temperature (°F)");

    var lineGen = d3.line()
        .x(d => monthScale(d['Month']))
        .y(d => tempScale(d['Temperature']))
        .curve(d3.curveMonotoneX);

    const dataByYear = d3.group(sst, d => d['Year']);

    const tooltipLine = d3.select("#tooltipLine");

    chartAreaLine.selectAll(".line")
        .data(dataByYear)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", d => lineGen(d[1]))
        .attr("fill", "none")
        .attr("stroke", d => d[0] === "2024" ? "#8B0000" : "#d9d9d9")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .raise()
                .transition()
                .duration(150)
                .attr("stroke-width", 4)
                .attr("stroke", "blue");

            const avgTemperature = d[1].reduce((acc, cur) => acc + parseFloat(cur.Temperature), 0) / d[1].length;

            tooltipLine.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipLine.html(`Year: ${d[0]}<br/>Average Temperature: ${avgTemperature.toFixed(2)}°F`)
                .style("left", (event.x - 200) + "px")
                .style("top", (event.y - 110) + "px");
        })
        .on("mouseout", function (d) {
            const element = d3.select(this);

            element
                .transition()
                .duration(150)
                .attr("stroke-width", 2)
                .attr("stroke", d => d[0] === "2024" ? "#8B0000" : (d[0] === "Average" ? "red" : "#d9d9d9"));

            if (d[0] !== "2024" && d[0] !== "Average") {
                element.lower();
            }

            tooltipLine.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const filteredData = Array.from(dataByYear).filter(([year,]) => year !== "2024");
    let monthlyAverages = [];
    for (let month = 1; month <= 12; month++) {
        let totalTemp = 0;
        let count = 0;
        filteredData.forEach(([, values]) => {
            values.forEach(d => {
                if (d['Month'] == month) {
                    totalTemp += parseFloat(d['Temperature']);
                    count++;
                }
            });
        });
        monthlyAverages.push({ Month: month, Temperature: totalTemp / count });
    }

    chartAreaLine.append("path")
        .datum(monthlyAverages)
        .attr("class", "average-line")
        .attr("d", lineGen)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Average Label
    const legendGroup = svgLine.append("g")
        .attr("transform", `translate(${widthLine - marginLine.right - 675},${marginLine.top + 400})`);

    legendGroup.append("rect")
        .attr("width", 24)
        .attr("height", 12)
        .attr("fill", "red");

    legendGroup.append("text")
        .attr("x", 30)
        .attr("y", 10)
        .style("font-family", "Arial")
        .text("1982-2023 Average");

    // 2024 Label
    const dec2024Data = sst.find(d => d['Year'] === "2024" && d['Month'] === "3");

    svgLine.append("circle")
        .attr("cx", monthScale(dec2024Data['Month']) + marginLine.left)
        .attr("cy", tempScale(dec2024Data['Temperature']) + marginLine.top)
        .attr("r", 5)
        .attr("fill", "#8B0000");

    svgLine.append("text")
        .attr("x", monthScale(dec2024Data['Month']) + marginLine.left + 10)
        .attr("y", tempScale(dec2024Data['Temperature']) + marginLine.top + 5)
        .attr("text-anchor", "start")
        .style("font-family", "Arial")
        .text("2024");

    // BAR CHART
    const oni = await d3.csv("./data/oni_data.csv");
    // console.log(oni)

    // Y Axis
    const celsiusScale = d3.scaleLinear().domain([-3, 3]).range([chartHeightBar, 0]);
    const celsiusTicks = celsiusScale.ticks();
    const fahrenheitScale = d3.scaleLinear().domain([-5.4, 5.4]).range(celsiusScale.range());
    const fahrenheitTicks = celsiusTicks.map(d => (d * 1.8));
    const leftAxisBar = d3.axisLeft(celsiusScale)
        .tickValues(celsiusTicks)
        .tickFormat(d => `${d}°C`);
    const rightAxisBar = d3.axisRight(fahrenheitScale)
        .tickValues(fahrenheitTicks)
        .tickFormat(d => `${d.toFixed(1)}°F`);
    annotationsBar.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${marginBar.left - 10},${marginBar.top})`)
        .call(leftAxisBar);
    annotationsBar.append("g")
        .attr("class", "y axis fahrenheit")
        .attr("transform", `translate(${marginBar.left + chartWidthBar + 10},${marginBar.top})`)
        .call(rightAxisBar);
    let leftGridlinesBar = d3.axisLeft(celsiusScale)
        .tickSize(-chartWidthBar - 20)
        .tickFormat("")
    annotationsBar.append("g")
        .attr("class", "y gridlines")
        .attr("transform", `translate(${marginBar.left - 10},${marginBar.top})`)
        .call(leftGridlinesBar)
        .selectAll(".tick")
        .each(function (d) {
            if (d === 0.5) {
                d3.select(this).select("line")
                    .style("stroke", "red")
                    .style("stroke-width", "2px");
            } else if (d === -0.5) {
                d3.select(this).select("line")
                    .style("stroke", "blue")
                    .style("stroke-width", "2px");
            }
        });

    // X Axis
    oni.forEach(d => {
        d.combined = `${d.SEAS} ${d.YR}`;
    });

    const selectedTicks = [
        "DJF 1950", "AMJ 1958", "ASO 1966", "DJF 1975",
        "AMJ 1983", "ASO 1991", "DJF 2000", "AMJ 2008",
        "ASO 2016", "JFM 2024"
    ];

    const timeScale = d3.scaleBand()
        .domain(oni.map(d => d.combined))
        .range([0, chartWidthBar])
        .padding(0.1);

    const bottomAxisBar = d3.axisBottom(timeScale)
        .tickValues(selectedTicks);

    annotationsBar.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${marginBar.left},${chartHeightBar + marginBar.top + 10})`)
        .call(bottomAxisBar)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", "0em")
        .attr("dy", "1em");

    // Bars
    chartAreaBar.selectAll("mybar")
        .data(oni)
        .enter()
        .append("rect")
        .attr("x", d => timeScale(d.combined))
        .attr("y", d => Math.min(celsiusScale(d.ANOM), celsiusScale(0)))
        .attr("width", timeScale.bandwidth())
        .attr("height", d => Math.abs(celsiusScale(d.ANOM) - celsiusScale(0)))
        .attr("fill", d => d.ANOM > 0 ? "red" : "blue");

    // Highlights
    let positiveIntervals = [];
    let negativeIntervals = [];
    let currentInterval = { start: null, end: null };

    oni.forEach((d, i) => {
        if (d.ANOM > 0.5) {
            if (currentInterval.start === null) {
                currentInterval.start = i;
            }
            currentInterval.end = i;
        } else if (d.ANOM <= 0.5 && currentInterval.start !== null) {
            positiveIntervals.push({ ...currentInterval });
            currentInterval = { start: null, end: null };
        }
        if (d.ANOM < -0.5) {
            if (currentInterval.start === null) {
                currentInterval.start = i;
            }
            currentInterval.end = i;
        } else if (d.ANOM >= -0.5 && currentInterval.start !== null) {
            negativeIntervals.push({ ...currentInterval });
            currentInterval = { start: null, end: null };
        }
    });

    if (currentInterval.start !== null) {
        if (oni[currentInterval.start].ANOM > 0.5) {
            positiveIntervals.push({ ...currentInterval });
        } else if (oni[currentInterval.start].ANOM < -0.5) {
            negativeIntervals.push({ ...currentInterval });
        }
    }

    function drawIntervals(intervals, color) {
        intervals.forEach(interval => {
            chartAreaBar.append("rect")
                .attr("x", timeScale(oni[interval.start].combined))
                .attr("y", 0)
                .attr("width", timeScale(oni[interval.end].combined) - timeScale(oni[interval.start].combined) + timeScale.bandwidth())
                .attr("height", chartHeightBar)
                .attr("fill", color)
                .attr("opacity", 0.2);
        });
    }

    drawIntervals(positiveIntervals, "blue");
    drawIntervals(negativeIntervals, "red");

    // Tooltips
    const tooltipRect = chartAreaBar.append('rect')
        .attr('opacity', 0)
        .attr('fill', 'blue')
        .attr('rx', 5)
        .attr('ry', 5);

    const tooltipBar = chartAreaBar.append('text')
        .attr('opacity', 0)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white')
        .style('font-size', '16px');

    // Interactivity
    chartAreaBar.append('rect')
        .attr('width', chartWidthBar)
        .attr('height', chartHeightBar)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

    const verticalLine = chartAreaBar.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', chartHeightBar)
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .style('visibility', 'hidden');


    function updateLinePosition(event) {
        const mouseX = d3.pointer(event, chartAreaBar.node())[0];
        const adjustedMouseX = mouseX - marginBar.left + 50;
        verticalLine
            .attr('x1', mouseX)
            .attr('x2', mouseX)
            .style('visibility', 'visible');

        const index = Math.round(adjustedMouseX / timeScale.step());
        if (index >= 0 && index < oni.length) {
            const data = oni[index];

            tooltipBar
                .text(`${data.SEAS} ${data.YR}: ${data.ANOM} °C (${(data.ANOM * 1.8).toFixed(1)} °F)`)
                .attr('x', mouseX)
                .attr('y', 15)
                .attr('opacity', 1);

            const textWidth = tooltipBar.node().getBBox().width;
            tooltipRect
                .attr('x', mouseX - textWidth / 2 - 5)
                .attr('y', 5)
                .attr('width', textWidth + 10)
                .attr('height', 20)
                .attr('fill', data.ANOM > 0 ? 'red' : data.ANOM < 0 ? 'blue' : 'gray')
                .attr('opacity', 1);

            tooltipRect.raise();
            tooltipBar.raise();
        }
    }

    chartAreaBar.on('mousemove', updateLinePosition);
    chartAreaBar.on('mouseleave', () => {
        verticalLine.style('visibility', 'hidden');
        tooltipBar.attr('opacity', 0);
        tooltipRect.attr('opacity', 0);
    });

    // Title
    svgBar.append("text")
        .attr("x", (marginBar.left + chartWidthBar / 2))
        .attr("y", marginBar.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Arial")
        .style("font-weight", "bold")
        .text("Oceanic Niño Index (ONI)");

    svgBar.append("text")
        .attr("x", (marginBar.left + chartWidthBar / 2))
        .attr("y", marginBar.top / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Arial")
        .text("3-Month Running Mean of Niño 3.4 SST Anomalies");

    // BUBBLE CHART
    const events = await d3.csv("./data/events-us.csv", function (d) {
        const parsedDate = new Date(d.Date);
        d.parsedYear = parsedDate.getFullYear();
        d.parsedMonth = parsedDate.getMonth() + 1;
        d.parsedDay = parsedDate.getDate();
        return d;
    });

    // console.log(events)

    // Y Axis
    const years = d3.range(1980, 2025);
    const yearScale = d3.scaleLinear().domain([1980, 2025]).range([chartHeightBubble, 0]);
    let leftGridlinesBubble = d3.axisLeft(yearScale)
        .tickSize(-chartWidthBubble - 20)
        .tickFormat(d3.format("d"))
        .tickValues(years);

    annotationsBubble.append("g")
        .attr("class", "y gridlines")
        .attr("transform", `translate(${marginBubble.left - 10},${marginBubble.top})`)
        .call(leftGridlinesBubble)

    // X Axis
    const monthScaleBubble = d3.scaleLinear()
        .domain([1, 12])
        .range([20, chartWidthLine - 20]);

    let topAxisBubble = d3.axisTop(monthScaleBubble)
        .tickFormat(d => monthNames[d - 1]);

    annotationsBubble.append("g")
        .attr("class", "x axis no-axis-line")
        .attr("transform", `translate(${marginBubble.left},${marginBubble.top})`)
        .style("z-index", 100)
        .call(topAxisBubble);

    // Add Circles (Arcs)
    const monthMapping = {
        "January": "1", "February": "2", "March": "3", "April": "4", "May": "5",
        "June": "6", "July": "7", "August": "8", "September": "9", "October": "10",
        "November": "11", "December": "12"
    };
    const costExtent = d3.extent(events, d => d['Total CPI-Adjusted Cost (Billions of Dollars)']);

    const disScale = d3.scaleOrdinal()
        .domain(['Flooding', 'Tropical Cyclone', 'Drought', 'Freeze', 'Severe Storm', 'Winter Storm', 'Wildfire'])
        .range(['#41b6c4', '#081d58', '#ffffd9', '#cccccc', '#c7e9b4', '#cccccc', '#ffffd9']);

    const halfCircleArc = d3.arc()
        .innerRadius(0)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

    const disasterOrder = {
        "Drought": 1,
        "Wildfire": 2,
        "Severe Storm": 2,
        "Freeze": 3,
        "Winter Storm": 3,
        "Flooding": 4,
        "Tropical Cyclone": 5
    };

    const filteredEvents = events
        .filter(d => d['Total CPI-Adjusted Cost (Billions of Dollars)'] > 2)
        .sort((a, b) => disasterOrder[a.Disaster] - disasterOrder[b.Disaster]);

    if (!document.getElementById("tooltip")) {
        d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("display", "none")
            .style("padding", "5px 10px")
            .style("background", "white")
            .style("opacity", 0.85)
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("font-size", "12px");
    }

    const tooltip = d3.select("#tooltip");

    chartAreaBubble.selectAll("path.point").data(filteredEvents)
        .join("path")
        .attr("class", "point")
        .attr("d", d => halfCircleArc.outerRadius(Math.sqrt(d['Total CPI-Adjusted Cost (Billions of Dollars)']) * 10)())
        .attr("transform", d => {
            const monthPosition = monthScaleBubble(d.parsedMonth + (d.parsedDay / 30));
            return `translate(${monthPosition}, ${yearScale(d.parsedYear)})`;
        })
        .attr("opacity", 0.7)
        .attr("stroke", "black")
        .attr("stroke-width", 0.3)
        .style("fill", d => disScale(d['Disaster']))
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("opacity", 1)
                .attr("stroke-width", 2);

            tooltip.style("display", "block")
                .html(`${d.Name}<br/><strong>$${parseFloat(d['Total CPI-Adjusted Cost (Billions of Dollars)']).toFixed(2)} billion</strong>`);
        })
        .on("mousemove", function (event) {
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipX = event.pageX - tooltipWidth / 2 - 100;
            const tooltipY = event.pageY - 110;
            tooltip.style("left", `${tooltipX}px`)
                .style("top", `${tooltipY}px`);
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("opacity", 0.7)
                .attr("stroke-width", "0.3");

            tooltip.style("display", "none");
        });

}


