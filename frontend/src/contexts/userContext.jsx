import fetcher from "@/utils/fetcher";
import { createContext, useEffect, useState, useRef } from "react";
import { useSWRConfig } from "swr";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();

function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const [userData, setUserData] = useState();
  const [fetchedData, setFetchedData] = useState(null);
  const isFetched = useRef(false);
  const storedUserData = localStorage.getItem("userData");
  console.log(`check storedUserData: ${storedUserData}`);
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      if (storedUserData && !userData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData({
            id: parsedUserData.id,
            job_role: parsedUserData.job_name,
            full_name: parsedUserData.full_name,
            department_id: parsedUserData.department_id,
            job_id: parsedUserData.job_id,
          });
        } catch (error) {
          console.error("Error parsing userData from localStorage:", error);
        }
      }
    }else{
      setUserData(null);
      navigate("/login");
    }
  }, [userData, localStorage.getItem("userData")]);
  // useEffect(() => {
  //   if (userData) {
  //     const endpoints = [
  //       "http://localhost:8000/patients",
  //       `http://localhost:8000/staffs/${userData.id}/schedule`,
  //     ];
  //     if (userData.job_role == "Doctor") {
  //       endpoints.push("http://localhost:8000/conditions");
  //       endpoints.push("http://localhost:8000/drugs");
  //       endpoints.push("http://localhost:8000/test_types");
  //     }
  //     if (userData.job_role == "FrontDesk") {
  //       endpoints.push("http://localhost:8000/appointments");
  //     }
  //     if (userData.job_role == "HR") {
  //       endpoints.push("http://localhost:8000/staffs");
  //       endpoints.push("http://localhost:8000/departments");
  //     } else {
  //       endpoints.push(
  //         `http://localhost:8000/staffs?manager_id=${userData.id}`
  //       );
  //     }
  //     Promise.all([...endpoints.map((url) => fetcher(url))]).then((data) => {
  //       if (!isFetched.current) {
  //         setFetchedData(data);
  //         isFetched.current = true;
  //       }
  //     });
  //     if (fetchedData) {
  //       endpoints.forEach((url, index) => {
  //         // console.log(`data: ${JSON.stringify(fetchedData[index])}`);
  //         mutate(url, fetchedData[index], false); // Prefetch data without revalidation
  //       });
  //     }
  //   }
  // }, [userData, fetchedData]);
  return (
    <UserContext.Provider value={{ userData, setUserData, fetchedData }}>
      {children}
    </UserContext.Provider>
  );
}
export { UserContext, UserContextProvider };
