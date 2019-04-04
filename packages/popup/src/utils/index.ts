import Identicon from 'identicon.js'

export const genAvatar = (address: string | undefined, size?: number) => {
  const hashData = address || '0000000000000000'
  const imgSize = size || 30
  const data = new Identicon(hashData, imgSize).toString()
  return `data:image/png;base64,${data}`
}

export const verifyNumber = (input: string) => {
  if (!input) {
    return true
  }
  const re = /^[0-9.]+$/
  return re.test(input)
}
