import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl; // base url so only /login, no full path required  



export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token")); // localstorage stores as stings //localStorage.setItem("token", "abc123"); //localStorage.getItem("token"); // returns "abc123"
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);



    // CHECK IF THE USER IS AUTHENTICATED AND IF SO, SET THE USER DATA AND CONNECT THE SOCKET

    const checkAuth = async () => {
        try{
            const { data } = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    // LOGIN FUNCTION  TO HANDLE USER AUTHENTICATION AND SOCKET CONNECTION

    const login = async (state, credentials) => { // state = login or signup
        try{
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message)
            } else{
                toast.error(data.message)
            }       
        } catch(error){
            toast.error(error.message)
        }
    }



    // LOGOUT FUNCTION TO HANDLE USER LOGOUT AND SOCKET DISCONNECTION
    const logout = async() =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully")
        socket.disconnect();
        setSocket(null);
    }


    // UPDATE PROFILE FUNCTION TO HANDLE USER PROFILE UPDATES
    const updateProfile = async (body) =>{
        try{
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error)
        }
    }


    // CONNECT SOCKET FUNCTION TO HANDLE SOCKET CONNECTION AND ONLINE USERS UPDATE
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id //Sends userId as a query parameter to the backend. // The backend can access it using socket.handshake.query.userId.

            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }


    useEffect(() => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ✅ Fixed
    }
    checkAuth();
}, []);



    
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}