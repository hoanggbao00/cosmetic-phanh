import {
  createVoucher,
  deleteVoucher,
  getVoucherByCode,
  getVoucherById,
  getVouchers,
  updateVoucher,
  validateVoucher,
} from "@/actions/vouchers"
import type { VoucherInsert, VoucherUpdate } from "@/types/tables/vouchers"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = "vouchers"

export const useVoucherQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getVouchers,
  })
}

export const useVoucherQueryById = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getVoucherById(id!),
    enabled: !!id && id !== "new",
  })
}

export const useVoucherQueryByCode = (code: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, "code", code],
    queryFn: () => getVoucherByCode(code!),
    enabled: !!code,
  })
}

export const useCreateVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (voucher: VoucherInsert) => createVoucher(voucher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Voucher created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, voucher }: { id: string; voucher: VoucherUpdate }) =>
      updateVoucher(id, voucher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Voucher updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success("Voucher deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useValidateVoucher = () => {
  return useMutation({
    mutationFn: ({ code, userId }: { code: string; userId?: string }) =>
      validateVoucher(code, userId),
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
