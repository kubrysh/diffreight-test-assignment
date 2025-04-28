import Transaction from '#models/transaction'
import { TransactionData } from '#types/transaction'
import RedisService from './redis.service.js'
import BankAccountService from '#services/bank_account/bank_account.service'

class DatabaseService {
  // Get transaction by ID
  public async getTransactionById(id: number): Promise<Transaction> {
    return await Transaction.findOrFail(id)
  }

  // Get all subsequent transaction starting from ID (including)
  public async getTransactionsFromId(startId: number): Promise<Transaction[]> {
    return await Transaction.query().where('id', '>=', startId).orderBy('id', 'asc')
  }

  // Batch update transactions
  public async updateTransactions(transactions: TransactionData[]): Promise<void> {
    const batchSize = 1000
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      await Transaction.query()
        .whereIn(
          'id',
          batch.map((t: TransactionData) => t.id)
        )
        .update((builder: any) => {
          batch.forEach((t: TransactionData) => {
            builder.orWhere((q: any) => {
              q.where('id', t.id).update({
                price: t.price,
                balanceAfter: t.balanceAfter,
              })
            })
          })
        })
    }
  }

  // Update bank account balance
  public async updateBankAccountBalance(balance: number): Promise<void> {
    await BankAccountService.updateBalance(balance)
  }

  // Save updated transactions from Redis back to database
  public async saveTransactionsToDatabase(): Promise<void> {
    const keys = await RedisService.getTransactionKeys()
    const transactions = await RedisService.getTransactions(keys)

    // Update transactions in database
    await this.updateTransactions(transactions)

    // Update bank account balance with the last transaction's balance
    if (transactions.length > 0) {
      const lastTransaction = transactions[transactions.length - 1]
      await this.updateBankAccountBalance(lastTransaction.balanceAfter)
    }
  }
}

export default new DatabaseService()
