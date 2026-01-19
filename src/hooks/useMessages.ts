import ApiWeb from "@/api/ApiWeb";
import type { SendEmail } from "@/interfaces/message.interfaces";
// import { useAppDispatch } from "@/redux/hook/useRedux";
// import { useAppDispatch } from "@/redux/hook/useRedux";


export const useMessages =()=>{
     
    //   const dispatch = useAppDispatch();

      const SendMessages =async({email, subject, body}:SendEmail)=>{

       return (await ApiWeb.post('/message/send-email/',{
        email, subject, body
       })).data
      
      }


      return {
        SendMessages
      }
}