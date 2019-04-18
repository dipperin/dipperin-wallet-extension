import { observable, action, computed } from 'mobx'
import { i18n } from '@/i18n'

class Label {
  @observable
  lang: string = 'en-US'

  constructor() {
    this.getLang()
  }

  @action
  updateLang = (lang: string) => {
    if (lang in i18n) {
      this.lang = lang
      chrome.storage.sync.set({ lang })
    }
  }

  private getLang = () => {
    chrome.storage.sync.get('lang', item => {
      if (item && item.lang) {
        this.updateLang(item.lang)
      }
    })
  }

  @computed
  get label() {
    return i18n[this.lang]
  }
}

export default Label
