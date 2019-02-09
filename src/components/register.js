import React, { Component } from 'react';
import Webcam from 'react-webcam';
import '../styles/register.css';

import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { connect } from 'react-redux';
import { registerUser, clearDisplayData } from '../actions';

import UserRegister from './user-register';

// material-ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Websocket from 'react-websocket';
import { Divider } from 'material-ui';
// loader styling
const style = {
    container: {
        position: 'absolute',
    },
    refresh: {
        display: 'inline-block',
        position: 'absolute',
    },
    hide: {
        display: 'none',
        position: 'absolute',
    },
};

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            load: false,
            image: ''
        };
        this.defaultTok = 1;
        this.defaultNumNulls = 20;
        this.people = [];
        this.images = {};
        this.defaultPerson = -1;
        this.training = false;
        //onOpen
        this.sentTimes = [];
        this.receivedTimes = [];
        this.tok = this.defaultTok;
        this.numNulls = 0
    }

    componentDidMount() {
        this.props.clearDisplayData();
    }



    resetGallery = () => {

        this.setState({
            load: true
        });

    }
    setRef = (webcam) => {
        this.webcam = webcam;
    }


    handleUsername(e) {
        this.setState({
            username: e.target.value
        });
    }


    /*updateIdentity(hash, idx) {
        var imgIdx = findImageByHash(hash);
        if (imgIdx >= 0) {
            this.images[imgIdx].identity = idx;
            var msg = {
                'type': 'UPDATE_IDENTITY',
                'hash': hash,
                'idx': idx
            };
            this.refWebSocket.sendMessage(JSON.stringify(msg));
        }
    }*/

    addPerson() {
        this.defaultPerson = this.people.length;

        if (this.state.username === '' || this.state.username === ' ') {
            alert('Kullanıcı ismi boş olamaz');
            return;
        }

        this.setState({
            load: true
        });
        this.people.push(this.state.username);

        var msg = {
            'type': 'ADD_PERSON',
            'val': this.state.username,
            'id': this.defaultPerson
        };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
        this.trainingPerson(true);
    }
    trainingPerson(training) {
        if (!training)
            this.defaultPerson = -1;
        var msg = {
            'type': 'TRAINING',
            'val': training
        };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
        //TODO Carry over Redux and Persist on Database
        if (training)
            setTimeout(function () { this.trainingPerson(false) }.bind(this), 10000);
    }

    sendFrameLoop() {
        if (this.tok > 0) {
            const imageSrc = this.webcam.getScreenshot();

            var msg = {
                'type': 'FRAME',
                'dataURL': imageSrc,
                'identity': this.defaultPerson
            };
            console.log(msg)
            this.refWebSocket.sendMessage(JSON.stringify(msg));
            this.tok--;
        }
        setTimeout(function () { this.sendFrameLoop() }.bind(this), 200);
    }
    sendState() {
        var msg = {
            'type': 'ALL_STATE',
            'images': this.images,
            'people': this.people,
            'training': this.training
        };
        this.refWebSocket.sendMessage(JSON.stringify(msg));
    }
    handleData(data) {
        console.log(data)
        const j = JSON.parse(data)
        if (j.type == "NULL") {
            this.receivedTimes.push(new Date());
            this.numNulls++;
            if (this.numNulls == this.defaultNumNulls) {
                this.sendState();
                this.sendFrameLoop();
            } else {
                console.log("type null")
                this.refWebSocket.sendMessage(JSON.stringify({ 'type': 'NULL' }));
                this.sentTimes.push(new Date());
            }
        } else if (j.type == "PROCESSED") {
            this.tok++;
        } else if (j.type == "NEW_IMAGE") {
            console.log("new Images");
            //TODO Set this and redrawPoeple
            /*this.images.push({
                hash: j.hash,
                identity: j.identity,
                image: getDataURLFromRGB(j.content),
                representation: j.representation
            });*/
            //this.redrawPeople();
        } else if (j.type == "IDENTITIES") {
            //TODO SET THis to State
            var h = "Last updated: " + (new Date()).toTimeString();
            h += "<ul>";
            var len = j.identities.length
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var identity = "Unknown";
                    var idIdx = j.identities[i];
                    if (idIdx != -1) {
                        identity = this.people[idIdx];
                    }
                    h += "<li>" + identity + "</li>";
                }
            } else {
                h += "<li>Nobody detected.</li>";
            }
            h += "</ul>"
        } else if (j.type == "ANNOTATED") {
            this.setState({ image: j['content'] });
        } else {
            console.log("Unrecognized message type: " + j.type);
        }
    }
    handleOpen() {
        console.log("connected:)");
        this.sentTimes = [];
        this.receivedTimes = [];
        this.tok = this.defaultTok;
        this.numNulls = 0

        this.refWebSocket.sendMessage(JSON.stringify({'type': 'NULL'}));
        this.sentTimes.push(new Date());
    }
    handleClose() {
        console.log("disconnected:(");
    }

    sendMessage(message) {
        console.log("send ms");
        this.refWebSocket.sendMessage(message);
    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} md={4} mdOffset={4}>
                        <div style={{ 'textAlign': 'center' }}>
                            <Webcam
                                audio={false}
                                height={480}
                                ref={this.setRef}
                                screenshotFormat="image/jpeg"
                                width={640}
                                style={{visibility:"hidden",height:0}}
                            />
                            <img src="http://localhost:8000"/>
                            <img src={this.state.image} />
                            <br />
                            <div style={{ 'margin': '0 auto!important' }}>
                                <TextField
                                    hintText="Kişi bilgilerini giriniz"
                                    floatingLabelText="Kullanıcı Adı"
                                    onChange={(event) => this.handleUsername(event)}
                                />
                            </div>
                            <br />

                            <Button className='register-button' onClick={this.capture} label="REGISTER" primary={true} style={{ 'margin': 16 }}>Register</Button>
                            <Button className='register-button' onClick={this.resetGallery}  primary={true} style={{ 'margin': 16 }}>RESET GALLERY</Button>
                            <Websocket url='ws://localhost:9000' onMessage={this.handleData.bind(this)}
                                onOpen={this.handleOpen.bind(this)} onClose={this.handleClose.bind(this)}
                                reconnect={true} debug={false}
                                ref={Websocket => {
                                    this.refWebSocket = Websocket;
                                }} />

                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        regData: state.regData
    }
}

export default connect(mapStateToProps, { registerUser, clearDisplayData })(Register);
