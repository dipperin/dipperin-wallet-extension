import extensionizer from 'extensionizer'

class StorageService {
  store: typeof extensionizer.storage.local
  constructor() {
    this.store = extensionizer.storage.local
  }

  getData(key: string) {
    return new Promise((resolve, reject) => {
      this.store.get(key, data => {
        if (key in data) {
          return resolve(data[key])
        }
        return reject()
      })
    })
  }

  setData(key: string, value: any) {
    this.store.set({
      [key]: value
    })
  }
}

export default StorageService
