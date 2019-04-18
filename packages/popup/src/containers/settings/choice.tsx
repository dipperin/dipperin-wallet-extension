import React from 'react'

interface Props {
  active: boolean
  onClick: (...reast: any[]) => void
}
class Choice extends React.Component<Props> {
  render() {
    return (
      <div
        className={this.props.active ? 'setting-netword-active' : 'setting-netword-item'}
        onClick={this.props.onClick}
      >
        {this.props.children}
        {this.props.active && <span className="setting-activenet" />}
      </div>
    )
  }
}

export default Choice
