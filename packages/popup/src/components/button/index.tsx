import React from 'react'
import './buttonStyle.css'

interface Params {
  classes: string[]
  type?: string
  size?: string
  color?: string
  float?: string
}

interface ButtonProps {
  params: Params
  onClick: () => void
  disabled?: boolean
}

class Button extends React.Component<ButtonProps> {
  parseType = (type?: string): string => {
    let res: string
    const typeMap = {
      default: 'default'
    }
    if (type && type in typeMap) {
      res = typeMap[type]
    } else {
      res = typeMap.default
    }
    return `gbtn-${res}`
  }

  parseColor = (color?: string): string => {
    let res: string
    const colorMap = {
      cyan: 'cyan',
      blue: 'blue',
      gray: 'gray',
      default: 'blue'
    }
    if (color && color in colorMap) {
      res = colorMap[color]
    } else {
      res = colorMap.default
    }
    return `gbtn-${res}`
  }

  parseSize = (size?: string) => {
    let res: string
    const sizeMap = {
      large: 'large',
      middle: 'middle',
      small: 'small',
      default: 'large'
    }
    if (size && size in sizeMap) {
      res = sizeMap[size]
    } else {
      res = sizeMap.default
    }
    return `gbtn-${res}`
  }

  parseFloat = (float: string) => {
    let res: string
    if (float === 'right') {
      res = 'right'
    } else {
      res = 'left'
    }
    return `gbtn-${res}`
  }

  btnClasses = () => {
    const { type, color, size, float } = this.props.params
    const btnClasses: string[] = []
    btnClasses.push(this.parseType(type))
    btnClasses.push(this.parseColor(color))
    btnClasses.push(this.parseSize(size))
    if (float) {
      btnClasses.push(this.parseFloat(float))
    }
    return btnClasses.join(' ')
  }

  render() {
    const { classes } = this.props.params

    return (
      <div className={'gbtn-box ' + classes.join(' ')}>
        <button className={this.btnClasses()} onClick={this.props.onClick} disabled={this.props.disabled}>
          {this.props.children}
        </button>
      </div>
    )
  }
}

export default Button
