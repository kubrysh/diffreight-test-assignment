import { BaseSeeder } from '@adonisjs/lucid/seeders'
import BankAccount from '#models/bank_account'

export const INITIAL_BALANCE = 100_000_000
const ACCOUNT_NAME = 'Main Account'

export default class extends BaseSeeder {
  async run() {
    await BankAccount.create({
      accountName: ACCOUNT_NAME,
      balance: INITIAL_BALANCE,
    })
  }
}
