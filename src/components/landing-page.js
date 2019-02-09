import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/register.css';

// images being used
import detectImg from '../assets/images/facialrecog.jpg';
import registerImg from '../assets/images/3.jpg';
import galleryImg from '../assets/images/4.jpg';

import { Grid, Row, Col } from 'react-flexbox-grid';

// material-ui components
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class LandingPage extends Component {

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} md={12} style={{ 'textAlign': 'center' }}>
                        <br/><br/><br/><br/><br/><br/>
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                    </Col>
                    <Col xs={12} md={4} style={{ 'textAlign': 'center' }}>
                        <Card>
                            <CardMedia
                            >
                                <img className='landingImage' src={detectImg} alt="detect" />
                            </CardMedia>
                            <CardContent>
                                <Link to={'/recognize'}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Yüz Tanıma
                         </Typography>
                                </Link>

                            </CardContent>
                        </Card>
                    </Col>
                    <Col xs={12} md={4} style={{ 'textAlign': 'center' }}>
                        <Card>
                            <CardMedia
                            >
                                <img className='landingImage' src={registerImg} alt="register" />
                            </CardMedia>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <Link to={'/register'}>Kişi Kayıt</Link>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Col>
                    
                </Row>
            </Grid>
        );
    }
}

export default LandingPage;
;