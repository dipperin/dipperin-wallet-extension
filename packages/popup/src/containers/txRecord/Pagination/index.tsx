import React, { Fragment } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

interface Props {
  maxPage: number
  handlePage: (newPage: number) => void
}

const paginationStyle: React.CSSProperties = {
  width: '100%',
  height: '65px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: '0'
}

const turnPageStyle: React.CSSProperties = {
  width: '50px',
  fontSize: '14px',
  cursor: 'pointer'
}

const pageBtnStyle: React.CSSProperties = {
  margin: '0 8px',
  height: '30px',
  width: '30px',
  lineHeight: '30px',
  background: 'white',
  borderRadius: '15px',
  fontSize: '14px',
  fontWeight: 500,
  color: 'black',
  textAlign: 'center',
  cursor: 'pointer'
}
const cpageBtnStyle: React.CSSProperties = {
  margin: '0 8px',
  height: '30px',
  width: '30px',
  lineHeight: '30px',
  background: '#12A8E0',
  borderRadius: '15px',
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'center',
  cursor: 'pointer'
}

const emStyle: React.CSSProperties = {
  margin: '0 8px',
  height: '30px',
  width: '20px',
  lineHeight: '23px',
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'center',
  cursor: 'pointer'
}

@observer
class Pagination extends React.Component<Props> {
  @observable
  currentPage = 0

  @action
  handlePageChange(num: number) {
    if (num >= 0 && num < this.props.maxPage) {
      this.currentPage = num
      this.props.handlePage(num)
    }
  }

  getPageStyle = (index: number) => {
    return this.currentPage === index ? cpageBtnStyle : pageBtnStyle
  }

  render() {
    const { maxPage } = this.props
    const currentPage = this.currentPage
    return (
      <div style={paginationStyle}>
        <span style={turnPageStyle} onClick={this.handlePageChange.bind(this, currentPage - 1)}>
          上一页
        </span>
        {maxPage <= 5 &&
          Array(maxPage)
            .fill(0)
            .map((_, index) => (
              <span style={this.getPageStyle(index)} onClick={this.handlePageChange.bind(this, index)}>
                {index + 1}
              </span>
            ))}
        {maxPage > 5 && (
          <Fragment>
            <span style={this.getPageStyle(0)} onClick={this.handlePageChange.bind(this, 0)}>
              1
            </span>
            {currentPage < 3 && (
              <span style={this.getPageStyle(1)} onClick={this.handlePageChange.bind(this, 1)}>
                2
              </span>
            )}
            {currentPage < 3 && (
              <span style={this.getPageStyle(2)} onClick={this.handlePageChange.bind(this, 2)}>
                3
              </span>
            )}
            {currentPage > 2 && <span style={emStyle}>...</span>}
            {currentPage > 2 && currentPage < maxPage - 3 && (
              <span style={cpageBtnStyle} onClick={this.handlePageChange.bind(this, this.currentPage)}>
                {currentPage + 1}
              </span>
            )}
            {currentPage < maxPage - 3 && <span style={emStyle}>...</span>}
            {currentPage >= maxPage - 3 && (
              <span style={this.getPageStyle(maxPage - 3)} onClick={this.handlePageChange.bind(this, maxPage - 3)}>
                {maxPage - 2}
              </span>
            )}
            {currentPage >= maxPage - 3 && (
              <span style={this.getPageStyle(maxPage - 2)} onClick={this.handlePageChange.bind(this, maxPage - 2)}>
                {maxPage - 1}
              </span>
            )}
            <span style={this.getPageStyle(maxPage - 1)} onClick={this.handlePageChange.bind(this, maxPage - 1)}>
              {maxPage}
            </span>
          </Fragment>
        )}
        <span style={turnPageStyle} onClick={this.handlePageChange.bind(this, currentPage + 1)}>
          下一页
        </span>
      </div>
    )
  }
}

export default Pagination
