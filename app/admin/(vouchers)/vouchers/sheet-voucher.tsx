"use client"

import DatePicker from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreateVoucher, useUpdateVoucher, useVoucherQuery } from "@/queries/voucher"
import type { VoucherInsert } from "@/types/tables/vouchers"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.number().min(0, "Value must be positive"),
  minimum_order_amount: z.number().nullable(),
  maximum_discount_amount: z.number().nullable(),
  usage_limit: z.number().nullable(),
  user_usage_limit: z.number().min(1, "User usage limit must be at least 1"),
  is_active: z.boolean(),
  starts_at: z.string(),
  expires_at: z.string().nullable(),
})

interface SheetVoucherProps {
  id: string | null
  handleClose: () => void
}

export default function SheetVoucher({ id, handleClose }: SheetVoucherProps) {
  const { data } = useVoucherQuery()
  const { mutate: createVoucher } = useCreateVoucher()
  const { mutate: updateVoucher } = useUpdateVoucher()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: null,
      type: "percentage",
      value: 0,
      minimum_order_amount: null,
      maximum_discount_amount: null,
      usage_limit: null,
      user_usage_limit: 1,
      is_active: true,
      starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expires_at: null,
    },
  })

  useEffect(() => {
    if (id && id !== "new" && data) {
      const voucher = data.find((v: { id: string }) => v.id === id)
      if (voucher) {
        form.reset({
          code: voucher.code,
          name: voucher.name,
          description: voucher.description,
          type: voucher.type,
          value: voucher.value,
          minimum_order_amount: voucher.minimum_order_amount,
          maximum_discount_amount: voucher.maximum_discount_amount,
          usage_limit: voucher.usage_limit,
          user_usage_limit: voucher.user_usage_limit,
          is_active: voucher.is_active,
          starts_at: voucher.starts_at,
          expires_at: voucher.expires_at,
        })
      }
    }
  }, [id, data, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const voucherData: VoucherInsert = {
      ...values,
      minimum_order_amount: values.minimum_order_amount || null,
      maximum_discount_amount: values.maximum_discount_amount || null,
      usage_limit: values.usage_limit || null,
      expires_at: values.expires_at || null,
    }

    if (id === "new") {
      createVoucher(voucherData)
    } else if (id) {
      updateVoucher({ id, voucher: voucherData })
    }

    handleClose()
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{id === "new" ? "Add Voucher" : "Edit Voucher"}</SheetTitle>
        <SheetDescription>
          {id === "new"
            ? "Add a new voucher to the system."
            : "Edit an existing voucher's details."}
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 max-h-[calc(100vh-10rem)] space-y-4 overflow-y-auto px-4"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Sale 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Special discount for summer season"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="!h-10 w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minimum_order_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Order Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximum_discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per User Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="starts_at"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : new Date()}
                      onChange={(date) => {
                        field.onChange(date ? date.toISOString() : new Date().toISOString())
                      }}
                      className="!h-10 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.toISOString() : null)
                      }}
                      className="!h-10 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>Activate or deactivate this voucher</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  )
}
