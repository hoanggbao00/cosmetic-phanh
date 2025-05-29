import { redirect } from "next/navigation"

export default function RedirectProductPage() {
  return redirect("/catalog")
}
