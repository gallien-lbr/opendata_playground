const width = document.getElementById("container").offsetWidth * 0.95,
    height = 500,
    fontFamily = "Open Sans",
    fontScale = d3.scaleLinear().range([20, 120]), // Construction d'une échelle linéaire continue qui va d'une font de 20px à 120px
    fillScale = d3.scaleOrdinal(d3.schemeCategory10); // Construction d'une échelle discrète composée de 10 couleurs différentes

let f  = "../data/wordsCount.csv";
let words = [];

d3.csv(f).then(function(csv) {

   
    csv.forEach(function(e,i) {
        words.push({"text": e.LABEL, "size": +e.COUNT});
    });
    
    let minSize = d3.min(words, function(d) { return d.size; });
    let maxSize = d3.max(words, function(d) { return d.size; });
    
    fontScale.domain([minSize, maxSize]);

    d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(1)
    .rotate(function() {
        return ~~(Math.random() * 2) * 45;
    })
    .spiral("rectangular")
    .font(fontFamily)
    .fontSize(function(d) { return fontScale(d.size); })
    .on("end", draw)
    .start();

});

function draw() {
    d3.select("#word-cloud").append("svg") // Ajout d'un élément SVG sur un DIV existant de la page
        .attr("class", "svg")
        .attr("width", width)
        .attr("height", height)
        .append("g") // Ajout du groupe qui contiendra tout les mots
            .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")") // Centrage du groupe
            .selectAll("text")
            .data(words)
            .enter().append("text") // Ajout de chaque mot avec ses propriétés
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", fontFamily)
                .style("fill", function(d, i) { return fillScale(d.size); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .text(function(d) { return d.text; });
}