import axios from "axios";
const fetcher = url => axios.get(url).then(res => {return res.data});
export default fetcher;