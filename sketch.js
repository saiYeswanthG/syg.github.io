  

let sketch2 = function(pp){
  var p;
  let sk;
  let sd;
  let sp;
  let sgs;

  let shouldDraw ;

  pp.setup = function()  {
    var canvas = pp.createCanvas(640,360); //make it an object
    canvas.parent('holder');
    pp.background(51);
    var x = pp.width/3.5 ;
    shouldDraw = true ;
    // Make a new Pendulum with an origin position and armlength
    A = new Axes2D(pp.createVector(pp.width/6.5,pp.height/2));
    
    pp.textSize(18); 
    pp.fill(255);
    
    sk = createCSlider(1, 30 ,5);
    sk.position(10, 30);
    // sk.style('pp.width', '80px');
    sgs = createCSlider(0, 170, 100);
    sgs.position(10, 80);
    // sgs.style('pp.width', '80px');
    sd = createCSlider(0,1,0.995,0.01);
    sd.position(10, 130);
    // sd.style('pp.width', '80px');
    
    // sk.input(enableDraw);
    // sgs.input(enableDraw);
    // sd.input(enableDraw);
    A.go();
    
  }

  function enableDraw(){
    shouldDraw = true ;
    pp.background(51);
  }

  function ResetAxes(){
    A.reset();
  }

  pp.draw = function() {
  
    sk.update();
    sgs.update();
    sd.update();
    
    

    if (sk.locked || sgs.locked || sd.locked) {
      pp.background(51);
      pp.fill(255);
      A.go();
      sk.display();
      sgs.display();
      sd.display();
      
    }
    
    shouldDraw = false ;
  }



  function Axes2D(offset) {
    // Fill all variables
    this.offset = offset
    
    this.go = function() {
      this.update();
      this.display();
    };

    this.reset = function(){
    }

    
    // Function to update position
    this.update = function() {
      
    };

    this.display = function() {
      var k = sk.value() ;
      var p = 0 ;
      var d = sd.value();
      var gridScale = sgs.value() ;
      ox = this.offset.x ;
      oy = this.offset.y ;
      xx = ox
      xy = pp.height - oy 
      pp.stroke(255);
      pp.line(0,pp.height-oy,pp.width,pp.height-oy);
      pp.line(ox,0,ox,pp.height)
      prevx = ox ;
      prevy = pp.height - oy ;
      
      for(let i = 0 ; i < pp.width - ox ; i ++ ){
        fx = i ;
        //
        fy =  pp.exp(-d*fx/gridScale)*pp.sin(fx/k+p)*gridScale ;
        px = ox + fx ;
        py = pp.height- (oy + fy ) ;
        pey = pp.height- (oy + pp.exp(-d*fx/gridScale)*gridScale)

        //console.log(oy);
        
        pp.fill(255);
        //ellipse(px,py,2,2);
        pp.stroke('rgb(0,255,0)');
        pp.ellipse(px,pey,1,1);
        pp.stroke(255);
        pp.line(prevx,prevy,px,py);
        pp.text('time', 10, 10, 10, 30);
        pp.text('scale', 10, 60, 10, 30);
        pp.text('damping', 10, 110, 10, 30);
        prevx = px ;
        prevy = py ;

      }
    };
  }
  function createCSlider(a, b, c, d) {
    r = new CSlider(a, b, c, d);
    return r;
  }

  class CSlider {
    constructor(min, max, value = (min + max) / 2, step = 1) {
      this.width = 75;
      this.height = 15;
      let widthtoheight = this.width - this.height;
      this.ratio = this.width / widthtoheight;
      this.x = 10;
      this.y = -1000;
      this.spos = this.x + this.width / 2 - this.height / 2;
      this.newspos = this.spos;
      this.sposMin = this.x;
      this.sposMax = this.x + this.width - this.height;
      this.vmin = min;
      this.vmax = max;
      this.svalue = pp.constrain(value, this.vmin, this.vmax);
      this.vstep = step;
      this.loose = 1;
      this.over = false;
      this.locked = false;
      this.scale = 1;
    }

    update() {
      if (this.overEvent()) {
        this.over = true;
      } else {
        this.over = false;
      }
      if (pp.mouseIsPressed && this.over) {
        this.locked = true;
      }
      if (!pp.mouseIsPressed) {
        this.locked = false;
      }
      if (this.locked) {
        this.newspos = pp.constrain(pp.mouseX / this.scale - this.height / 2, this.sposMin, this.sposMax);
        this.svalue = this.vmin + (this.vmax - this.vmin) * ((this.newspos - this.sposMin) / (this.sposMax - this.sposMin));
        if (this.vstep > 0) {
          this.svalue = pp.constrain(this.vmin + pp.round((this.svalue - this.vmin) / this.vstep) * this.vstep, this.vmin, this.vmax);
        }
        this.newspos = this.x + (this.width - this.height) * ((this.svalue - this.vmin) / (this.vmax - this.vmin));
      }
      if (pp.abs(this.newspos - this.spos) > 1) {
        this.spos = this.spos + (this.newspos - this.spos) / this.loose;
      }
    }

    overEvent() {
      if (pp.mouseX / this.scale > this.x && pp.mouseX / this.scale < this.x + this.width &&
        pp.mouseY / this.scale > this.y && pp.mouseY / this.scale < this.y + this.height) {
        return true;
      } else {
        return false;
      }
    }

    display() {
      pp.noStroke();
      pp.fill(204);
      pp.rect(this.x, this.y, this.width, this.height);
      if (this.over || this.locked) {
        pp.fill(0, 0, 0);
      } else {
        pp.fill(102, 102, 102);
      }
      pp.rect(this.spos, this.y, this.height, this.height);
    }

    getPos() {
      // Convert spos to be values between
      // 0 and the total width of the scrollbar
      return this.spos * this.ratio;
    }

    value() {
      return this.svalue;
    }

    setScale(sc) {
      this.scale = sc;
    }

    position(xp, yp) {
      this.x = xp;
      this.y = yp;
      if (this.vstep > 0) {
        this.svalue = pp.constrain(this.vmin + pp.round((this.svalue - this.vmin) / this.vstep) * this.vstep, this.vmin, this.vmax);
      }
      this.spos = this.x + (this.width - this.height) * ((this.svalue - this.vmin) / (this.vmax - this.vmin));
      //console.log(this.smin);
      this.newspos = this.spos;
      this.sposMin = this.x;
      this.sposMax = this.x + this.width - this.height;
      pp.push();
      this.update();
      this.display();
      pp.pop();
    }
  }
};

let myp52 = new p5(sketch2);