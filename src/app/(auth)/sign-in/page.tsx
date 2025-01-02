"use client";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { resend } from "@/lib/resend";
const SignInPage = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // Zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setSubmitting(true)
    const response = await signIn('credentials',{
      redirect:false,
      identifier: data.identifier,
      password: data.password,
    })
    if(response?.error){
      if(response?.error == 'credentialsSignIn'){
        toast({
          title:"Login Failed",
          description:"incorrect username or password",
          variant:'destructive'
        })
      }else{
        toast({
          title:"Login Error",
          description:`incorrect username or password ${response?.error}`,
          variant:'destructive'
        })
      }
    }
    console.log(response,"sign In");
    if(response?.url){
      router.replace('/dashboard')
    }
    setSubmitting(false)
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4"><span className="font-bold">Sign Up</span> to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center rounded-md">{isSubmitting?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> <span>please wait...</span></>:('SignIn')}</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 ml-1.5">signUp</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
