import { createContext, useContext, useState, useCallback } from "react";
const ToastCtx = createContext(null);
export function ToastProvider({ children }){
const [msg,setMsg] = useState("");
const show = useCallback((m)=>{ setMsg(m); setTimeout(()=>setMsg(""), 1800); },[]);
return (
<ToastCtx.Provider value={{ show }}>
{children}
{msg && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-black/80 text-white px-4 py-2 text-sm shadow-lg">{msg}</div>}
</ToastCtx.Provider>
);
}
export const useToast = ()=> useContext(ToastCtx);