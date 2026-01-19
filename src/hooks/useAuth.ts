import type { authUser } from "@/interfaces/auth.interfaces.js";
import { onUser } from "@/store/auth/authSlice.js";
import { useAppDispatch, useAppSelector } from "@/redux/hook/useRedux.js";


export const useAuth = () => {
  const dispatch = useAppDispatch()
  const {user } = useAppSelector((auth)=>auth.auth)



  const getUser=(user:authUser[])=>{

     dispatch(onUser(user))
  }

  


  return {
    //* Propiedades
    user,


    //* Métodos
    getUser
  
  };
};
