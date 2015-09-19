
var DTW = require('./');

//var DTW = require('dtw');
var validate = require('./lib/validate');

// Monkey patch to allow for non-numeric input
validate.sequence = function() {};

var template = makeSeries([], 0, Math.PI*2);
var recorded = makeSeries([], Math.floor(Math.PI/2), Math.PI*3);

var dtw = new DTW({
  distanceFunction: function(i, j) {
    var distance = Math.pow(i.x - j.x, 2)
      + Math.pow(i.y - j.y, 2)
      //+ Math.pow(i.z - j.z, 2)
    return distance;
  }
});

console.log('template', template);
console.log('recorded', recorded);

var cost = dtw.compute(recorded, template);
var path = dtw.path();
console.log('cost', cost, 'path', path)
console.log(asciiDTWPath(path, recorded.length, template.length));

function makeSeries(out, start, end) {
  for (var i = start; i < end; i++) {
    out.push({
      x: Math.cos(i / (end-start)),
      y: Math.sin(i / (end-start))
    })
  }
  return out;
}


function asciiDTWPath (path, w, h) {
  "use strict";
  var all = new Array(w * h);

  // x are columns
  // y are rows (+ == down)
  path.forEach(xy => {
    let x = xy[0];
    let y = xy[1];
    all[(y * w) + x] = 'x';
  });

  let out = '';

  for (let i = 0; i < all.length; i++) {
    if (i % w === 0) out += '\n';
    if (all[i]) out += all[i];
    else out += '·';
  }

  return out;
}
