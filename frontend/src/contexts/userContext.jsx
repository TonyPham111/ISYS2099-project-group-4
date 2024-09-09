import fetcher from "@/utils/fetcher";
import { createContext, useEffect, useState, useRef } from "react";
import { useSWRConfig } from "swr";
const UserContext = createContext();

function UserContextProvider({ children }) {
  const { mutate } = useSWRConfig();
  const [userData, setUserData] =
    useState();
    //   {
    //   id:15,
    //   job_role:'HR',
    //   department_id: 1,
    //   job_id: 1
    // }
  const storUserData = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    if ((localStorage.getItem("userData")) && !userData) {
      console.log(JSON.stringify(storUserData));
      setUserData({
        id: storUserData.id,
        job_role: storUserData.job_name,
        department_id: storUserData.department_id,
        job_id: storUserData.job_id,
      });
    }
  }, [userData,localStorage.getItem("userData")]);
  const [fetchedData, setFetchedData] = useState(null);
  const isFetched = useRef(false);
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
