import { StarIcon } from "@/assets/icons/star-icon";

export function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center pt-28">
      <StarIcon className="size-20 animate-spin text-primary" />
    </div>
  );
}
