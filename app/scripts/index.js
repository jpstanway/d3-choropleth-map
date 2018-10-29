// variables for data request
const URLs = [
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
    'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
];
const json = {};
const dataset = [];
let req = new XMLHttpRequest();

// data request loop
for(let i = 0; i < URLs.length; i++) {
    req.open('GET', URLs[i], true);
    req.onreadystatechange = function() {
        console.log(req.readyState);
        if(req.readyState === req.DONE && req.status === 200) {
            json[i] = JSON.parse(req.responseText);
        }
    }
    req.send();
}

// data received
req.onload = function() {

};
