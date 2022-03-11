import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  //if a vertical line
  if(x1 == x2) {
    let max_y = Math.max(y1, y2);
    let min_y = Math.min(y1, y2);
    let length = max_y - min_y;
    for(let y = min_y; y <= max_y; y++){
      let v1_ratio = this.lineLength([x2, y2], [x1, y])/length;
      let v2_ratio = this.lineLength([x1, y1], [x1, y])/length;
      let colour = [r1*v1_ratio + r2*v2_ratio, g1*v1_ratio + g2*v2_ratio, b1*v1_ratio + b2*v2_ratio]
      this.setPixel(Math.floor(x1), Math.floor(y), colour);
      console.log(x1 + ", ", y);
    }
    return
  }
  //determine max x
  let max_x = x1;
  let min_x = x2;
  let starting_y = y2;
  let ending_y = y1;
  let m = (y2 -y1)/(x2-x1)
  if (x2 > max_x) {
    max_x = x2;
    min_x = x1;
    starting_y = y1;
    ending_y = y2;
  }
  if(Math.abs(m) <= 1) {
    let y = starting_y;
    let length = this.lineLength([x1, y1], [x2, y2]);
    for(let x = min_x; x <= max_x; x++){
      let v1_ratio = this.lineLength([x2, y2], [x, y])/length;
      let v2_ratio = this.lineLength([x1, y1], [x, y])/length;
      let colour = [r1*v1_ratio + r2*v2_ratio, g1*v1_ratio + g2*v2_ratio, b1*v1_ratio + b2*v2_ratio]
      this.setPixel(Math.floor(x), Math.floor(y), colour);
      console.log(x + ", ", y)
      y += m
    }
  } else {
    max_x = y1;
    min_x = y2;
    starting_y = x2;
    ending_y = x1;
    m = (x2 -x1)/(y2-y1)
    if (y2 > max_x) {
      max_x = y2;
      min_x = y1;
      starting_y = x1;
      ending_y = x2;
    }
    let x = starting_y;
    let length = this.lineLength([x1, y1], [x2, y2]);
    for(let y = min_x; y <= max_x; y++){
      let v1_ratio = this.lineLength([x2, y2], [x, y])/length;
      let v2_ratio = this.lineLength([x1, y1], [x, y])/length;
      let colour = [r1*v1_ratio + r2*v2_ratio, g1*v1_ratio + g2*v2_ratio, b1*v1_ratio + b2*v2_ratio]
      this.setPixel(Math.floor(x), Math.floor(y), colour);
      console.log(x + ", ", y)
      x += m
    }
  }
  
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  //Step 1: get the bounding box
  let min_x = Math.min(x1, x2, x3);
  let min_y = Math.min(y1, y2, y3);
  let max_x = Math.max(x1, x2, x3);
  let max_y = Math.max(y1, y2, y3);
  
  let main_tringle_area = this.triangleArea([x1, y1], [x2, y2], [x3, y3]);

  for (let x = min_x; x <= max_x; x++) {
    for (let y = min_y; y <= max_y; y++) {
      let area1 = this.triangleArea([x, y], [x2, y2], [x3, y3]);
      let area2 = this.triangleArea([x, y], [x1, y1], [x3, y3]);
      let area3 = this.triangleArea([x, y], [x1, y1], [x2, y2]);
      if(area1 + area2 + area3 <= main_tringle_area){
        let u = area1/main_tringle_area;
        let v = area2/main_tringle_area;
        let w = area3/main_tringle_area;
        let colour = [r1*u+r2*v+r3*w, g1*u+g2*v+g3*w, b1*u+b2*v+b3*w];
        this.setPixel(Math.floor(x), Math.floor(y), colour);
      }
    }
  }
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  // this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
}

// Calculate area of triangle based on 3 given points
Rasterizer.prototype.triangleArea = function(v1, v2, v3) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  const [x3, y3] = v3;
  return Math.abs((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2))/2);
}

// Calculate length of line based on 2 given points
Rasterizer.prototype.lineLength = function(v1, v2) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,31,8,0.0,0.0,0.0;",
  "v,8,53,0.0,0.0,0.0;",
  "v,54,53,0.0,0.0,0.0;",
  "t,0,1,2;",
  "v,31,10,1.0,0.82,0.0;",
  "v,10,52,1.0,0.82,0.0;",
  "v,52,52,1.0,0.82,0.0;",
  "t,3,4,5;",
  "v,31,42,1.0,1.0,1.0;",
  "v,10,52,0.85,0.85,0.85;",
  "v,52,52,0.85,0.85,0.85;",
  "t,6,7,8;",
  "v,20,38,0.0,0.0,0.0;",
  "v,17,43,0.0,0.0,0.0;",
  "v,23,43,0.0,0.0,0.0;",
  "t,9,10,11;",
  "v,38,38,0.0,0.0,0.0;",
  "v,35,43,0.0,0.0,0.0;",
  "v,41,43,0.0,0.0,0.0;",
  "t,12,13,14;",
  "v,29,40,0.2,0.1,0.0;",
  "v,15,34,0.54,0.29,0.08;",
  "v,16,31,0.54,0.29,0.08;",
  "t,15,16,17;",
  "v,33,40,0.2,0.1,0.0;",
  "v,46,34,0.54,0.29,0.08;",
  "v,44,31,0.54,0.29,0.08;",
  "t,18,19,20;",
  "v,29,48,0.9,0.35,0.0;",
  "v,21,44,0.9,0.35,0.0;",
  "v,35,44,0.9,0.35,0.0;",
  "t,21,22,23;",
  "v,29,40,1.0,0.45,0.0;",
  "v,18,44,1.0,0.45,0.0;",
  "v,35,44,1.0,0.45,0.0;",
  "t,24,25,26;",
  "v,31,8,0.0,0.0,0.0;",
  "v,38,5,0.0,0.0,0.0;",
  "l,27,28;",
  "v,36,8,0.0,0.0,0.0;",
  "l,27,29;",
  "v,33,4,0.0,0.0,0.0;",
  "l,27,30;",
  "v,37,12,0.0,0.0,0.0;",
  "l,27,31;",
  "v,54,52,0.0,0.0,0.0;",
  "v,60,50,0.0,0.0,0.0;",
  "l,32,33;",
  "v,58,48,0.0,0.0,0.0;",
  "l,32,34;",
  "v,57,46,0.0,0.0,0.0;",
  "l,32,35;",
  "v,56,45,0.0,0.0,0.0;",
  "l,32,36;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
