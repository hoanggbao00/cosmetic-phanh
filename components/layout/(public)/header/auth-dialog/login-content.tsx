import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export const LoginContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <form className="flex flex-col gap-4" id="login-form">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" placeholder="Email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input type="password" placeholder="Password" />
        </div>
      </form>
    </motion.div>
  )
}
