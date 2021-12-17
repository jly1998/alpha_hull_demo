import React, { Component } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import Delaunator from 'delaunator';
import * as Math from "mathjs"

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points:[],
      DTedges:[],
      mouseOn: -1
    }
  }
  
  delaunay;
  nextHalfedge = (e) => { 
    return (e % 3 === 2) ? e - 2 : e + 1; 
  }
  prevHalfedge = (e) => { 
    return (e % 3 === 0 ) ? e + 2 : e - 1 ; 
  }

  distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1[0]-p2[0], 2)+Math.pow(p1[1]-p2[1], 2));
  }

  findCenter = (p1, p2, p3, p4 = false) => {
    
    var a;
    a = (p2[1] - p1[1]) / (p2[0] - p1[0]);

    var xMiddle = (p1[0] + p2[0]) / 2;
    var yMiddle = (p1[1] + p2[1]) / 2;
    

    var c, O3X, O3Y;

    if (a !== 0) {
      c = yMiddle - (-1 / a) * xMiddle;
      O3X = (Math.pow(p1[0], 2) + Math.pow(p1[1], 2) - Math.pow(p3[0], 2) - Math.pow(p3[1], 2) - 2 * c * p1[1] + 2 * c * p3[1]) / (2 * ((p1[0] - p3[0]) - (1 / a) * (p1[1] - p3[1])));
      O3Y = (-1 / a) * O3X + c;
    } else {
      O3X = c = xMiddle;
      O3Y = (Math.pow(p1[0], 2) + Math.pow(p1[1], 2) - Math.pow(p3[0], 2) - Math.pow(p3[1], 2) + 2 * O3X * (p3[0] - p1[0])) / (2 * (p1[1] - p3[1]));
    }
    
    if(p4){
      var O4X, O4Y;
      if (a !== 0) {
        c = yMiddle - (-1 / a) * xMiddle;
        O4X = (Math.pow(p1[0], 2) + Math.pow(p1[1], 2) - Math.pow(p4[0], 2) - Math.pow(p4[1], 2) - 2 * c * p1[1] + 2 * c * p4[1]) / (2 * ((p1[0] - p4[0]) - (1 / a) * (p1[1] - p4[1])));
        O4Y = (-1 / a) * O4X + c;
      } else {
        O4X = c = xMiddle;
        O4Y = (Math.pow(p1[0], 2) + Math.pow(p1[1], 2) - Math.pow(p4[0], 2) - Math.pow(p4[1], 2) + 2 * O4X * (p4[0] - p1[0])) / (2 * (p1[1] - p4[1]));
      }
      return {
        O3: [O3X, O3Y],
        O4: [O4X, O4Y]
      };
    } else {
      return {
        O3: [O3X, O3Y]
      };
    }

  }

  calculateMinMax = (e, e_opposite) => {
    //start p & end p
    var p1 = this.state.points[this.delaunay.triangles[e]];
    var p2 = this.state.points[this.delaunay.triangles[this.nextHalfedge(e)]];

    var disE = this.distance(p1,p2);
    var minR, maxR, minO, maxO;
    var O3,O4;
    
    // another half edge exist -> not on convex hull
    if ( e_opposite !== -1 ){
      var q3 = this.state.points[this.delaunay.triangles[this.prevHalfedge(e)]];
      var q4 = this.state.points[this.delaunay.triangles[this.prevHalfedge(e_opposite)]];

      var Cres = this.findCenter(p1, p2, q3, q4);
      O3 = Cres.O3;
      O4 = Cres.O4;
      var R3 = this.distance(p1,O3);
      var R4 = this.distance(p1,O4);
      //q3 obtuse angle
      if (Math.pow(this.distance(p1,q3), 2) + Math.pow(this.distance(p2,q3), 2) < Math.pow(disE, 2)){
        minR = R3;
        minO = O3;
        maxR = R4;
        maxO = O4;
      } else if (Math.pow(this.distance(p1,q4), 2) + Math.pow(this.distance(p2,q4), 2) < Math.pow(disE, 2)){  //q4 obtuse angle
        minR = R4;
        minO = O4;
        maxR = R3;
        maxO = O3;
      } else {
        minR = disE / 2;
        minO = [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2];
        if (R3>R4){
          maxR = R3;
          maxO = O3;
        } else {
          maxR = R4;
          maxO = O4;
        }
      }


    } else {
      // alpha max = infinity
      maxR = Number.MAX_SAFE_INTEGER; 
      maxO = false;

      var q = this.state.points[this.delaunay.triangles[this.prevHalfedge(e)]];
      O3 = this.findCenter(p1, p2, q).O3;
      
      //obtuse angle
      if(Math.pow(this.distance(p1,q), 2) + Math.pow(this.distance(p2,q), 2) < Math.pow(disE, 2)){
        minR = this.distance(p1,O3);
        minO = O3;
      } else {
        minR = disE / 2;
        minO = [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2];
      }

    }

    return {
      p1: p1,
      p2: p2,
      minR: minR, 
      minO: minO,
      maxR: maxR,
      maxO: maxO
    }
  }

  updateDelaunay = () => {
    if(this.state.points.length >= 3){
      this.delaunay = Delaunator.from(this.state.points);

      var newDT=[], curE;
      for (let e = 0; e < this.delaunay.triangles.length; e++) {
        var e_opposite = this.delaunay.halfedges[e];
        if (e > e_opposite) {
          curE = this.calculateMinMax(e, e_opposite);
          newDT.push(curE);
        }
      }
      this.setState({ DTedges: newDT },() => {
        // console.log("=====DT=====");
        // console.log(this.state.DTedges);
      });
    }
  }

  onClick = (e) => {
    this.setState({
      points: [...this.state.points,[e.evt.offsetX, e.evt.offsetY]]
    },() => {
      // console.log(this.state.points);
      this.updateDelaunay();
    });
  }

  render() {
    return (
      <Stage width={window.innerWidth*0.6} height={window.innerHeight}
        onClick={(event)=>this.onClick(event)}  
      >
          <Layer visible={this.props.DTVisible}>
            {this.state.DTedges.map((edge, i) => (
              <Line
                key={i}
                name={String(i)}
                points={[edge.p1[0], edge.p1[1], edge.p2[0], edge.p2[1]]}
                stroke='blue'
                strokeWidth={2}
                onmouseover={e => {
                  this.setState({ mouseOn: Number(e.target.attrs.name) });
                }}
                onmouseout={e=>{
                  this.setState({ mouseOn: -1 });
                }}
              />
            ))}
          </Layer>
          <Layer>
          {this.state.DTedges.map((edge, i) => (
            <Circle 
              key={i}
              x={edge.minO[0]} y={edge.minO[1]} radius={edge.minR} 
              stroke='orange' 
              strokeWidth={1} 
              visible={this.props.minVisible || this.state.mouseOn === i}
            />
          ))}
        </Layer>
        <Layer>
          {this.state.DTedges.map((edge, i) => {
            if (edge.maxO) {
              return (<Circle 
                key={i}
                x={edge.maxO[0]} y={edge.maxO[1]} radius={edge.maxR} 
                stroke='green' 
                strokeWidth={1}
                visible={this.props.maxVisible || this.state.mouseOn === i}
              />);
            } else {
              return(<></>);
            }
            
          })}
        </Layer>
        <Layer>
          {this.state.DTedges.map((edge, i) => {
            if (edge.minR <= this.props.alpha && this.props.alpha <= edge.maxR){
              return(<Line
                key={i}
                name={String(i)}
                points={[edge.p1[0], edge.p1[1], edge.p2[0], edge.p2[1]]}
                stroke='red'
                strokeWidth={3}
                onmouseover={e => {
                  this.setState({ mouseOn: Number(e.target.attrs.name) });
                }}
                onmouseout={e=>{
                  this.setState({ mouseOn: -1 });
                }}
              />);
            } else {
              return(<></>);
            }
          })}
        </Layer>
        <Layer>
          {this.state.points.map((point, i) => (    
            <Circle 
              key={i}
              x={point[0]} y={point[1]} radius={5} 
              draggable
              fill='black'
              onDragMove={e => {
                var curP = [e.evt.offsetX,e.evt.offsetY];
                this.setState({
                  points: this.state.points.map((item, _index) => _index === i ? curP : item)
                },() => {
                  this.updateDelaunay();
                });
              
              }}
              onDragEnd={e => {
                var newP = [e.target.x(), e.target.y()];
                this.setState({
                  points: this.state.points.map((item, _index) => _index === i ? newP : item)
                },() => {
                  this.updateDelaunay();
                });
              
              }}
            />
          ))}
          </Layer>
      </Stage>
    )
  };
}

export default Demo;
