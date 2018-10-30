
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

    // draw state and county lines using path
    const path = d3.geoPath();     
    const states = topojson.feature(data[1], data[1].objects.states).features;
    const counties = topojson.feature(data[1], data[1].objects.counties).features;
    const colors = [
        [50, '#1B4E81'],
        [35, '#FFE066'],
        [20, '#A7C5E4'],
        [10, '#FFB6BE'],
        [0, '#D20F26']
    ];

    // create function to match data
    function connectData(id, dataToRetrieve) {
        let countyData = data[0].filter((data) => id === data.fips);
        countyData = countyData[0].bachelorsOrHigher;

        if(dataToRetrieve === 'percentage') {
            return countyData;
        } else if(dataToRetrieve === 'color') {
            for(let i = 0; i < colors.length; i++) {
                if(countyData >= colors[i][0]) {
                    return colors[i][1];
                }
            }
        } else {
            return false;
        }
    }

    svg.selectAll('path')
       .data(counties)
       .enter()
       .append('path')
       .attr('class', 'county')
       .attr('d', path)
       .attr('data-fips', (d) => d.id)
       .attr('data-education', (d) => connectData(d.id, 'percentage'))
       .style('fill', (d) => connectData(d.id, 'color'));    
    
    svg.selectAll('path')
       .data(states)
       .enter()
       .append('path')
       .attr('class', 'states')
       .attr('d', path);         
});