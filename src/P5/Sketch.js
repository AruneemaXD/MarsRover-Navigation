import React from 'react'
import p5 from 'p5'
import List from '../List'
import './Sketch.css';


// Thanks to Daniel Shiffman of http://codingtra.in

class Sketch extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {

      startx: 0,
      starty: 0,
      endx: 44,
      endy: 29,
      clear_obs: false,
      clear_path: false,
      selected_algo: "Z",
      selected_heu: -1,
      algoinput: false,

    };

  }
  changeinco = (bool) => {
    this.setState({
      clear_obs: bool
    });
  }

  changeincp = (bool) => {
    this.setState({
      clear_path: bool
    });
  }

  changeina = (algo, heu, bool) => {
    this.setState({
      selected_algo: algo,
      selected_heu: heu,
      algoinput: bool
    });
  }

  SketchA = (p) => {

    // An educated guess of how far it is between two points
    p.heuristic = (a, b) => {
      var d;


      if (this.state.selected_heu == 0)
        d = p.dist(a.i, a.j, b.i, b.j);
      if (this.state.selected_heu == 1)
        d = p.abs(a.i - b.i) + p.abs(a.j - b.j);
      if (this.state.selected_heu == 2) {
        var F = Math.SQRT2 - 1;
        d = (p.abs(a.i - b.i) < p.abs(a.j - b.j)) ? F * p.abs(a.i - b.i) + p.abs(a.j - b.j) : F * p.abs(a.j - b.j) + p.abs(a.i - b.i);
      }

      if (this.state.selected_heu == 3)
        d = Math.max(p.abs(a.i - b.i), p.abs(a.j - b.j));

      if (this.state.selected_algo == 'B')
        d = d * 1000000;

      if (this.state.selected_algo == 'D')
        d = 0;


      return d;
    }

    p.aStar = () => {

      // Best next option

      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      current = openSet[winner];

      // Did I finish?
      if (current === end) {
        console.log('Sol')
        done = true;


      }

      // Best option moves from openSet to closedSet
      openSet.splice(winner, 1);
      closedSet.push(current);

      // Check all the neighbors
      var neighborlist = current.neighbors4sides;
      if (this.state.selected_heu != 1)
        neighborlist = current.neighbors4sides.concat(current.neighbors4corners);
      for (var i = 0; i < neighborlist.length; i++) {
        var neighbor = neighborlist[i];

        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + p.heuristic(neighbor, current);

          // Is this a better path than before?
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          // Yes, it's a better path
          if (newPath) {
            neighbor.h = p.heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
      // Uh oh, no solution


      // Find the path by working backwards shifted in algo
      path = [];
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }

      // Drawing path as continuous line

    }


    class Spot {
      constructor(i, j) {
        // Location
        this.i = i;
        this.j = j;

        // f, g, and h values for A*
        this.f = 0;
        this.g = 0;
        this.h = 0;

        // Neighbors
        this.neighbors4sides = [];
        this.neighbors4corners = [];

        // Where did I come from?
        this.previous = undefined;

        // Am I a wall?
        this.wall = false;
        this.start = false
        this.end = false;
        this.stop = false;

        // Display me
        this.show = function (col) {


          if (this.stop || this.start || this.end) {
            p.fill(p.color(255, 199, 199));
            p.noStroke();
            p.rect(this.i * w, this.j * h, w, h);
          } else {
            if (this.wall) {
              p.fill(0);
              p.noStroke();
              p.ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
              //p.rect(this.i * w, this.j * h, w, h);
            } else if (col) {
              p.fill(col);
              p.noStroke();
              p.rect(this.i * w, this.j * h, w, h);
            }
          }

        };

        // Figure out who my neighbors are
        this.addNeighbors = function (grid) {
          var i = this.i;
          var j = this.j;
          if (i < cols - 1) {
            this.neighbors4sides.push(grid[i + 1][j]);
          }
          if (i > 0) {
            this.neighbors4sides.push(grid[i - 1][j]);
          }
          if (j < rows - 1) {
            this.neighbors4sides.push(grid[i][j + 1]);
          }
          if (j > 0) {
            this.neighbors4sides.push(grid[i][j - 1]);
          }
          if (i > 0 && j > 0) {
            this.neighbors4corners.push(grid[i - 1][j - 1]);
          }
          if (i < cols - 1 && j > 0) {
            this.neighbors4corners.push(grid[i + 1][j - 1]);
          }
          if (i > 0 && j < rows - 1) {
            this.neighbors4corners.push(grid[i - 1][j + 1]);
          }
          if (i < cols - 1 && j < rows - 1) {
            this.neighbors4corners.push(grid[i + 1][j + 1]);
          }
        };


      }
    }

    // How many columns and rows?
    var cols = 45;
    var rows = 30;

    // This will be the 2D array
    var grid = new Array(cols);

    // Open and closed set
    var openSet = [];
    var closedSet = [];
    var current;
    var stops = [];


    // Start and end
    var start;
    var sx = 0,
      sy = 0;
    var ex = cols - 1;
    var ey = rows - 1;
    var end;

    p.sx = sx;
    p.sy = sy;

    // Width and height of each cell of grid
    var w, h;

    // The road taken
    var path = [];
    var done = false;


    var draw = 0;


    p.mouseDragged = () => {
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var disx = p.abs(p.mouseX - (i * w + w / 2));
          var disy = p.abs(p.mouseY - (j * h + h / 2));
          if (disx < w / 2 && disy < h / 2) {

            grid[i][j].wall = true
          };
        }
      }
    }
    window.oncontextmenu = function () {
      return false;
    }
    p.mousePressed = () => {

      if (p.mouseButton === p.RIGHT) {
        for (var j = 0; j < rows; j++) {
          for (var i = 0; i < cols; i++) {
            var disx = p.abs(p.mouseX - (i * w + w / 2));
            var disy = p.abs(p.mouseY - (j * h + h / 2));
            if (disx < w / 2 && disy < w / 2) {
              if (grid[i][j].wall)
                return;
              if (grid[i][j].stop)
                stops = stops.filter(item => item !== grid[i][j]);
              else
                stops.push(grid[i][j]);
              grid[i][j].stop = !grid[i][j].stop;
            }
          }
        }
      } else {
        for (var j = 0; j < rows; j++) {
          for (var i = 0; i < cols; i++) {
            var disx = p.abs(p.mouseX - (i * w + w / 2));
            var disy = p.abs(p.mouseY - (j * h + h / 2));
            if (disx < w / 2 && disy < w / 2) {
              if (grid[i][j].stop)
                return;

              grid[i][j].wall = !grid[i][j].wall;
            }
          }
        }
      }
    }


    p.setStartandEnd = () => {
      // Start and end

      start = grid[p.sx][p.sy];
      end = grid[this.state.endx][this.state.endy];
      start.wall = false;
      end.wall = false;
      start.start = true;
      end.end = true;

      // openSet starts with beginning only
      openSet.push(start);
    }

    p.showgrid = () => {
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j].show();
        }
      }
    }

    p.clearobs = () => {
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j].wall = false;
        }
      }
    }

    p.clearpath = () => {
      openSet.splice(0, openSet.length);
      closedSet.splice(0, closedSet.length);
      path.splice(0, path.length);
      p.setStartandEnd();
      done = false;
      this.state.algoinput = false;
    }

    p.showsets = () => {
      for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(p.color(127, 219, 218, 80));
      }

      for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(p.color(0, 255, 0, 80));
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowHeight * 1.5, p.windowHeight);
      console.log('A*');
      // Grid cell size
      w = p.width / cols;
      h = p.height / rows;

      // Making a 2D array
      for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
      }

      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j] = new Spot(i, j);
        }
      }

      // All the neighbors
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid[i][j].addNeighbors(grid);
        }
      }

      p.setStartandEnd();
    }


    p.draw = () => {

      p.background(255);
      //Check if URL param level0 and level 1 are set
      //If those are null then altern( elect algo and return;)

      console.log(draw++)


      // Am I still searching?

      if (this.state.selected_algo == 'A' || this.state.selected_algo == 'B' || this.state.selected_algo == 'D') {
        if (openSet.length > 0 && this.state.algoinput == true)
          if (!done) {
            p.aStar()
          }
        else {

          //p.noLoop();
          done = true;
          console.log('NO PATH!');
          //return;

        }
      }


      // Draw current state of everything

      // Draw white box or obstacles
      p.showgrid();

      if (this.state.clear_obs) {
        p.clearobs();
        p.clearpath();
        this.setState({
          clear_obs: false
        });
      }

      if (this.state.clear_path) {
        p.clearpath();
        this.setState({
          clear_path: false
        });
      }


      // Draw pink & green sets
      p.showsets();

      // Find the path by working backwards shifted in algo

      // Drawing path as continuous line
      p.noFill();
      p.stroke(p.color(86, 35, 73));
      p.strokeWeight(w / 3);
      p.beginShape();
      for (var i = 0; i < path.length; i++) {
        p.vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
      }
      p.endShape();


    }
  }

  componentDidMount() {
    //We create a new p5 object on component mount, feed it
    this.myP5 = new p5(this.SketchA, this.myRef.current);
  }

  render() {
    this.inputRef = React.createRef();
    return (
      //This div will contain our p5 sketch
      <div className = "Sketch">
      <div ref = {this.myRef}> </div> 
      <div> <List onChangeInput = {this.changeina} onClearObs = {this.changeinco} onClearPath = {this.changeincp}/> </div>
      </div>
    )
  }
}


export default Sketch