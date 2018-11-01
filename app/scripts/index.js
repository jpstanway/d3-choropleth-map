
// urls containing json data
const URLs = [
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
];
const dataset = [];

URLs.forEach((url) => {
    dataset.push(d3.json(url));
});

Promise.all(dataset).then((data) => {

    // declare dimensions
    const width = 960;
    const height = 600;

    // create tooltip for individual counties
    const tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .attr('id', 'tooltip')
                  .direction('se')
                  .html((d) => {
                    const loc = connectData(d.id, 'location');
                    const rate = connectData(d.id, 'percentage');

                    d3.select('#tooltip').attr('data-education', rate);

                    return `
                        <p>${loc}</p>
                        <p class="rate">${rate}%</p>
                    `;
                  });         

    // set up svg area
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(0, 0)')
                    .call(tip);

    // draw state and county lines using path
    const path = d3.geoPath();     
    const states = topojson.feature(data[1], data[1].objects.states).features;
    const counties = topojson.feature(data[1], data[1].objects.counties).features;
    const colors = [
        [70, '#070f00'],
        [60, '#142700'],
        [50, '#386f00'],
        [40, '#5cb700'],
        [30, '#87ff0d'],
        [20, '#afff5b'],
        [10, '#d5ffa9'],
        [0, '#f4fee9']
    ];

    // create function to match data
    function connectData(id, dataToRetrieve) {
        const countyData = data[0].filter((data) => id === data.fips);
        const percentage = countyData[0].bachelorsOrHigher;
        const location = `${countyData[0].area_name}, ${countyData[0].state}`;

        if(dataToRetrieve === 'percentage') {
            return percentage;
        } else if(dataToRetrieve === 'color') {
            for(let i = 0; i < colors.length; i++) {
                if(percentage >= colors[i][0]) {
                    return colors[i][1];
                }
            }
        } else if (dataToRetrieve === 'location') {
            return location;
        } else {
            return false;
        }
    }

    // draw counties and states
    svg.selectAll('path')
       .data(counties)
       .enter()
       .append('path')
       .attr('class', 'county')
       .attr('d', path)
       .attr('data-fips', (d) => d.id)
       .attr('data-education', (d) => connectData(d.id, 'percentage'))
       .style('fill', (d) => connectData(d.id, 'color'))
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);    
    
    svg.selectAll('path')
       .data(states)
       .enter()
       .append('path')
       .attr('class', 'states')
       .attr('d', path);      
       
    // set up legend, scale and axis
    const legendWidth = 90;
    const padding = 60;

    const legend = d3.select('#legend')
                     .append('svg')
                     .attr('width', legendWidth + 1)
                     .attr('height', height);
        
    const yScale = d3.scaleLinear()
                     .domain([d3.min(data[0], (d) => d.bachelorsOrHigher), d3.max(data[0], (d) => d.bachelorsOrHigher)])
                     .range([padding, height - padding])
                     .nice();

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat((d) => `${d}%`)
                    .tickSize([66]);              

    // append axis to legend
    legend.append('g')
          .attr('transform', `translate(${legendWidth}, 0)`)
          .attr('id', 'legend-axis')
          .call(yAxis)
          .call(adjustTickPosition);

    function adjustTickPosition(selection) {
        selection.selectAll('.tick line')
                 .attr('transform', `translate(0, -1)`);
    }         

    // append colored rects to legend
    legend.selectAll('rect')
          .data(colors)
          .enter()
          .append('rect')
          .attr('class', 'legend-colors')
          .attr('width', 60)
          .attr('height', 59)
          .attr('x', 30)
          .attr('y', (d) => yScale(d[0]))
          .style('fill', (d) => d[1]);
});