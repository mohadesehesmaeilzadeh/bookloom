import { formatNumber } from './formatNumber'
import { LANGUAGE, getDocumentLanguage } from '../i18n/localization'

// Bookloom stores book prices in تومان. No currency conversion is applied.
export function formatPrice(value, options = {}) {
  const number = Number(value)

  if (!Number.isFinite(number) || number <= 0) {
    return ''
  }

  const language = options.language ?? getDocumentLanguage()
  const currencyLabel = language === LANGUAGE.EN ? 'tomans' : 'تومان'

  return `${formatNumber(number, options)} ${currencyLabel}`
}
