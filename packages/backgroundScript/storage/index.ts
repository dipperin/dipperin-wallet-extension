import extensionizer from 'extensionizer'
import { WalletObj } from '@dipperin/lib/models/wallet'
import { AccountObj } from '@dipperin/lib/models/account'
import { TransactionObj } from '@dipperin/lib/models/transaction'
import {
  WALLET,
  ACCOUNTS,
  TRANSACTIONS,
  ACCOUNT,
  WHITE_LIST,
  ACTIVE_ACCOUNT_ID,
  DEFAULT_ACTIVE_ACCOUNT_ID
} from '@dipperin/lib/constants'

const storage = extensionizer.storage.local

const getData = (key: string) => {
  return new Promise((resolve, reject) => {
    storage.get(key, data => {
      if (key in data) {
        return resolve(data[key])
      }
      return reject()
    })
  })
}

const setData = (key: string, value: any) => {
  storage.set({
    [key]: value
  })
}

export const getWallet = async (): Promise<WalletObj | undefined> => {
  try {
    const walletObj = await getData(WALLET)
    return walletObj as WalletObj
  } catch (_) {
    return undefined
  }
}

export const setWallet = (walletObj: WalletObj) => {
  setData(WALLET, walletObj)
}

export const getAccounts = async (): Promise<AccountObj[]> => {
  try {
    const accounts = (await getData(ACCOUNTS)) || []
    return accounts as AccountObj[]
  } catch (_) {
    return []
  }
}

export const setActiveAccountId = (activeId: string) => {
  setData(ACTIVE_ACCOUNT_ID, activeId)
}

export const getActiveAccountId = async (): Promise<string> => {
  try {
    const activeId = ((await getData(ACTIVE_ACCOUNT_ID)) || DEFAULT_ACTIVE_ACCOUNT_ID) as string
    return activeId
  } catch (_) {
    return DEFAULT_ACTIVE_ACCOUNT_ID
  }
}

export const addAccount = async (account: AccountObj) => {
  const preAccounts = await getAccounts()
  preAccounts.push(account)
  setData(ACCOUNTS, preAccounts)
}

export const deleteAccount = async (id: string) => {
  const preAccounts = await getAccounts()
  const accounts = preAccounts.filter(account => {
    return account.id !== id
  })
  setData(ACCOUNTS, accounts)
}

/**
 * udpate account info by id
 * eg: updateAccountInfo('1', 'name', 'newName')
 * @param id account id
 * @param key update key
 * @param value update value
 */
type Key = ACCOUNT.BALANCE | ACCOUNT.NAME
export const updateAccountInfo = async (id: string, key: Key, value: string) => {
  const preAccounts = await getAccounts()
  const accounts = preAccounts.map(account => {
    if (account.id === id) {
      account[key] = value
    }
    return account
  })
  setData('accounts', accounts)
}

/**
 * get all transactions
 */
export const getTx = async (): Promise<TransactionObj[]> => {
  try {
    const txs = (await getData(TRANSACTIONS)) || []
    return txs as TransactionObj[]
  } catch (_) {
    return []
  }
}

/**
 * get tx by address
 */
export const getTxByAddress = async (address: string): Promise<TransactionObj[]> => {
  const allTxs = (await getTx()) || []
  const txs = allTxs.filter(tx => {
    // TODO with subscribe tx
    if (tx.from === address) {
      return true
    }
    return false
  })
  return txs
}

/**
 * insert a new tx to storage
 */
export const insertTx = async (tx: TransactionObj) => {
  const preTxs = await getTx()
  preTxs.push(tx)
  setData(TRANSACTIONS, preTxs)
}

/**
 * update tx status
 */
export const updateTxStatus = async (txHash: string, status: string) => {
  const preTxs = await getTx()
  const txs = preTxs.map(tx => {
    if (tx.transactionHash === txHash) {
      tx.status = status
    }
    return tx
  })
  setData(TRANSACTIONS, txs)
}

export const getWhiteList = async (): Promise<string[]> => {
  try {
    const txs = (await getData(WHITE_LIST)) || []
    return txs as string[]
  } catch (_) {
    return []
  }
}

export const addWhiteList = async (appName: string) => {
  const whiteList = await getWhiteList()
  whiteList.push(appName)
  setData(WHITE_LIST, whiteList)
}

export const isApproved = async (appName: string): Promise<boolean> => {
  const whiteList = await getWhiteList()
  return whiteList.includes(appName)
}

export const clear = () => {
  storage.clear()
}
