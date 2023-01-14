(function (d3$1) {
  'use strict';

  const svg = d3$1.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const color = d => {
    if (d == 'Durchgefallen') return '#c44d56';
    else if (d == 'Bestanden') return '#00b16a';
  };

  const column = ['MinuteToComplete', 'Year', 'Nachklausur', 'Course', 'Grade', 'AttemptNumber', 'Bachelor/Master', 'Study'];

  const render = data => {
    const title = 'Exame Data';

    const margin = { top: 120, right: 50, bottom: 100, left: 270 };
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.right - margin.left;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3$1.scalePoint()
      .domain(column)
      .range([0, innerWidth]);

    var y = {};
    var yAxis = {};
    for (var i in column) {
      name = column[i];
      y[name] = d3$1.scaleLinear()
        .domain(d3$1.extent(data, d => d[name]))
        .range([innerHeight, 0])
        .nice();
        if(name == "Nachklausur"){
          yAxis[name] = d3$1.axisLeft(y[name])
        .ticks(1).tickFormat(function(d) {
          if(d === 1){return "Ja"}else{return "Nein"}
        })}else if(name == "Year"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(4).tickFormat(function(d) {
            return d;
          });
        }else if(name == "Course"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(1).tickFormat(function(d) {
            if(d === 1){return "Va"}else{return "Vis"}
          });
        }else if(name == "Grade"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(5).tickFormat(function(d) {
           return d;
          });
        }else if(name == "AttemptNumber"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(2).tickFormat(function(d) {
            return d;
          });
        }else if(name == "Bachelor/Master"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(1).tickFormat(function(d) {
            if(d === 0){return "Bachelor"}else{return "Master"}
          });
        }else if(name == "Study"){
          yAxis[name] = d3$1.axisLeft(y[name]).ticks(1).tickFormat(function(d) {
            if(d === 0){return "Mathe"}else{return "Winfo"}
          });
        }else{
          yAxis[name] = d3$1.axisLeft(y[name])
        .tickPadding(10);
        }
    }

    var draging = {};
    const Position = d =>
      draging[d] == null ? x(d) : draging[d];

    const path = d => 
        d3$1.line().curve(d3.curveBundle.beta(0.92))(column.map(p => [Position(p), y[p](d[p])]));

    const pathG = g.selectAll('path').data(data).enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', d => { return color(d.class); });

    const yAxisG = g.selectAll('.domain').data(column).enter()
      .append('g')
      .each(function (d) { d3$1.select(this).call(yAxis[d]); })
      .attr('transform', d => 'translate(' + x(d) + ',0)')
    
    const drag = (d) => {
      draging[d] = Math.min(innerWidth + 30, Math.max(-30, d3.event.x));
      pathG.attr('d', path);
      column.sort((p, q) => Position(p) - Position(q));
      x.domain(column);
      yAxisG.attr('transform', d => 'translate(' + Position(d) + ',0)');
    };

    const transition = g =>
      g.transition().duration(300);

    const dragend = d => {
      delete draging[d];
      transition(pathG).attr("d", path);
      transition(yAxisG).attr("transform", p => "translate(" + x(p) + ",0)");

    };

    yAxisG.call(d3.drag()
      .subject({ x: x })
      .on('drag', drag)
      .on('end', dragend)
    );

    yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('fill', 'black')
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .text(d => d);

    g.append('text')
      .attr('class', 'title')
      .attr('y', -50)
      .attr('x', 350)
      .text(title);

    g.append('text')
      .attr('class', 'Durchgefallen_color')
      .attr('y', 447)
      .attr('x', 0)
      .text('Durchgefallen')

    g.append('text')
      .attr('class', 'Bestanden_color')
      .attr('y', 447)
      .attr('x', 200)
      .text('Bestanden')

    g.append('rect')
      .attr('class', 'Durchgefallen_color')
      .attr('y', 430)
      .attr('x', 150)
      .attr('width', 40)
      .attr('height', 22)

    g.append('rect')
      .attr('class', 'Bestanden_color')
      .attr('y', 430)
      .attr('x', 317)
      .attr('width', 40)
      .attr('height', 22)

  };
  d3$1.csv("https://gist.githubusercontent.com/OnkelSam2/e1f493bfaa541989736f2d1b84fcfa0d/raw/ExamData.csv")
    .then(data => {
      data.forEach(d => {
      });
      render(data);
    });
}(d3));

