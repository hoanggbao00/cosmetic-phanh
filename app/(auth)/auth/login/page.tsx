"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/form-fields/input-field";
import { useLogin } from "@/hooks/auth/useLogin";
import { APP_NAME } from "@/lib/config/app.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { type LoginSchema, defaultLoginValues, loginSchema } from "./schema";

const LoginPage = () => {
  const form = useForm<LoginSchema>({
    defaultValues: defaultLoginValues,
    resolver: zodResolver(loginSchema),
  });

  const { handleLogin, loading } = useLogin();

  const onSubmit = (data: LoginSchema) => {
    handleLogin({ email: data.email, password: data.password });
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='grid h-full w-full p-4 lg:grid-cols-2'>
        <div className='m-auto flex w-full max-w-xs flex-col items-center'>
          <p className='mt-4 mb-6 text-center font-bold text-xl tracking-tight'>
            Log in to <br /> {APP_NAME}
          </p>

          <Form {...form}>
            <form className='w-full space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
              <InputField
                control={form.control}
                name='email'
                label='Email'
                type='email'
                placeholder='Email'
                startIcon={MailIcon}
                disabled={loading}
              />
              <InputField
                control={form.control}
                name='password'
                label='Password'
                type='password'
                placeholder='Password'
                startIcon={LockIcon}
                disabled={loading}
              />
              <Button type='submit' className='mt-4 w-full' disabled={loading}>
                {loading && <Loader2Icon className='size-4 animate-spin' />} Continue with Email
              </Button>
            </form>
          </Form>

          <div className='mt-5 space-y-5'>
            <p className='text-center text-sm'>
              Don&apos;t have an account?
              <Link href='/auth/sign-up' className='ml-1 text-muted-foreground underline'>
                Create account
              </Link>
            </p>
          </div>
        </div>
        <div className='hidden rounded-lg bg-muted lg:block' />
      </div>
    </div>
  );
};

export default LoginPage;
