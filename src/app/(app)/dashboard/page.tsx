// "use client"
// import MessageCard from "@/components/MessageCard"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/components/ui/use-toast"
// import { Message, User } from "@/model/User"
// import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
// import { ApiResponse } from "@/types/ApiResponse"
// import { zodResolver } from "@hookform/resolvers/zod"
// import axios, { AxiosError } from "axios"
// import { Loader2, RefreshCcw } from "lucide-react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useCallback, useEffect, useState } from "react"
// import { useForm } from "react-hook-form"


// const Dashboard = () =>{
//     const [messages,setMessages] = useState<Message[]>([])
//     const [loading,setLoading] = useState(false)
//     const [switchLoading,setSwitchLoading] = useState(false)
//     const router = useRouter()
//     const {toast} = useToast()
//     const handleDeleteMessage = async (messageId: string) => {
//         setLoading(true);
//         try {
//             const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
//             if (response.data.success && response.status === 200) {
//                 // Update messages after successful deletion
//                 setMessages(prevMessages => prevMessages.filter(m => m._id !== messageId));
//                 toast({
//                     title: "Message Deleted",
//                     description: response.data.message,
//                     variant: "default"
//                 });
//             } else {
//                 toast({
//                     title: "Error deleting message",
//                     description: response.data.message || "Failed to delete message",
//                     variant: "destructive"
//                 });
//             }
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>;
//             toast({
//                 title: "Error deleting message",
//                 description: axiosError.response?.data.message || "Failed to delete message",
//                 variant: "destructive"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const session = useSession()
//     console.log(session,"Session");
//     const form = useForm({
//         resolver:zodResolver(acceptMessageSchema)
//     })
//     const {register,watch,setValue}=form
//     const acceptMessage = watch('acceptMessage')
//     const fetchAcceptMessage = useCallback(async ()=>{
//         setLoading(true)
//         try {
//             const response = await axios.get<ApiResponse>('/api/accept-messages')
//             setValue('acceptMessage',response.data.isAcceptingMessage)
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast({
//                 title: 'Error fetching accept messages',
//                 description: axiosError.response?.data.message || "Failed to fetch message settings",
//                 variant:"destructive"
//             })
//         }finally{
//             setLoading(false)
//         }
//     },[setValue, toast])
    
//     const fetchMessages = useCallback(async (refresh: boolean = false) => {
//         setLoading(true);
//         setSwitchLoading(true);
//         try {
//             const response = await axios.get<ApiResponse>('/api/get-messages');
//             console.log(response.data, "GET messages", response.data.messages, response.data.success);  
//             if (response.data.success) {
//                 setMessages(response.data.messages || []);
//                 if (refresh) {
//                     toast({
//                         title: "Refreshed Messages",
//                         description: "Showing Latest Messages",
//                         variant: "default"
//                     });
//                 }
//             } else {
//                 toast({
//                     title: 'Error fetching all messages',
//                     description: response.data.message || "Failed to fetch All Messages",
//                     variant: "destructive"
//                 });
//             }
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>;
//             toast({
//                 title: 'Error fetching all messages',
//                 description: axiosError.response?.data.message || "Failed to fetch All Messages",
//                 variant: "destructive"
//             });
//         } finally {
//             setLoading(false);
//             setSwitchLoading(false);
//         }
//     }, [toast]);
    
//     useEffect(() => {
//         if (!session || !session.data || !session.data?.user) return;
//             fetchAcceptMessage();
//             fetchMessages(true);
//     }, [fetchAcceptMessage, fetchMessages, session]);
    

//     const handleSwitchChange = async() =>{
//         try {
//             const response = await axios.post<ApiResponse>('/api/accept-message',{
//                 acceptMessage:!acceptMessage
//             })
//             setValue('acceptMessage',!acceptMessage)
//             toast({
//                 title:"Accept Message",
//                 description:response.data.message,
//                 variant:'default'
//             })
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast({
//                 title: 'Error handleSwitchChange CCCCCCCCC',
//                 description: axiosError.response?.data.message || "handleSwitchChange",
//                 variant:"destructive"
//             })
//         }
//     }
//     const username= session.data?.user?.username
//     const baseUrl = `${window.location.protocol}//${window.location.host}`
//     console.log(baseUrl,"base url");
//     const profileUrl = `${baseUrl}/u/${username}`
//     const copyToClickBoard = ()=>{
//         navigator.clipboard.writeText(profileUrl)
//         toast({
//             title:"URL copied to clipboard",
//             description:"Profile URL has been copied to clipboard"
//         })
//     }
//     if(!session || !session.data || !session.data.user){
//         return <Button onClick={()=>router.replace('/sign-in')}>Please login</Button>
//     }
//     return(
//         <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//             <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
//             <div className="mb-4">
//                 <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
//                 <div className="flex items-center">
//                     <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2"/>
//                     <Button onClick={copyToClickBoard}>Copy</Button>
//                 </div>
//             </div>
//             <div className="ml-2">
//             <Switch {...register('acceptMessages')}
//                 checked={acceptMessage}
//                 onCheckedChange={handleSwitchChange}
//                 disabled={switchLoading}
//                 />
//                 <span className="ml-2">
//                     Accept Messages: {acceptMessage?'on':'off'}
//                 </span>
//             </div>
//             <Separator />
//             <Button className="mt-4" variant="outline" onClick={(e)=>{
//                 e.preventDefault();
//                 fetchMessages(true)
//             }}>
//                 {loading?(
//                     <Loader2 className="h-4 w-4 animate-spin"/>
//                 ):(
//                     <RefreshCcw className="h-4 w-4"/>
//                 )}
//             </Button>
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {messages.length > 0 ? (
//                     messages.map((message,index) => <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />)
//                 ) : (
//                     <p>No messages available</p>
//                 )}
//             </div>
//         </div>
//     )
// }
// export default Dashboard
"use client"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Resend } from 'resend';

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [switchLoading, setSwitchLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleDeleteMessage = async (messageId: string) => {
        setLoading(true);
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
            if (response.data.success && response.status === 200) {
                // Update messages after successful deletion
                setMessages(prevMessages => prevMessages.filter(m => m._id !== messageId));
                toast({
                    title: "Message Deleted",
                    description: response.data.message,
                    variant: "default"
                });
            } else {
                toast({
                    title: "Error deleting message",
                    description: response.data.message || "Failed to delete message",
                    variant: "destructive"
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error deleting message",
                description: axiosError.response?.data.message || "Failed to delete message",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const session = useSession()
    console.log(session, "Session");
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = form
    const acceptMessage = watch('acceptMessage')

    const fetchAcceptMessage = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessage', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error fetching accept messages',
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }, [setValue, toast])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            console.log(response.data, "GET messages", response.data.messages, response.data.success);
            if (response.data.success) {
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: "Refreshed Messages",
                        description: "Showing Latest Messages",
                        variant: "default"
                    });
                }
            } else {
                toast({
                    title: 'Error fetching all messages',
                    description: response.data.message || "Failed to fetch All Messages",
                    variant: "destructive"
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error fetching all messages',
                description: axiosError.response?.data.message || "Failed to fetch All Messages",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setSwitchLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!session || !session.data || !session.data?.user) return;
        fetchAcceptMessage();
        fetchMessages(true);
    }, [fetchAcceptMessage, fetchMessages, session]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessage: !acceptMessage
            })
            setValue('acceptMessage', !acceptMessage)
            toast({
                title: "Accept Message",
                description: response.data.message,
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error handling switch change',
                description: axiosError.response?.data.message || "handleSwitchChange",
                variant: "destructive"
            })
        }
    }

    const username = session.data?.user?.username
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
    const profileUrl = `${baseUrl}/u/${username}`
    
    const copyToClickBoard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(profileUrl)
            toast({
                title: "URL copied to clipboard",
                description: "Profile URL has been copied to clipboard"
            })
        }
    }
  if (!session || !session.data || !session.data.user) {
      // router.push('/sign-in')
      return <><Button onClick={() => router.replace('/sign-in')}>Please login</Button>
      {/* <Button onClick={sendEmail}>Send Email</Button> */}
      </>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
                <div className="flex items-center">
                    <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
                    <Button onClick={copyToClickBoard}>Copy</Button>
                </div>
            </div>
            <div className="ml-2">
                <Switch {...register('acceptMessages')}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={switchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? 'on' : 'off'}
                </span>
            </div>
            <Separator />
            <Button className="mt-4" variant="outline" onClick={(e) => {
                e.preventDefault();
                fetchMessages(true)
            }}>
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 flex flex-col border-2 p-6 rounded-2xl justify-start gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => <MessageCard isSent={true} key={message._id} message={message} onMessageDelete={handleDeleteMessage} />)
                ) : (
                    <p>No messages available</p>
                )}
            </div>
        </div>
    )
}
export default Dashboard