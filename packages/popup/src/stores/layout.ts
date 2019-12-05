import { observable, action } from 'mobx'

class Layout {
  @observable
  loadingHandler = {
    show: false,
    time: 0
  }

  @observable
  showModal: boolean = false
  @observable
  modalMessage: string = ''

  @action
  private closeLoading = () => {
    this.loadingHandler.show = false
  }

  @action
  private openLoading = () => {
    this.loadingHandler.show = true
  }

  @action
  private setLoadingTime = (time: number) => {
    this.loadingHandler.time = time
  }

  @action
  setShowModal = (flag: boolean) => {
    this.showModal = flag
  }
  @action
  setModalMessage = (msg: string) => {
    this.modalMessage = msg
  }

  displayModal = (msg: string) => {
    this.setModalMessage(msg)
    this.setShowModal(true)
  }

  closeModal = () => {
    this.setShowModal(false)
    this.setModalMessage('')
  }

  handleCloseLoading = (cb?: (param?: any) => void, param?: any) => {
    const now = new Date().getTime()

    if (now - this.loadingHandler.time > 1100) {
      this.closeLoading()
      if (cb) {
        cb(param)
      }
    } else {
      const delta = this.loadingHandler.time + 1100 - now
      setTimeout(() => {
        this.closeLoading()
        if (cb) {
          cb(param)
        }
      }, delta)
    }
  }

  handleOpenLoading = () => {
    this.openLoading()
    this.setLoadingTime(new Date().getTime())
    setTimeout(() => {
      this.closeLoading()
    }, 8000)
  }

  // toggleLoading = (cb?: () => void) => {
  //   if (this.loadingHandler.show) {
  //     const now = new Date().getTime()
  //     if (now - this.loadingHandler.time > 1100) {
  //       this.closeLoading()
  //       if (cb) {
  //         cb()
  //       }
  //     } else {
  //       const delta = this.loadingHandler.time + 1100 - now
  //       setTimeout(() => {
  //         this.closeLoading()
  //         if (cb) {
  //           cb()
  //         }
  //       }, delta)
  //     }
  //   } else {
  //     this.openLoading()
  //     this.setLoadingTime(new Date().getTime())
  //     setTimeout(() => {
  //       this.closeLoading()
  //     }, 4000)
  //   }
  // }
}

export default Layout
