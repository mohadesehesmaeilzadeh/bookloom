import { BOOK_STATUS } from '../../constants/bookStatuses'

export function createPurchaseConversionPayload(purchaseValues) {
  return {
    status: BOOK_STATUS.OWNED,
    purchaseDate: purchaseValues.purchaseDate,
    price: purchaseValues.price,
    purchaseStore: purchaseValues.purchaseStore,
  }
}
