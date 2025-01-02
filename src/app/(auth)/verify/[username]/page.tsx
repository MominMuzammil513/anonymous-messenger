"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const VerifyPage = () =>{
  const [loading,setLoading] = useState(false)
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        // defaultValues: {

        // }
      });
      const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
        setLoading(true)
        try {
            const response = await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
            })
            toast({
                title: 'Verify code successfully',
                description: response.data.message
            })
            router.replace('/sign-in')
            setLoading(false)
        } catch (error) {
          setLoading(false)
            console.error("Error with user sign-up", error);
      const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError.message);
          let errorMessage = axiosError.response?.data.message
          toast({
            title:"verification failed",
            description: errorMessage,
            variant: "destructive"
          })
        }
      }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code send to your email</p>
        </div>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" autoComplete="off" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full flex justify-center items-center rounded-md">
                {loading?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> <span>please wait...</span></>:('verify')}
                </Button>
          </form>
        </Form>
      </div>
    </div>
    )
}
export default VerifyPage