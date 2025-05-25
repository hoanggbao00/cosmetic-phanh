import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LanguageSelect = () => {
  return (
    <Select defaultValue='vi'>
      <SelectTrigger
        className='w-fit cursor-pointer border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
        size='sm'
      >
        <SelectValue placeholder='Language' />
      </SelectTrigger>
      <SelectContent className='border-none'>
        <SelectItem value='vi'>Vietnamese</SelectItem>
        <SelectItem value='en'>English</SelectItem>
      </SelectContent>
    </Select>
  );
};
