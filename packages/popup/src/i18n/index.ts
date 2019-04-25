export const zhCN = {
  extension: {
    setting: {
      setting: '设置',
      network: '网络',
      mercury: '水星',
      testNet: '测试网',
      languages: '语言',
      enUS: '英语（美式）',
      zhCN: '简体中文',
      reset: '重置钱包'
    },
    account: {
      send: '发送交易',
      copySuccess: '复制成功',
      accountNameLimit: '账户名称不能超过10个中文或20个英文字符',
      accountName: '账户名称',
      cancel: '取消',
      confirm: '确认',
      myAccounts: '我的账户'
    },
    send: {
      accountBalance: '账户余额',
      receinerAddress: '接收地址',
      amount: '交易数额',
      poundage: '手续费',
      moreThan: '大于',
      send: '发送',
      errorAddress: '请输入接收地址！',
      errorAmount: '请输入交易金额！',
      errorPoundage: '请输入手续费！',
      errorBalance: '您的账户余额不足！',
      sendSuccess: '交易发送成功，请等待同步!',
      errorFrequent: '您的操作过于频繁，请10秒后再尝试操作！',
      lowFee: '当前网络繁忙，请提高手续费或等待10秒后再操作！',
      officialAddress: '官方地址',
      betAmount: '下注金额',
      betNumber: '下注对象',
      authTip: '该应用请求授权，是否同意？'
    },
    wallet: {
      importWallet: '导入钱包',
      createWallet: '创建钱包',
      inputMnemonic: '请输入用于恢复钱包的助记词',
      setPassword: '设置密码',
      atLeast: '至少8个字符',
      repeatPassword: '确认密码',
      cancel: '取消',
      confirm: '确认',
      backupTips:
        '我们强烈建议您将助记词记录在纸上，放置在一个安全的地方。任何人得到这些助记词都可以进入您的钱包使用您的资产！您将在下一步中确认助记词。',
      backupConfirm: '请按顺序选择助记词',
      unlockWallet: '解锁钱包',
      password: '密码',
      shortPassword: '密码过短，请重新设定！',
      notSamePassword: '两次输入密码不一致，请重新输入！'
    }
  }
}

export type I18nCollection = typeof zhCN

export const enUS: I18nCollection = {
  extension: {
    setting: {
      setting: 'setting',
      network: 'Network',
      mercury: 'mercury',
      testNet: 'test net',
      languages: 'Languages',
      enUS: 'en-US',
      zhCN: 'zh-CN',
      reset: 'Reset DipLink'
    },
    account: {
      send: 'Send',
      copySuccess: 'Replicating Success!',
      accountNameLimit: 'The account name is limited to 10 characters or 20 letter.',
      accountName: 'Account Name',
      cancel: 'Cancel',
      confirm: 'Confirm',
      myAccounts: 'My Accounts'
    },
    send: {
      accountBalance: 'Account Balance',
      receinerAddress: "Receiner's Address",
      amount: 'Amount',
      poundage: 'Poundage',
      moreThan: 'more than',
      send: 'Send',
      errorAddress: "You have to input receiner's address!",
      errorAmount: 'You have to input the amount!',
      errorPoundage: 'You have to input the poundage!',
      errorBalance: 'Your balance is not enough!',
      sendSuccess: 'Send Success, please wait for synchronization!',
      errorFrequent: 'Your action is too frequent, please try 10s later.',
      lowFee: 'Net is busy，please increase poundage or try 10s later',
      officialAddress: 'official address',
      betAmount: 'Bet Amount',
      betNumber: 'Bet Number',
      authTip: 'Request authorization, do you agree?'
    },
    wallet: {
      importWallet: 'Import Wallet',
      createWallet: 'Create Wallet',
      inputMnemonic: 'Please input mnemonic phrase to recovery your account.',
      setPassword: 'Set Password',
      atLeast: 'at least 8 characters',
      repeatPassword: 'Repeat Password',
      cancel: 'Cancel',
      confirm: 'Confirm',
      backupTips:
        'We highly recommend you write down the mnemonic words on paper and keep it in a safe place. Anyone who gets it can access and spend your assets. You will have to confirm the mnemonic on the next step.',
      backupConfirm: 'Please select mnemonic words in correct order.',
      unlockWallet: 'Unlock Wallet',
      password: 'Password',
      shortPassword: 'Your password is too short!',
      notSamePassword: 'The first password is not equal to the second password!'
    }
  }
}

export const i18n = {
  'zh-CN': zhCN,
  'en-US': enUS
}
