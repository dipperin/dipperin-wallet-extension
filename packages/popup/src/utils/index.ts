import Identicon from 'identicon.js'
import { Utils } from '@dipperin/dipperin.js'

export const genAvatar = (address: string | undefined, size?: number) => {
  const hashData = address || '0000000000000000'
  const imgSize = size || 30
  const data = new Identicon(hashData, imgSize).toString()
  return `data:image/png;base64,${data}`
}

// validaters

/**
 *
 * @param input
 */
export const verifyNumber = (input: string) => {
  if (!input) {
    return true
  }
  const re = /^[0-9.]+$/
  return re.test(input)
}

export const verifyEnteringAmount = (amount: string) => {
  if (!amount) {
    return true
  }

  return /^[0-9]*(\.[0-9]{0,18})?$/.test(amount)
}

export const validateAddress = (address: string) => {
  return Utils.isAddress(address)
}

// formatters

export const formatAmount = (amount: string) => {
  // add 0 before . if . is first
  let formattedAmount = amount
  if (formattedAmount.slice(0, 1) === '.') {
    formattedAmount = '0' + formattedAmount
  }
  // get rid of ., if . is in end
  if (/^\d+\.$/.test(formattedAmount)) {
    formattedAmount = formattedAmount.slice(0, formattedAmount.length - 1)
  }
  // get rid of the number too small .
  const temp = formattedAmount.match(/^\d+\.(\d*)$/)
  if (temp && temp[1].length > 18) {
    formattedAmount = (formattedAmount.match(/^(\d+\.\d{0,18})\d*$/) as any) as string
  }

  return formattedAmount
}

export const sleep = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
