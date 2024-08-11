import { Button } from "../../../../components/ui/button";

const RegisterPatientForm = ()=>{
    return(
        /*---------form data-----------*/

        <div className="w-full h-full p-5 relative">
            <div className="w-full h-[90%]"></div>
            <div className="w-full mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center">
                <Button className="bg-custom-blue">Register +</Button>
            </div>
        </div>

    );
}
export default RegisterPatientForm;