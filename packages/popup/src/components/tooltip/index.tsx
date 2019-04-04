import React from 'react'
// import { observable } from 'mobx'
import { observer } from 'mobx-react'

import './tooltipStyle.css'

interface TooltipProps {
  message: string
  position: string
  displayTooltip: boolean
  size?: number
}

@observer
class Tooltip extends React.Component<TooltipProps> {
  // @observable
  // displayTooltip: boolean = false

  render() {
    const message = this.props.message
    const position = this.props.position
    const displayTooltip = this.props.displayTooltip
    const size = this.props.size || 210
    return (
      <span className="tooltip">
        {displayTooltip && (
          <div className={`tooltip-bubble tooltip-${position}`} style={{ width: size }}>
            <div className="tooltip-message">{message}</div>
          </div>
        )}
        <span className="tooltip-trigger">{this.props.children}</span>
      </span>
    )
  }
}

export default Tooltip
