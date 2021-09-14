import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'



class DashboardEvents extends Component {
    // Create state properties to hold data that will be manipulated
    state = {
        page: 1,
        events: [],
        show: false,
        currentEvent: {
            info: {
                title: '',
                description: '',
                venue: '',
                address: '',
                address2: '',
                region: '',
            },
            date: {
                month: '',
                day: '',
                year: '',
            },
            startTime: '',
            endTime: '',
            sessions: [],
        },
    }

    // get data from endpoint
    componentDidMount() {
        fetch(`http://localhost:3000/events?page=${this.state.page}`)
            .then((res) => res.json())
            .then(data => {
                this.setState({ 
                    events: data.events,
                })
            })
    }

    // Render data on page
    renderEvents() {
        return (
            <>
            <Row>
                {this.state.events.map((event) => 
                <Col sm key={event.id} onClick={this.handleModalClick}>
                    <Card className="eventcard" id={event.id} style={{ width: '18rem', height: '35rem'}} >
                        <Card.Img variant="top" id={event.id} className="cardImg" src={event.image_url} style={{ borderRadius: '.5rem', padding: '.40rem', height: '30rem', overflow: 'hidden', objectFit: 'cover'}}/>
                        <Card.Body>
                            <Card.Text id={event.id}>{event.title}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                )}
            </Row>
            </>
        )
    }

    // render next page of events
    renderNextEvents= () => {
        this.setState({
            page: this.state.page + 1
        }, () => 
            fetch(`http://localhost:3000/events?page=${this.state.page}`)
                .then((res) => res.json())
                .then(data => {
                    this.setState({ 
                        events: data.events,
                    })
                }))
    }

    // render previous page of events
    renderPreviousEvents= () => {
        this.setState({
            page: this.state.page - 1
        }, () => 
            fetch(`http://localhost:3000/events?page=${this.state.page}`)
                .then((res) => res.json())
                .then(data => {
                    this.setState({ 
                        events: data.events,
                    })
                }))
    }

    // Render a modal on card click
    handleModalClick = e => {
        var options = { month: 'long'};

        fetch(`http://localhost:3000/events/${e.target.id}`)
            .then((res) => res.json())
            .then(data => {
                this.setState({
                    show: true, 
                    currentEvent: {
                        info: {
                            title: data.event.title,
                            description: data.event.description,
                            venue: data.event.venue.name,
                            address: data.event.venue.address,
                            address2: `${data.event.venue.city}, ${data.event.venue.country} ${data.event.venue.postalCode}`,
                            region: data.event.venue.region,
                        },
                        date: {
                            month: Intl.DateTimeFormat('en-US', options).format(data.event.event_start),
                            day: new Date(data.event.event_start).getDay(),
                            year: new Date(data.event.event_start).getFullYear(),
                        },
                        startTime: `${((new Date(data.event.event_start).getHours() + 11) % 12 + 1)}:${ ('0' + (new Date(data.event.event_start).getMinutes())).slice(-2)}${(new Date(data.event.event_start).getHours()) >= 12 ? 'pm' : 'am'}`,
                        endTime: `${((new Date(data.event.event_end).getHours() + 11) % 12 + 1)}:${ ('0' + (new Date(data.event.event_end).getMinutes())).slice(-2)}${(new Date(data.event.event_end).getHours()) >= 12 ? 'pm' : 'am'}`,
                        sessions: data.event.sessions
                    }
                })
                console.log(this.state.currentEvent.sessions)
            })
                    
    }


    render() {

        // new Intl.DateTimeFormat('en-US', options).format(moonLanding)
        return (
            <>
                <div style={{ padding: '5rem' }}>
                    {this.renderEvents()}
                </div>
                
                <Modal show={this.state.show} onHide={() => this.setState({ show: false })} animation={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.currentEvent.info.title}</Modal.Title>
                    </Modal.Header>
                    <Col>
                    <Modal.Body>
                        <h5>Event Details</h5>
                        <h6>Date & Time</h6>
                        <p style={{ marginBottom: '0'}}>{this.state.currentEvent.date.month} {this.state.currentEvent.date.day}, {this.state.currentEvent.date.year}</p>
                        <p>{this.state.currentEvent.startTime} - {this.state.currentEvent.endTime}</p>
                        <h6>Location</h6>
                        <p style={{ marginBottom: '0'}}>{this.state.currentEvent.info.venue}</p>
                        <p style={{ marginBottom: '0'}}>{this.state.currentEvent.info.address}</p>
                        <p style={{ marginBottom: '0'}}>{this.state.currentEvent.info.address2}</p>
                        <br style={{ borderBottom: '1rem'}}/>
                        <h6>Description</h6>
                        <p style={{ marginBottom: '0'}}>{this.state.currentEvent.info.description}</p>
                    </Modal.Body>
                    </Col>
                    <Col></Col>
                    <Modal.Footer className="eventModal">
                        <ListGroup variant="flush" className="listGroup">
                        <h6 style={{ textAlign: 'center' }}>Sessions({this.state.currentEvent.sessions.length})</h6> 
                            {this.state.currentEvent.sessions.map((session) => 
                                <ListGroup.Item key={session.id}>
                                    <p style={{ marginBottom: '0'}}>{session.title}</p>
                                    <p style={{ marginBottom: '0'}}>{((new Date(session.event_start).getHours() + 11) % 12 + 1)}:{ ('0' + (new Date(session.event_start).getMinutes())).slice(-2)}{(new Date(session.event_start).getHours()) >= 12 ? 'pm' : 'am'} - {((new Date(session.event_end).getHours() + 11) % 12 + 1)}:{ ('0' + (new Date(session.event_end).getMinutes())).slice(-2)}{(new Date(session.event_end).getHours()) >= 12 ? 'pm' : 'am'}</p>
                                </ListGroup.Item>
                            )}                     
                        </ListGroup>
                    </Modal.Footer>
                </Modal>

                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <Button style={{ width: '12rem', margin: '.5rem' }} variant="outline-primary" onClick={this.renderPreviousEvents}>Back</Button>
                    <Button style={{ width: '12rem', margin: '.5rem' }} variant="outline-primary" onClick={this.renderNextEvents}>Next</Button>
                </div>
            </>
        );
    }
}

export default DashboardEvents;