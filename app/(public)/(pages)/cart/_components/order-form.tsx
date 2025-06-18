import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/stores/cart-store"
import { useOrderStore } from "@/stores/order-store"
import type { OrderInsert } from "@/types/tables/orders"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import PaymentQRDialog from "./payment-qr-dialog"

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().nullable(),
  city: z.string().min(1, "City is required"),
  payment_method: z.enum(["cash", "bank_transfer"]),
})

export type FormValues = z.infer<typeof formSchema>

interface OrderFormProps {
  onSubmit: (
    data: OrderInsert,
    cartItems: {
      productId: string
      name: string
      variantId?: string
      variantName?: string
      price: number
      quantity: number
    }[]
  ) => Promise<{ orderId: string; total: number } | undefined>
  isLoading: boolean
}

export default function OrderForm({ onSubmit, isLoading }: OrderFormProps) {
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [orderAmount, setOrderAmount] = useState(0)
  const router = useRouter()
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const { total, items, clearCart } = useCartStore()

  const { addToHistory } = useOrderStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: "cash",
      phone: "",
      address_line2: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (data: FormValues) => {
    try {
      // Transform form data to match order schema
      const orderData: OrderInsert = {
        guest_email: data.email,
        status: "pending" as const,
        payment_status: "pending" as const,
        payment_method: data.payment_method,
        shipping_amount: 0,
        discount_amount: 0,
        total_amount: total,
        shipping_address: {
          full_name: data.full_name,
          address_line1: data.address_line1,
          address_line2: data.address_line2 || null,
          city: data.city,
          phone: data.phone,
        },
        customer_notes: "",
        admin_notes: "",
      }

      const result = await onSubmit(orderData, items)

      if (result) {
        // Add to order history
        addToHistory({
          orderId: result.orderId,
          total: result.total,
          status: "pending",
          paymentStatus: "pending",
          createdAt: new Date().toISOString(),
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            variantId: item.variantId,
            price: item.price,
            quantity: item.quantity,
          })),
        })

        // If no user ID, store order ID locally
        if (!orderData.user_id) {
          useOrderStore.getState().addLocalOrder(result.orderId)
        }

        if (data.payment_method === "bank_transfer") {
          setCurrentOrderId(result.orderId)
          setOrderAmount(result.total)
          setShowQRDialog(true)
        } else {
          // Clear cart items from both local storage and database
          await clearCart()
          // For cash payment, redirect to orders page
          router.push("/orders")
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone number"
                      {...field}
                      value={value || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        onChange(val || null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Shipping Address</h3>
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line2"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apt 4B"
                      {...field}
                      value={value || ""}
                      onChange={(e) => onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Payment Method</h3>
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer">VN Pay</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </Form>

      {currentOrderId && (
        <PaymentQRDialog
          isOpen={showQRDialog}
          onClose={() => setShowQRDialog(false)}
          orderId={currentOrderId}
          amount={orderAmount}
        />
      )}
    </>
  )
}
