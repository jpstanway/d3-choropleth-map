
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
    const width = 1080;
    const height = 600;

    // set up svg area
    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(0, 0)');

    // set up path
    /*const projection = d3.geoMercator()  
                         .translate([width, height])
                         .scale(100);*/

    const path = d3.geoPath();     
    const states = topojson.feature(data[1], data[1].objects.states).features;
    
    svg.selectAll('path')
       .data(states)
       .enter()
       .append('path')
       .attr('class', 'states')
       .attr('d', path);         
});