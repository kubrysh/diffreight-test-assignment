import vine from '@vinejs/vine'

export const updateTransactionValidator = vine.compile(
  vine.object({
    price: vine.number().min(0.01).max(100_000_000_000),
  })
)
