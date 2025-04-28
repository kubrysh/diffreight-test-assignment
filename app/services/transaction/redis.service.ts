import redis from '@adonisjs/redis/services/main'
import DatabaseService from './database.service.js'
import { TransactionData } from '#types/transaction'

class RedisService {
  // Load transactions from database into Redis
  public async loadTransactions(startId: number): Promise<void> {
    const transactions = await DatabaseService.getTransactionsFromId(startId)

    const pipeline = redis.pipeline()

    for (const transaction of transactions) {
      pipeline.hset(`transaction:${transaction.id}`, {
        id: transaction.id,
        price: transaction.price,
        balanceAfter: transaction.balanceAfter,
        type: transaction.type,
      })
    }

    await pipeline.exec()
  }

  // Update transaction balances in Redis
  public async updateTransactionBalances(startId: number, delta: number): Promise<void> {
    const keys = await this.getTransactionKeys()
    const pipeline = redis.pipeline()

    for (const key of keys) {
      const id = Number.parseInt(key.split(':')[1])
      if (id >= startId) {
        pipeline.hincrbyfloat(key, 'balanceAfter', delta)
      }
    }

    await pipeline.exec()
  }

  // Get all transaction keys from Redis
  public async getTransactionKeys(): Promise<string[]> {
    return await redis.keys('transaction:*')
  }

  // Get transactions from Redis by keys
  public async getTransactions(keys: string[]): Promise<TransactionData[]> {
    const pipeline = redis.pipeline()

    for (const key of keys) {
      pipeline.hgetall(key)
    }

    const results = await pipeline.exec()
    if (!results) return []

    const transactions = []
    for (const [error, result] of results) {
      if (error || !result) continue

      const transaction = result as Record<string, string>
      transactions.push({
        id: Number.parseInt(transaction.id),
        price: Number.parseFloat(transaction.price),
        balanceAfter: Number.parseFloat(transaction.balanceAfter),
        type: transaction.type,
      })
    }

    return transactions
  }

  // Clear all transaction keys from Redis
  public async clearTransactionKeys(): Promise<void> {
    const keys = await this.getTransactionKeys()
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}

export default new RedisService()
