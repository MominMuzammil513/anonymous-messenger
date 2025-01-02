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
const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const debounce = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();
  // Zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError.message);
          setUsernameMessage(
            axiosError.response?.data.message ??
              `Error checking username ===${axiosError.message}=====${axiosError.response}`
          );
        } finally {
          setCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setSubmitting(true);
    try {
      const apiResponse = await axios.post<ApiResponse>(`/api/sign-up`, data);
      console.log(`signUp: ${apiResponse}------${data}`);
      if (apiResponse.status === 200 && apiResponse.data.success) {
        toast({
          title: "Successfully signed up",
          description:apiResponse.data.message
        });
        router.replace(`/verify/${username}`)
      }
      setSubmitting(false);
    } catch (error) {
      console.error("Error with user sign-up", error);
      const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError.message);
          let errorMessage = axiosError.response?.data.message
          toast({
            title:"SignUp failed",
            description: errorMessage,
            variant: "destructive"
          })
          setSubmitting(false);
    }
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
              name="username"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="username" autoComplete="off" {...field} onChange={(e)=>{
                      field.onChange(e)
                      debounce(e.target.value)
                    }}/>
                  </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin w-4 h-4"/>}
                    <p className={`text-sm ${usernameMessage==='Username is available'?'text-green-500':'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field}/>
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
            <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center rounded-md">{isSubmitting?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> <span>please wait...</span></>:('SignUp')}</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 ml-1.5">signIn</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
