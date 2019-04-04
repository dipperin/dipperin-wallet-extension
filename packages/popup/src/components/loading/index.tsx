import React, { Fragment } from 'react'

import './loadingStyle.css'

interface LoadingProps {
  show?: boolean
}

class Loading extends React.Component<LoadingProps> {
  render() {
    const show = this.props.show || false
    return (
      <Fragment>
        {show && (
          <div className={`loading-bg`}>
            <div className="loading-main">
              <div className="spinner">
                <div className="spinner-container container1">
                  <div className="circle1" />
                  <div className="circle2" />
                  <div className="circle3" />
                  <div className="circle4" />
                </div>
                <div className="spinner-container container2">
                  <div className="circle1" />
                  <div className="circle2" />
                  <div className="circle3" />
                  <div className="circle4" />
                </div>
                <div className="spinner-container container3">
                  <div className="circle1" />
                  <div className="circle2" />
                  <div className="circle3" />
                  <div className="circle4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}

export default Loading
