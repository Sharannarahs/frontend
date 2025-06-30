import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext();

// PROVIDER FUNCTION : 
export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]); // STORES MESSAGES FOR SELECTED USERS
    const [users, setusers] = useState([]); // LIST FOR USERS FOR LEFT SIDEBAR 
    const [selectedUser, setSelectedUser] = useState(null);// STORE ID OF USER TO WHOM WE WANT TO CHAT
    const [unseenMessages, setUnseenMessages] = useState({}); // STORES USERID AND NUMBER OF UNSEEN MESSAGES

    const {socket, axios} = useContext(AuthContext);

    // FUNCTION TO GET ALL USERS FROM SIDEBAR
    const getUsers = async () =>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setusers(data.users)
                setUnseenMessages(data.unseenMessages)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
 
    // FUNCTIONS TO GET MESSAGES FOR SELECTED USER
    const getMessages = async (userId) =>{
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }

        } catch (error){
            toast.error(error.message)
        }
    }

    // FUNCTION TO SEND MESSAGE TO SELECTED USER
    const sendMessage = async (messageData) =>{
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            } else {
                toast.error(data.message);
            }
 
        } catch (error) {
            toast.error(error.message);
        }
    }

    // FUNCTION TO SUBSCRIBE TO MESSAGES FOR SELECTED USERS
    const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessages", (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
            newMessage.seen = true;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
            setUnseenMessages((prev) => {
                const updated = {
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
                };
                console.log("🔔 Updated unseenMessages:", updated);
                return updated;
            });
        }
    });
};


    // FUNCTION TO UNSUBSCRIBE FROMMESSAGES
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessages");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    }, [socket, selectedUser])





    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage,
        setSelectedUser, unseenMessages, setUnseenMessages

    }
     
    return(
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}