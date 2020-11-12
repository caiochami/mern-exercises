import React from 'react'
import {ListGroup} from "react-bootstrap"

export default function User(props) {
    return (
        <ListGroup variant="flush">
            <ListGroup.Item>
                Name: {props.user.name}
            </ListGroup.Item>    
            <ListGroup.Item>
                Email: {props.user.email}
            </ListGroup.Item>     
            <ListGroup.Item>
                Exercises: {props.user.exercises.length}
            </ListGroup.Item>     
            <ListGroup.Item>
                Created at: {props.user.createdAt}
            </ListGroup.Item>     
            <ListGroup.Item>
                Updated at: {props.user.updatedAt}
            </ListGroup.Item>            
        </ListGroup>

    )
}
