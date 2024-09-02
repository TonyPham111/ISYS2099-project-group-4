import { UserContext } from "@/contexts/userContext";
import { useContext } from "react";

export default function LoginPage(){
    const {userData, setUserData} = useContext(UserContext);

    function handleLogin(){
        setUserData({
            id:'', //put user login id in here
            full_name: '', //put user login name in here
            job_role: '', //put user login job role in here
        });
    }
return(
    <div>
        this is login page
        {/* click some thing to login --> trigger handleLogin function*/}
    </div>
);
}