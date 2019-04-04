import Login from '@/containers/login'
import Unlock from '@/containers/unlock'
import Import from '@/containers/import'
import Accounts from '@/containers/accounts'
import Send from '@/containers/send'
import Settings from '@/containers/settings'
// import Create from '@/containers/create'
import CreateAccount from '@/containers/createAccount'
import DappSend from '@/containers/dappSend'
import Auth from '@/containers/auth'
import SetPassword from '@/containers/setPassword'
import Backup from '@/containers/backup'
import BackupConfirm from '@/containers/backupConfirm'

import { APP_STATE } from '@dipperin/lib/constants'

const {
  HAS_NO_WALLET,
  LOCKED_WALLET,
  ACCOUNT_PAGE,
  SEND_PAGE,
  SETTING_PAGE,
  IMPORT_WALLET_PAGE,
  SET_PASSWORD,
  BACKUP_PAGE,
  BACKUP_CONFIRM,
  CREATE_ACCOUNT_PAGE,
  DAPP_SEND_PAGE,
  DAPP_AUTH
} = APP_STATE

export const COMPONENT_DIC = {
  [HAS_NO_WALLET]: Login,
  [LOCKED_WALLET]: Unlock,
  [IMPORT_WALLET_PAGE]: Import,
  [ACCOUNT_PAGE]: Accounts,
  [SEND_PAGE]: Send,
  [SETTING_PAGE]: Settings,
  [CREATE_ACCOUNT_PAGE]: CreateAccount,
  [DAPP_SEND_PAGE]: DappSend,
  [DAPP_AUTH]: Auth,
  [SET_PASSWORD]: SetPassword,
  [BACKUP_PAGE]: Backup,
  [BACKUP_CONFIRM]: BackupConfirm
}
