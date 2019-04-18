import { APP_STATE } from '@dipperin/lib/constants'

const { ACCOUNT_PAGE, SEND_PAGE, CREATE_ACCOUNT_PAGE, SETTING_PAGE } = APP_STATE

export const PAGE_NANE_DIC = {
  'zh-CN': {
    [ACCOUNT_PAGE]: '账户',
    [SEND_PAGE]: '发送',
    [SETTING_PAGE]: '设置',
    [CREATE_ACCOUNT_PAGE]: '新账户'
  },
  'en-US': {
    [ACCOUNT_PAGE]: 'Account',
    [SEND_PAGE]: 'Send',
    [SETTING_PAGE]: 'Setting',
    [CREATE_ACCOUNT_PAGE]: 'New Account'
  }
}
