import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'
import Transaction from '#models/transaction'
import BankAccount from '#models/bank_account'
import { INITIAL_BALANCE } from './bank_account_seeder.js'

export default class extends BaseSeeder {
  async run() {
    let currentBalance = INITIAL_BALANCE
    const transactions = []

    // Start date - year ago
    let currentDate = DateTime.now().minus({ years: 1 })

    // Evenly distribute transactions over the year
    const timeIncrement = Math.floor((365 * 24 * 60) / 10000)

    // Generate transactions
    for (let i = 0; i < 10000; i++) {
      const type = faker.helpers.arrayElement(['income', 'expense'])

      const price = faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })

      if (type === 'income') {
        currentBalance += price
      } else {
        currentBalance -= price
      }

      transactions.push({
        date: currentDate,
        type,
        price,
        balanceAfter: currentBalance,
      })

      // Increment date for the next transaction
      currentDate = currentDate.plus({ minutes: timeIncrement })
    }

    // Push to db in batches
    const batchSize = 1000
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      await Transaction.createMany(batch)
    }

    // Update bank account balance
    const bankAccount = await BankAccount.firstOrFail()
    bankAccount.balance = currentBalance
    await bankAccount.save()

    console.log('Seeded 10000 transactions and updated bank account balance')
  }
}
