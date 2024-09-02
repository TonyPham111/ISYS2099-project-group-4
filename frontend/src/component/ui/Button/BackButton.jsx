import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("../");
      }}
      className="w-[150px] h-[50px] absolute -bottom-20 -left-5 bg-custom-blue text-white"
    >
      Back
    </button>
  );
}
