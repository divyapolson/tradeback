import React, {Component} from 'react'
import {
    Header,
    Divider,
    Input,
    Form,
    TextArea,
    Button,
    Dropdown
} from 'semantic-ui-react'
import MiniNav from '../MiniNav/MiniNav.jsx'
import MakeOffer from './MakeOffer/MakeOffer.jsx'

import styles from './CardDetail.scss'
import TradePage from '../TradePage/TradePage.jsx'

import axios from 'axios'
axios.defaults.withCredentials = true;
//Configuration file
var config = require('../../config');

class CardDetail extends Component {
    constructor(props) {
        console.log("CardDetail constructor ran");
        super(props)
        this.state = {
            id: props.id,
            usercard: {},
            isLoggedIn: false,
            username: ""
        }

        this.makeOffer = this.makeOffer.bind(this);
    }

    componentWillMount() {
        let webUrl = window.location.href.split("=")
        let id = webUrl.pop();
        this.setState({
            id: id
        }, this.populate_data.bind(this));

        let endpoint = config.api_endpoint;
        let _this = this;
        // Check login
        axios.get(endpoint + '/auth/profile').then((res) => {
            console.log(res);
            this.setState({isLoggedIn: true, username: res.data.user.username});
        }).catch((err) => {
            console.log(err);
            console.log("Not logged in");
            this.setState({isLoggedIn: false})
        });
    }

    populate_data() {
        let endpoint = config.api_endpoint;
        let _this = this;
        // var userSchema = mongoose.Schema({
        //     email		: String,
        //     password	: String,
        //     location    : String,
        //     description : String,
        //     tags        : [String],
        //     cards       : [String],
        //     trades      : [String],
        //     profile     : String
        // });
        // Get User data
        console.log(this.state.id);
        axios.get(endpoint + '/api/card/' + '?id=' + this.state.id).then(function(response) {
            console.log(response.data);
            _this.setState({usercard: response.data.data});
        });
    }

    componentDidMount() {}

    makeOffer(){
        if (this.state.makeoffer){
            return (
                <div className="offer">
                    <MakeOffer otherAuthor={this.state.usercard.author} otherCardID={this.state.id}/>  
                </div>
            );
        } else {
            return (
                <div className="offer">
                    <h3>Interested in trading this card?</h3>
                    <h2 className="button" onClick={()=>{
                            this.setState({makeoffer: true});
                        }}>Make a Trade</h2>
                    <p>Or
                        <br/>
                        <a href="#/">keep searching</a>
                    </p>
                </div>
            );
        }
    }

    render() {
        let deadline = this.state.usercard.deadline
        if (deadline !== undefined) {
            deadline = deadline.substring(0, 10)
        }
        return (<div className="CardDetail">
            <MiniNav/>
            <div className="header">
                <h2 className="title">{this.state.usercard.title}</h2>
                <p className="author">
                    <a href={"#/profile/" + this.state.usercard.author}>{this.state.usercard.author}</a>
                </p>
            </div>
            <Divider hidden/>
            <div className="wrapper">
                <div className="card">
                    <div className="left">
                        <img className="card-pic" src={this.state.usercard.image} height="300" width="300"/>
                    </div>
                    <div className="right">
                        <p className="desc">{this.state.usercard.description}</p>
                        <div className="location">
                            <h3>Location</h3>
                            <p>{this.state.usercard.location}</p>
                        </div>
                        <div className="deadline">
                            <h3>Deadline</h3>
                            <p>{deadline}</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.makeOffer()
            }
        </div>)
    }
}

export default CardDetail
