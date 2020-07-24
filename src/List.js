import React from 'react';
import './List.css';




class List extends React.Component {
    constructor(props) {
        super(props);
        this.displayRadioValue = this.displayRadioValue.bind(this);
        this.clearObs = this.clearObs.bind(this);
        this.clearPath = this.clearPath.bind(this);
     }

clearObs() {
    this.props.onClearObs(true);
}

clearPath() {
    this.props.onClearPath(true);
}

displayRadioValue() { 
             
            var ele = document.getElementsByName('level1'); 
              
            for(var i = 0; i < ele.length; i++) { 
                  
                if(ele[i].checked) { 
                        
                        this.props.onChangeInput(ele[i].value[0],ele[i].value[1],true);
                        //alert("You Selected" + ele[i].value[0] + ele[i].value[1]);
                } 
            } 
        } 
  render() 
    {
  return ( 
    <form className='Form' id="algo_form" >
    <div id='buttons'>
        <div>
            <input type="radio" name="level0" value="A" id="A"/>
            <label htmlFor="A">A* Algo</label>
            <div className="sub1">
                <div>
                    <input type="radio" name="level1" value="A0" id="A0"/>
                    <label for="A0">Euclidean</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="A1" id="A1"/>
                    <label for="A1">Manhattan</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="A2" id="A2"/>
                    <label for="A2">Octile</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="A3" id="A3"/>
                    <label for="A3">Chebyshev</label>
                </div>
            </div>
        </div>
        <div>
            <input type="radio" name="level0" value="B" id="B"/>
            <label for="B">Best First Search</label>
            <div className="sub1">
                <div>
                    <input type="radio" name="level1" value="B0" id="B0"/>
                    <label for="B0">Euclidean</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="B1" id="B1"/>
                    <label for="B1">Manhattan</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="B2" id="B2"/>
                    <label for="B2">Octile</label>
                </div>
                <div>
                    <input type="radio" name="level1" value="B3" id="B3"/>
                    <label for="B3">Chebyshev</label>
                </div>
            </div>
        </div>
        
        <div>
            <input type="radio" name="level1" value="D0" id="D"/>
            <label for="D">Dijkstra</label>
        </div> 
    </div>
    <button type="button" onClick={this.displayRadioValue}> Find Path </button>
    <button type="button" onClick={this.clearPath}> Clear Path </button>
    <button type="button" onClick={this.clearObs}> Clear All</button>
    </form>
        );
    }
}


export default List;


