import { t } from '../i18n/localization'

export const RESTORE_MODE = {
  REPLACE: 'replace',
  MERGE: 'merge',
}

export const restoreModes = [
  {
    value: RESTORE_MODE.MERGE,
    labelKey: 'restore.merge.label',
    descriptionKey: 'restore.merge.description',
  },
  {
    value: RESTORE_MODE.REPLACE,
    labelKey: 'restore.replace.label',
    descriptionKey: 'restore.replace.description',
  },
]

export function getRestoreModes(language) {
  return restoreModes.map((mode) => ({
    ...mode,
    description: t(mode.descriptionKey, undefined, language),
    label: t(mode.labelKey, undefined, language),
  }))
}
