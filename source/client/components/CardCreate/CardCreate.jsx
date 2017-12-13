import React, {Component} from 'react'
//import { Header, Divider, Input, Form, TextArea, Button, Dropdown } from 'semantic-ui-react'
import MiniNav from '../MiniNav/MiniNav.jsx'
import styles from './CardCreate.scss'
import {withRouter} from 'react-router'

import axios from 'axios'
axios.defaults.withCredentials = true;

const config = require('../../config');
const imgur_post_path = "https://api.imgur.com/3/image";
import AWS from 'aws-sdk';
import resizeImage from 'resize-image';

const AWS_SETTINGS = config.aws;

class CardCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            tags: [],
            imageUploaded: false, 
            imageUrl: ""
        }
        this.handleOffer = this.handleOffer.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.dataURItoBlob = this.dataURItoBlob.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:3000/auth/profile').then((res) => {
            console.log(res);
            this.setState({isLoggedIn: true, username: res.data.user.username})
        }).catch((err) => {
            console.log(err);
            console.log("Not logged in");
            this.setState({isLoggedIn: false})
        });
    }

    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    handleOffer() {
        let _this = this;
        let file = document.getElementById("image-upload").files[0];

        let s3 = new AWS.S3({
            region: AWS_SETTINGS.region,            
            credentials: AWS_SETTINGS.credentials
        });

        let temp_canvas = document.getElementById("image-canvas");
        temp_canvas.toBlob(function(image_blob){
            let randomKey = String(Date.now()).concat(String(Math.floor(Math.random()*10000)));
            var params = {
                            Bucket: 'cs498rk-images', 
                            Key: randomKey, Body: image_blob, 
                        };
            s3.upload(params, function(err, data) {
                console.log(err, data);
                _this.handleSubmission(true, data.Location);
            });
        });
    }

    handleRequest() {
        let _this = this;
        let file = document.getElementById("image-upload").files[0];

        let s3 = new AWS.S3({
            region: AWS_SETTINGS.region,            
            credentials: AWS_SETTINGS.credentials
        });

        let temp_canvas = document.getElementById("image-canvas");
        temp_canvas.toBlob(function(image_blob){
            let randomKey = String(Date.now()).concat(String(Math.floor(Math.random()*10000)));
            var params = {
                            Bucket: 'cs498rk-images', 
                            Key: randomKey, Body: image_blob, 
                        };
            s3.upload(params, function(err, data) {
                console.log(err, data);
                _this.handleSubmission(false, data.Location);
            });
        });
    }

    handleSubmission(value, imgur_url) {
        let _this = this;
        axios.post(config.api_endpoint + '/api/cards', {
            title: document.getElementById('title').value,
            tags: this.state.tags,
            description: document.getElementById('description-input').value,
            image: imgur_url,
            location: document.getElementById('location-input').value,
            deadline: document.getElementById('deadline-input').value,
            offer: value,
            author: this.state.username
        }).then((res) => {
            const { history: { push } } = _this.props;
            push('/detail?id=' + res.data.data._id)
        });
    }

    removeTag(e) {
      let parent = e.target.parentNode;
      let tag = e.target.innerHTML;
      parent.removeChild(e.target);

      let index = this.state.tags.indexOf(tag);
      this.setState({tag: this.state.tags.splice(index, 1)})
    }

    addTag(e) {
      let key = e.which
      if (key === 13) { // 13 is enter
        let input = e.target.value.trim();
        if (input.length === 0) {
          return;
        }

        let tagBox = document.getElementById('tag-box')
        let tag = document.createElement("span");
        tag.className = "tags";
        tag.addEventListener('click', this.removeTag)
        tag.innerHTML = input;
        tagBox.appendChild(tag);
        e.target.value = '';

        this.setState({tags: this.state.tags.concat(input)})
      }
    }

    //Cited from 
    //https://stackoverflow.com/questions/22255580/javascript-upload-image-file-and-draw-it-into-a-canvas
    handleUpload(){
        let _this = this;
        console.log("Handle Upload");
        let input_file = document.getElementById('image-upload').files[0];
        let fileReader = new FileReader();


        let canvas = document.getElementById('image-canvas');
        let context = canvas.getContext("2d");
        fileReader.onloadend = function(e) {
            _this.setState({
                imageUrl: fileReader.result
            });
           let img = new Image();
           img.src = fileReader.result;

           img.addEventListener("load", function() {               
            //Cited from https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
             context.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                                0, 0, canvas.width, canvas.height);
           });
        };       
        fileReader.readAsDataURL(input_file);

        let dataurl = canvas.toDataURL("image/jpeg");
        this.setState({
            imageFile: dataurl
        })
    } 

    render() {
        let currDate = new Date().toISOString().substring(0, 10);
        return (
          <div className="CardCreate">
            <MiniNav />
            <div className="card col-6">
              <input type="text" id="title" placeholder="Enter Card Title"/>
              <div id = "top-row">
                  <div id = "image-area" className = "">
                      <canvas id='image-canvas'></canvas>
                      <input type="file" accept="image/jpeg" id="image-upload" onChange={this.handleUpload}/> 
                  </div>

                  <div id="desc-area" className = "">
                    <label> Describe the card and any requirements you have.
                      <br/><br/>
                      <div id = "description">
                        <textarea id="description-input" placeholder="Example: I’m looking for someone with experience tutoring college students in advanced calculus. Must be available weekly Monday nights. "/>
                      </div>
                    </label>
                  </div>
              </div>

              <div id = "bottom-row">
                <div id = "label-area">
                  <label id = "location"> Your task location
                    <input id="location-input" type="text" placeholder="Champaign, IL"/>
                  </label>
                  <label id = "deadline"> Deadline (if applicable)
                    <input id = "deadline-input" type="date" min = {currDate}/>
                  </label>
                </div>

                <div id = "tag-area">
                  <label>Tags
                    <input type = "text" id = "tag-input" onKeyPress = {this.addTag}/>
                  </label>
                  <div id = "tag-box"></div>
                </div>

                <div id="submission">
                  <input className="submit-button" onClick={this.handleOffer} type="submit" value="Offer" />
                  <input className="submit-button" onClick={this.handleRequest} type="submit" value="Request" />
                </div>
              </div>
          </div>
        </div>)
    }
}

export default withRouter(CardCreate)