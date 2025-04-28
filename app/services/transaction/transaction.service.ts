import RedisService from './redis.service.js'
import DatabaseService from './database.service.js'

class TransactionService {
  public async updatePrice(transactionId: number, newPrice: number) {
    // Get the transaction to update
    const transaction = await DatabaseService.getTransactionById(transactionId)
    const oldPrice = transaction.price

    // Calculate the delta (difference between new and old price)
    const delta = newPrice - oldPrice

    // Load transactions into Redis starting from the edited transaction
    await RedisService.loadTransactions(transactionId)

    // Update balances in Redis
    await RedisService.updateTransactionBalances(transactionId, delta)

    // Save updated transactions back to database
    await DatabaseService.saveTransactionsToDatabase()

    // Clear Redis keys
    await RedisService.clearTransactionKeys()

    // Return the updated transaction
    return await DatabaseService.getTransactionById(transactionId)
  }
}

export default new TransactionService()
