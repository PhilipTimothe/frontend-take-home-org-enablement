import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class DashboardEvents extends Component {
    state = {
        page: 1,
        events: [],
    }

    componentDidMount() {
        fetch(`http://localhost:3000/events?page=${this.state.page}`)
            .then((res) => res.json())
            .then(data => {
                this.setState({ 
                    events: data.events,
                })
            })
    }

    handleClick() {
        console.log(this.state.events)
    }


    render() {
        return (
            <>
                <Button variant="light" onClick={this.handleClick}>Load Events</Button> 
            </>
        );
    }
}

export default DashboardEvents;