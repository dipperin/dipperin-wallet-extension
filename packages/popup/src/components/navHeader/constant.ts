import { APP_STATE } from '@dipperin/lib/constants'

const { ACCOUNT_PAGE, SEND_PAGE, CREATE_ACCOUNT_PAGE, SETTING_PAGE, TX_RECORD } = APP_STATE

export const PAGE_NANE_DIC = {
  'zh-CN': {
    [ACCOUNT_PAGE]: '账户',
    [SEND_PAGE]: '发送',
    [SETTING_PAGE]: '设置',
    [CREATE_ACCOUNT_PAGE]: '新账户',
    [TX_RECORD]: '交易记录'
  },
  'en-US': {
    [ACCOUNT_PAGE]: 'Account',
    [SEND_PAGE]: 'Send',
    [SETTING_PAGE]: 'Setting',
    [CREATE_ACCOUNT_PAGE]: 'New Account',
    [TX_RECORD]: 'Transaction Record'
  }
}
