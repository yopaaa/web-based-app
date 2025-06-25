import { useRouter } from "expo-router"
import { createContext, useState } from "react"


export const AuthContext = createContext({
    isLoggedin: false,
    logIn: () => {},
    logOut: () => {},
})

export function AuthProvider({children}) {
    const [isLoggedin, setisLoggedin] = useState(false)
const router = useRouter()
    function logIn() {
        setisLoggedin(true)
        router.replace("/")
    }

    function logOut() {
        setisLoggedin(false)
        router.replace("/Login")
    }
    return (
        <AuthContext.Provider value={{isLoggedin, logIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}