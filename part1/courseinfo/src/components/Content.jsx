import React from 'react'
import Part from './Part'



const Content = (props) => {

  return (
    <div>
        <Part part={props[0].name} exercise={props[0].exercises} />
        <Part part={props[1].name} exercise={props[1].exercises} />
        <Part part={props[2].name} exercise={props[2].exercises} />
    </div>
  )
}

export default Content