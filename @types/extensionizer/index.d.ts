interface Extensionizer {
  runtime: typeof chrome.runtime
  alarms: typeof chrome.alarms
  bookmarks: typeof chrome.bookmarks
  extension: typeof chrome.extension
  browserAction: typeof chrome.browserAction
  commands: typeof chrome.commands
  contextMenus: typeof chrome.contextMenus
  cookies: typeof chrome.cookies
  downloads: typeof chrome.downloads
  history: typeof chrome.history
  i18n: typeof chrome.i18n
  idle: typeof chrome.idle
  notifications: typeof chrome.notifications
  storage: typeof chrome.storage
  tabs: typeof chrome.tabs
  webNavigation: typeof chrome.webNavigation
  webRequest: typeof chrome.webRequest
  windows: typeof chrome.windows
}

declare var extensionizer: Extensionizer

declare module 'extensionizer' {
  const extensionizer: Extensionizer
  export default extensionizer
}
