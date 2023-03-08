
let img;
let lt1 ;
let lt2 ;
let lerptime = 23500;
let initTime= 0 ;

let sketch = function(pp) {
    mouseClicked = function() {
        ResetPendulums();
        initTime = pp.millis();
    }
pp.setup = function()  {
        var canvas = pp.createCanvas(640,360); //make it an object
        canvas.parent('holder0');
        canvas.mouseClicked(mouseClicked)
        //   img = createImg('https://saiyeswanth.me/wp-content/uploads/2022/09/pendulum.png');
        var width = pp.width
        var x = width/3.5 ;
        lt1 = 0.5*width;
        lt2 = width*0.9;
        // Make a new Pendulum with an origin position and armlength
        P = new Pendulum(pp.createVector(x,0),200,'rgb(101,168,196)');
        Q = new Pendulum(pp.createVector(x,0),175,'rgb(140,101,211)');
        R = new Pendulum(pp.createVector(x,0),150,'rgb(200,20,20)');
        S = new Pendulum(pp.createVector(x,0),100,'rgb(115,235,174)');
        T = new Pendulum(pp.createVector(x,0),225,'rgb(235,235,174)');
        U = new Pendulum(pp.createVector(x,0),250,'rgb(115,115,174)');

    }
    
    function ResetPendulums(){
        P.reset();
        Q.reset();
        R.reset();
        S.reset();
        T.reset();
        U.reset();
    }

    pp.draw = function() {
        pp.background(51);
        //   image(img,0,0,640,360);
        pp.fill(51);
        pp.noStroke();
        f = pp.constrain((pp.millis()-initTime)/lerptime,0,1)
        pp.rect(0,0,lt2-f*(lt2-lt1),360);
        P.go();
        Q.go();
        R.go();
        S.go();
        T.go();
        U.go();
    }


function Pendulum(origin_, r_,colr) {
    // Fill all variables
    this.origin = origin_.copy();
    this.position = pp.createVector();
    this.r = r_;
    this.angle =pp.PI/4;
    this.c = colr
  
    this.aVelocity = 0.0;
    this.aAcceleration = 0.0;
    this.damping = 0.995;   // Arbitrary damping
    this.ballr = 10;      // Arbitrary ball radius
    this.dataPoints = []
    for (let i = 0; i < 300; i++) {
      this.dataPoints[i] = 0
    }
  
    this.init_origin = origin_.copy();
    this.init_position = pp.createVector();
    this.init_r = r_;
    this.init_angle = pp.PI/4;
    this.init_c = colr
  
    this.init_aVelocity = 0.0;
    this.init_aAcceleration = 0.0;
    this.init_damping = 0.995;
    this.init_ballr = 10;
  
    this.go = function() {
      this.update();
      this.display();
    };
  
    this.reset = function(){
      this.origin = this.init_origin;
      this.position = this.init_position;
      this.r = this.init_r;
      this.angle = this.init_angle;
      this.c = this.init_c;
  
      this.aVelocity = this.init_aVelocity;
      this.aAcceleration = this.init_aAcceleration;
      this.damping = this.init_damping;   // Arbitrary damping
      this.ballr = this.init_ballr;
      this.timer = 0 ;
      for (let i = 0; i < this.dataPoints.length ; i++) {
          this.dataPoints[i] = 0
        }
    }
  
  
    // Function to update position
    this.update = function() {
      var gravity = 0.4;                                               // Arbitrary constant
      this.aAcceleration = (-1 * gravity / this.r) * pp.sin(this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
      this.aVelocity += this.aAcceleration;                            // Increment velocity
      this.aVelocity *= this.damping;                                  // Arbitrary damping
      this.angle += this.aVelocity;
  
                                         // Increment angle
  
  
    };
  
    this.display = function() {
      this.position.set(this.r*pp.sin(this.angle), this.r*pp.cos(this.angle), 0);         // Polar to cartesian conversion
      this.position.add(this.origin);                                               // Make sure the position is relative to the pendulum's origin
      pp.stroke(this.c);
      pp.strokeWeight(1);
      // Draw the arm
  
      pp.line(this.origin.x, this.origin.y, this.position.x, this.position.y);
  
      pp.line(this.origin.x, this.r, this.position.x, this.r);
      pp.ellipseMode(pp.CENTER);
      pp.fill(this.c);
      // Draw the ball
      pp.ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
      pp.stroke(255);
      pp.ellipse(this.position.x, this.r, 5, 5)
      f = pp.constrain((pp.millis()-initTime)/lerptime,0,1)
      penx = lt2-f*(lt2-lt1)
      pp.stroke(255);
  
      pp.ellipse(penx, -(this.position.x-this.origin.x) + pp.height/2, 5, 5)
      // console.log(this.dataPoints.length)
      for(let i = this.dataPoints.length -1  ; i > 0 ; i--){
        this.dataPoints[i] = this.dataPoints[i-1];
      }
      this.dataPoints[0] = -(this.position.x-this.origin.x);
      if ( this.dataPoints.length > 300 ){
        newDataPoints = Array.from(this.dataPoints)

        temp = []
        for(let k = 0 ; k < this.dataPoints.length ; k += 2){
            temp[k/2] = newDataPoints[k];
        }
        this.dataPoints = Array.from(temp);
      }

    // for (let i = 0; i < this.dataPoints.length-1 ; i++) {
    //     //console.log(this.dataPoints.length);
    //     y1 = this.dataPoints[i] + height/2 ;
    //     x1 = lt1 + (i / this.dataPoints.length)*(lt2-lt1);
    //     y2 = this.dataPoints[i+1] + height/2 ;
    //     x2 = lt1 + ((i+1) / this.dataPoints.length)*(lt2-lt1);
    //     stroke(this.c);
    //     line(x1,y1,x2,y2);
    //     //ellipse(x1,y1,1,1);

    //   }


      for (let i = 0; i < this.dataPoints.length-1 ; i++) {
        //console.log(this.dataPoints.length);
        y1 = this.dataPoints[i] + pp.height/2 ;
        x1 = lt1 + (i / this.dataPoints.length)*(lt2-lt1);
        y2 = this.dataPoints[i+1] + pp.height/2 ;
        x2 = lt1 + ((i+1) / this.dataPoints.length)*(lt2-lt1);
        pp.stroke(this.c);
        pp.line(x1,y1,x2,y2);
        // console.log(x1,y1,x2,y2);
        // pp.ellipse(x1,y1,1,1);
      
      }
      // console.log(this.dataPoints.length)
    };
  }
};

let myp5 = new p5(sketch);