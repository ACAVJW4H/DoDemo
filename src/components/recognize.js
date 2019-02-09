import React, { Component } from 'react';
import Webcam from 'react-webcam';
import Websocket from 'react-websocket';

// material-ui component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Grid, Row, Col } from 'react-flexbox-grid';
import axios from 'axios';

import { connect } from 'react-redux';
import { recognizeUser, clearDisplayData } from '../actions';

import '../styles/register.css';

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

class Recognize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            name: false
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

    setRef = (webcam) => {
        this.webcam = webcam;
    }
    sendFrameLoop() {
        if (this.tok > 0) {
            const imageSrc = this.webcam.getScreenshot();

            var msg = {
                'type': 'FRAME',
                'dataURL': imageSrc,
                'identity': this.defaultPerson
            };
            this.refWebSocket.sendMessage(JSON.stringify(msg));
            this.tok--;
        }
        setTimeout(function () { this.sendFrameLoop() }.bind(this), 250);
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
        const j = JSON.parse(data)
        if (j.type == "NULL") {
            this.receivedTimes.push(new Date());
            this.numNulls++;
            if (this.numNulls == this.defaultNumNulls) {
                //this.sendState();
                this.sendFrameLoop();
            } else {
                this.refWebSocket.sendMessage(JSON.stringify({ 'type': 'NULL' }));
                this.sentTimes.push(new Date());
            }
        } else if (j.type == "PROCESSED") {
            this.tok++;
        }
        else if (j.type == "INFO") {
           this.setState({name:j.name})
        }else if (j.type == "NEW_IMAGE") {
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
            //$("#peopleInVideo").html(h);
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
        this.refWebSocket.sendMessage(message);
    }
    render() {
        return (
            <div class="cont">
                <Webcam
                    audio={false}
                    height={480}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    style={{ visibility: "hidden", height: 0 }}
                />
                <div class="card">
                    <div class="front">
                        <div class="contentfront">
                            <div class="month">
                                <h1> Hoş Geldin {this.state.name}! </h1>
                                <table>
                                    <tr class="orangeTr">
                                        <th>P</th>
                                        <th>S</th>
                                        <th>Ç</th>
                                        <th>P</th>
                                        <th>C</th>
                                        <th>C</th>
                                        <th>P</th>
                                    </tr>
                                    <tr class="whiteTr">
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>1</th>
                                        <th>2</th>
                                        <th>3</th>
                                    </tr>
                                    <tr class="whiteTr">
                                        <th>4</th>
                                        <th>5</th>
                                        <th><b>6</b></th>
                                        <th>7</th>
                                        <th>8</th>
                                        <th>9</th>
                                        <th>10</th>
                                    </tr>
                                    <tr class="whiteTr">
                                        <th>11</th>
                                        <th>12</th>
                                        <th>13</th>
                                        <th>14</th>
                                        <th>15</th>
                                        <th>16</th>
                                        <th>17</th>
                                    </tr>
                                    <tr class="whiteTr">
                                        <th>18</th>
                                        <th>19</th>
                                        <th>20</th>
                                        <th>21</th>
                                        <th>22</th>
                                        <th>23</th>
                                        <th>24</th>
                                    </tr>
                                    <tr class="whiteTr">
                                        <th>25</th>
                                        <th>26</th>
                                        <th>27</th>
                                        <th>28</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </table>
                            </div>
                            <div class="date">
                                <div class="datecont">
                                    <div id="date">6</div>
                                    <pre> <div id="day">Çarşamba</div> </pre>
                                    <div id="month">Şubat</div>
                                    <h2> Bugünkü toplantıların </h2>
                                    <h3> Ar-Ge 14:30</h3>
                                    <h3> Bütçe 15:30</h3>

                                </div>
                            </div>

                            <div class="Foto">
                                <img src="http://localhost:8000/stream.mjpeg" height="432px" width="768px"></img>
                            </div>

                        </div>


                    </div>
                    <div class="back">

                    </div>
                </div>
                <Websocket url='ws://localhost:9000' onMessage={this.handleData.bind(this)}
                                onOpen={this.handleOpen.bind(this)} onClose={this.handleClose.bind(this)}
                                reconnect={true} debug={false}
                                ref={Websocket => {
                                    this.refWebSocket = Websocket;
                                }} />

            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        detData: state.detData
    }
}

export default connect(mapStateToProps, { recognizeUser, clearDisplayData })(Recognize);
