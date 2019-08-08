export enum APP_STATE {
  HAS_NO_WALLET, // has no wallet, create or import page
  LOCKED_WALLET, // wallet locked, unlock page
  BET_APPROVE, // bet approve page
  ACCOUNT_PAGE,
  SEND_PAGE,
  SETTING_PAGE,
  IMPORT_WALLET_PAGE,
  SET_PASSWORD,
  BACKUP_PAGE,
  BACKUP_CONFIRM,
  CREATE_ACCOUNT_PAGE,
  DAPP_SEND_PAGE,
  DAPP_AUTH,
  TX_RECORD
}
export const AUTO_LOCK_WALLET = 1000 * 60 * 10
export const NUMBER_ZERO = 0
export const EMPTY_STRING = ''

/**
 * timer
 */
export const LOG_LEVEL = 5

// export const HOST = 'http://10.200.0.139:3035'
export const HOST = 'http://14.17.65.122:3035'

export const REMOTE_TEST = 'remoteTest'
export const REMOTE_MECURY = 'remoteMecury'
export const REMOTE_VENUS = 'remoteVenus'

export const NET_HOST_OBJ = {
  [REMOTE_TEST]: 'http://172.16.5.201:3035',
  [REMOTE_MECURY]: 'http://14.17.65.122:3035',
  [REMOTE_VENUS]: 'http://172.16.5.201:3035'
}

export const HAS_TEST_NET = false

export const DEFAULT_ERR_TIMES = NUMBER_ZERO // default wallet password error times
export const DEFAULT_LOCK_TIME = EMPTY_STRING // default lock time

/**
 * timer
 */
export enum TIMER {
  UPDATE_BALANCE = 'update-balance',
  UPDATE_NONCE = 'update-nonce',
  UPDATE_TX_STATUS = 'udpate-tx-status',
  UPDATE_BLOCK = 'update-block',
  CHECK_IS_CONNECTING = 'check-is-connecting',
  UPDATE_LOCK_BALANCE = 'update-lock-balance'
}

/**
 * account
 */
export const ACCOUNTS_PATH = `m/44'/709394'/0'/0`
export const DEFAULT_BALANCE = '0'
export const DEFAULT_NAME = 'account'
export const DEFAULT_NONCE = '0'
export const MAIN_NET = 'mercury'
export const TEST_NET = 'testNet'
export enum ACCOUNT {
  NAME = 'name',
  BALANCE = 'balace',
  LOCK_BALANCE = 'lockBalance'
}

/**
 * transaction
 */
export const DEFAULT_TX_FEE = '0'
export const DEFAULT_HASH_LOCK = ''
export const DEFAULT_CHAIN_ID = '0x01'
export const DEFAULT_ACTIVE_ACCOUNT_ID = '1'

export const TRANSACTION_STATUS_PENDING = 'pending'
export const TRANSACTION_STATUS_SUCCESS = 'success'
export const TRANSACTION_STATUS_FAIL = 'fail'

export const TRANSACTION_LIMIT_TIME = 600000
export const ORIGIN_FEE = 0.00001

/**
 * storage key
 */
export const WALLET = 'wallet'
export const ACCOUNTS = 'accounts'
export const TRANSACTIONS = 'transactions'
export const WHITE_LIST = 'whiteList'
export const ACTIVE_ACCOUNT_ID = 'activeAccountId'

/**
 * services & store event
 */
export const SEND_APP_STATE = 'sendAppState'

/**
 * services receive
 */
export const GET_APP_STATE = 'getAppState'
export const SET_APP_STATE = 'setAPPState'
export const SET_PASSWORD = 'setPassword'
export const GET_MNEMONIC = 'getMnemonic'
export const CREATE_WALLET = 'createWallet'
export const IMPORT_WALLET = 'importWallet'
export const UNLOCK_WALLET = 'unlockWalelt'
export const GET_ACCOUNTS = 'getAccounts'
export const GET_ACTIVE_ACCOUNT = 'getActiveAccount'
export const ADD_ACCOUNT = 'addAccount'
export const CHANGE_ACTIVE_ACCOUNT = 'changeActiveAccount'
export const UPDATE_ACCOUNT_NAME = 'editAccountName'
export const DELETE_ACCOUNT = 'deleteAccount'
export const GET_MIN_TRANSACTION_FEE = 'getMinTransactionFee'
export const GET_ESTIMATE_GAS = 'getEstimateGas'
export const SEND_TRANSACTION = 'sendTransaction'
export const GET_TRANSACTIONS = 'getTransactions'
export const RESET_WALLET = 'resetWallet'
export const CHANGE_NET = 'changeNet'
export const GET_CURRENT_NET = 'getCurrentNet'
export const GET_APP_NAME = 'getAppName'
// popup for app
export const APP_SEND = 'appSend'
export const GET_APP_TX = 'getAppTx'

/**
 * popup receive
 */
export const POPUP_GET_APP_STATE = 'getAppState'
export const UPDATE_ACCOUNT_BALANCE = 'updateAccountBalance' // for both store event name and channel message's action name
export const UPDATE_ACCOUNT_LOCK_BALANCE = 'updateAccountLockBalance'
export const UPDATE_TX_STATUS = 'udpateTxStatus' // for both store event name and channel message's action name

/**
 * pagehook
 */
export const IS_APPROVED = 'isApproved'
export const APP_APPROVE = 'betApprove' // for both popup to backgroundscript and pagehook to backgroundScript
export const APPROVE_SUCCESS = 'approveSuccess'
export const GET_ACTIVE_ACCOUNT_ADDRESS = 'getActiveAccountAddress'
export const CHNAGE_ACTIVE_ACCOUNT = 'changeActiveAccount'
export const SEND = 'send'
export const SEND_SUCCESS = 'sendSuccess'
