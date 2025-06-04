export type Voucher = {
  id: string
  code: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  startDate: Date
  endDate: Date
  usageLimit?: number
  usageCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateVoucherInput = Omit<Voucher, "id" | "usageCount" | "createdAt" | "updatedAt">

export type UpdateVoucherInput = Partial<CreateVoucherInput>
