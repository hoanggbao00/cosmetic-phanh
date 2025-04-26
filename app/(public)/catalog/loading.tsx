import { StarIcon } from "@/assets/icons/star-icon";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center pt-28">
      <StarIcon className="size-10 animate-spin text-primary" />
    </div>
  );
}
