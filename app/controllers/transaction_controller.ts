import type { HttpContext } from '@adonisjs/core/http'
import TransactionService from '#services/transaction/transaction.service'
import { updateTransactionValidator } from '#validators/transaction_validator'

export default class TransactionController {
  public async updatePrice({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateTransactionValidator)

      const transactionId = params.id

      const transaction = await TransactionService.updatePrice(transactionId, payload.price)
      return response.ok(transaction)
    } catch (error) {
      // Handle validation errors
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          errors: error.messages,
        })
      }

      return response.status(404).json({ message: 'Transaction not found' })
    }
  }
}
