"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { LoginContent } from "./login-content";
import { SignUpContent } from "./sign-up-content";

export type AuthType = "login" | "signup";

export default function AuthDialog() {
  const [authType, setAuthType] = useState<AuthType>("login");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setAuthType("login");
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className='cursor-pointer transition-colors duration-300 hover:text-primary'>
          <UserIcon className='size-4 md:size-6' />
        </div>
      </DialogTrigger>
      <DialogContent className='!rounded-3xl overflow-hidden border-none bg-accent shadow-none sm:max-w-sm'>
        <DialogHeader className='border-border border-b pb-4'>
          <DialogTitle className='flex items-center justify-center'>
            <img src='/images/logo-with-text.png' alt='logo' width={50} height={50} />
          </DialogTitle>
          <DialogDescription className='text-center'>
            Login to get more discounts and rewards
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode='wait' key={authType}>
          {authType === "login" && <LoginContent />}
          {authType === "signup" && <SignUpContent />}
        </AnimatePresence>
        <DialogFooter className='mt-4 sm:flex-col'>
          <Button
            className='w-full rounded-full'
            size='sm'
            effect='expandIcon'
            icon={ArrowRightIcon}
            iconPlacement='right'
            type='submit'
            form={authType === "login" ? "login-form" : "signup-form"}
          >
            {authType === "login" ? "Login" : "Continue"}
          </Button>
          <AnimatePresence mode='wait' key={`${authType}-footer`}>
            {authType === "login" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className='flex items-center justify-center gap-2'
                key={`${authType}-footer-login`}
              >
                <div className='h-px w-full bg-border' />
                <p className='text-muted-foreground text-xs'>Or</p>
                <div className='h-px w-full bg-border' />
              </motion.div>
            )}

            {authType === "login" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                key={`${authType}-footer-signup`}
              >
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full rounded-full'
                  onClick={() => setAuthType("signup")}
                >
                  Sign up
                </Button>
              </motion.div>
            )}

            {authType === "signup" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className='mt-4 flex items-center justify-center gap-1 text-muted-foreground text-xs'
                key={`${authType}-footer-login-switch`}
              >
                <p>Already have an account?</p>
                <button
                  type='button'
                  onClick={() => setAuthType("login")}
                  className='cursor-pointer text-black transition-colors duration-300 hover:text-primary'
                >
                  Go to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
