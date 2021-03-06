import React                  from 'react';
import Modal				  from 'react-modal'
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import {Link}                 from 'react-router';
import actionCreators         from 'actions';
import {divStyle, center, 
      flatButton, outline}             from 'styles';
import * as R                 from 'ramda';
import * as l                 from 'lodash-fp';
import {compose, curry, map, 
        get, trace}           from 'core';

import {pushState} from 'redux-router';







// const makeStanza = (lineArray) => {
//   return {
//     lines: R.range(0, lineArray.length),
//     visible: [],
//     choices: l.shuffle(lineArray),
//     correctAnswer: 0
//   }
// }




const mapStateToProps = (state) => ({
  counter : state.counter,
  poemlist : state.poemlist,
  poem : state.poem,
  routerState : state.router,
  stanza : state.poem.activateStanza
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    maxHeight             : '80%',
    width                 : '80%',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow              : 'scroll'
  }
};


//{{width: "80%", marginRight: 'auto', marginLeft: 'auto'}}


const renderChoices = (choices, correctAnswer, inc) => {
            return(<div style={center}>
                  {map(choice(correctAnswer, inc), l.shuffle(choices))}
                </div>
           )};



const choice = curry((correctAnswer, inc, c) => {
  return <div>
      <a
      key={c.index} 
      style={{padding: '2%', margin: '2%', cursor: 'pointer'}}
      onClick={() => check(c.order, correctAnswer, inc)}>
        {c.text}
      </a>
      </div>
    });


const check = (submission, answer, inc) => {
  if (submission == answer) {
    inc(); 
  }
  else
    console.log('failure');
}


const  updateStanza = (stanzaState) => {
    newVal = R.add(1, state.correctAnswer);
    //todo --> if newVal = lines.length do something
    return R.merge(state, {
      correctAnswer: newVal,
      visibleStanzas: filter(compose(lt(newVal), prop('order')))(state.choices),
      choices: l.shuffle(filter(compose(gte(newVal), prop('order')))(state.choices))
      })

  }




const lines = l => {
          return <div key={l.order}>{l.text}</div>
        };



class Line extends React.Component {

  componentWillMount(){
    this.props.actions.activateStanza(this.props.params.line); 

  }

  componentWillUnmount(){
    this.props.actions.deactivateStanza()
  }




		render(){
      let stanza = this.props.poem.activeStanza;
			let inc = () => this.props.actions.updateStanza();
      //this.props.actions.log('failure');

			let stanzaLines = stanza.visible;
			let choices = stanza.choices;
			let correctAnswer = stanza.correctAnswer;


      return(<Modal
			  isOpen={true}
			  onRequestClose={() => document.getElementById('exit').click()}
			  style={customStyles}
			  closeTimeoutMS={50}
			  >
        <div style={center}>
          <div style={R.merge({}, {float:'right', display:'inline', marginTop: -30, marginLeft:-30, marginRight: -5,  width:30})}>
  			     <Link id="exit" to={`/poems/${this.props.params.title}`}><button>x</button></Link>
          </div>
          <h3>Stanza {R.add(1, parseInt(this.props.params.line))}</h3>
          <div>

  			     {map(lines, stanzaLines)}
            <h4>Choose the Next Line</h4>
  			    {(choices.length > 0)? renderChoices(choices, correctAnswer, inc): 
              ""
              //<button onClick={() => this.props.actions.activateStanza(parseInt(this.props.params.line) + 1)}>Next</button>
            }
          </div>
        </div>
			</Modal>
      )}
  };

export default connect(mapStateToProps, mapDispatchToProps)(Line);
