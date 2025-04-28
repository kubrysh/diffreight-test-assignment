import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type TransactionType = 'income' | 'expense'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare date: DateTime

  @column()
  declare type: TransactionType

  @column()
  declare price: number

  @column()
  declare balanceAfter: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
