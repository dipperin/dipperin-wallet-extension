import React from 'react'
import { observable, action, runInAction, autorun } from 'mobx'
import classnames from 'classnames'
// import { popupLog as log } from '@dipperin/lib/log'

interface Props {
  mnemonic: string
  changeSelect: (select: number[]) => void
}

class RandomMnemonic extends React.Component<Props> {
  mnemonic: string[]

  @observable
  randomRank: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  @observable
  mnemonicChecked: boolean[] = new Array(12).fill(false)

  @observable
  seletedMnemonic: number[] = []

  constructor(props) {
    super(props)
    this.initMnemonic()
    this.randomSort()
    autorun(() => {
      this.props.changeSelect(this.seletedMnemonic)
    })
  }

  @action
  randomSort = () => {
    // disorganize the randomRank
    this.randomRank = this.randomRank.slice().sort((a, b) => {
      return Math.random() - 0.5
    })
  }

  @action
  initMnemonic = () => {
    this.mnemonic = this.props.mnemonic.split(' ')
  }

  @action
  handleCheck = e => {
    // console.log(e.target)
    this.mnemonicChecked[Number(e.target.key)] = true
  }

  genHandleCheck = key => e => {
    runInAction(() => {
      const id = this.seletedMnemonic.indexOf(key)
      if (id === -1) {
        this.mnemonicChecked[key] = true
        this.seletedMnemonic.push(key)
      } else {
        this.seletedMnemonic.splice(id, 1)
      }
    })
  }
  genButton = item => {
    return (
      <button
        className={classnames({
          'backupConfirm-mnemonic': true,
          'backupConfirm-mnemonic-checked': this.seletedMnemonic.indexOf(item) > -1
        })}
        key={item}
        onClick={this.genHandleCheck(item)}
      >
        {this.mnemonic[item]}
      </button>
    )
  }

  render() {
    // console.log(this.mnemonic)
    return (
      <div className="backupConfirm-mnemonic-area">
        {[0, 1, 2, 3].map(row => (
          <div className="backupConfirm-mnemonic-row" key={row}>
            {this.randomRank.slice(row * 3 + 0, row * 3 + 3).map(this.genButton)}
          </div>
        ))}
      </div>
    )
  }
}

export default RandomMnemonic
