import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from "../ui/select"

export default function Select({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
}: {
  options: { label: string; value: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  className?: string
}) {
  return (
    <ShadcnSelect value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  )
}
