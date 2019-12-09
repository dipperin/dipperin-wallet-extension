import React, { Fragment } from 'react'
import './modalStyle.css'

interface ModalProps {
  showModal?: boolean
  size?: number
  theme?: string
  style?: React.CSSProperties
}

class Modal extends React.Component<ModalProps> {
  render() {
    const showModal = this.props.showModal || false
    const size = this.props.size || 200
    const theme = this.props.theme || 'light'
    return (
      <Fragment>
        {showModal && (
          <div className={`modal-bg theme-${theme}`}>
            {this.props.style && (
              <div className="modal-main" style={this.props.style}>
                {this.props.children}
              </div>
            )}
            {!this.props.style && (
              <div className="modal-main" style={{ width: size }}>
                {this.props.children}
              </div>
            )}
          </div>
        )}
      </Fragment>
    )
  }
}

export default Modal
