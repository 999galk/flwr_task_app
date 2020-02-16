import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceReco from '../components/FaceReco/FaceReco';
import './App.css';

console.log('path at app:', process.env.PATH);
const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
	input : '',
	imgUrl : '',
	box : {}
}
class App extends Component {
	constructor(){
		super()
		this.state = initialState;
	}

	calFaceLocation = (data) => {
		const face = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImg');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
	      leftCol: face.left_col * width,
	      topRow: face.top_row * height,
	      rightCol: width - (face.right_col * width),
	      bottomRow: height - (face.bottom_row * height)
	    }
	}

	displayFaceBox = (box) => {
		this.setState({box : box});
	}

	onInputChange = (event) => {
		console.log('img url for input:', event.target.value);
		this.setState({input : event.target.value});
	}

	onButtonSubmit = () => {
    	this.setState({imgUrl: this.state.input});
    	fetch('https://blooming-scrubland-26588.herokuapp.com/image', {
	        method: 'POST',
	        headers: {'Content-Type': 'application/json'},
	        body: JSON.stringify({
	          input : this.state.input
	        })
	     }).then(response => response.json())
    		.then(data => {
	        	console.log('data back from server:', data);
	          	this.displayFaceBox(this.calFaceLocation(data))
	        })
  	}

  componentDidMount() {
  	//general fetch to wake up the server cause heroku is crup
		//fetch('https://blooming-scrubland-26588.herokuapp.com/');
  }

	render(){
		const { imgUrl,box } = this.state;
	  return (
		    <div className="App">
		    	<Particles className='particles'
          		params={particlesOptions}
        		/>
		    	<div className='mt4'>
		      	<Logo />
		      	<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
		   		<FaceReco imgUrl={imgUrl} box={box}/>
		   		</div>
		    </div>
	  );
	}
}

export default App;
