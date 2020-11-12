import React from 'react'

import {Toast as T} from 'react-bootstrap'

export default function Toast(props) {
    return (
        <T style={{zIndex: 1075}} onClose={props.hide} animation={false} show={props.show} delay={3000} autohide>
          <T.Header>
            
            <strong className="mr-auto">{props.title}</strong>
            <small>Now</small>
          </T.Header>
          <T.Body>{props.children}</T.Body>
        </T>
    )
}
