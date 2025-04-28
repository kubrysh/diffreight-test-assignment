import BankAccount from '#models/bank_account'

class BankAccountService {
  // Update balance
  public async updateBalance(balance: number): Promise<void> {
    const bankAccount = await BankAccount.firstOrFail()
    bankAccount.balance = balance
    await bankAccount.save()
  }
}

export default new BankAccountService()
