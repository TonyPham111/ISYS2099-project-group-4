import axios from "axios";
const fetcher = url => axios.get(url, {withCredentials:true}).then(res => {return res.data}).catch(err=>{
    const status = err.status;
    if(status === 401 || status === 403){
        localStorage.removeItem("userData");
        window.location.href = "/login";

    }
    return err});
export default fetcher;