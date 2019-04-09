import Consola from 'consola'
import { LOG_LEVEL } from '@dipperin/lib/constants'

export const backgroundLog = Consola.withTag('background-script').create({
  level: LOG_LEVEL
})

export const contentScriptLog = Consola.withTag('content-script').create({
  level: LOG_LEVEL
})

export const popupLog = Consola.withTag('popup').create({
  level: LOG_LEVEL
})

export const pageHookLog = Consola.withTag('page-hook').create({
  level: LOG_LEVEL
})
