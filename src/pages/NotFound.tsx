import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const nevigate = useNavigate();
  return (
    <div className='h-screen w-full flex flex-col gap-4 justify-center items-center bg-slate-900 text-white text-7xl font-bold'>
      <h1>Not Found</h1>
      <Button variant={"secondary"} onClick={() => nevigate("/")}>
        Go Home
      </Button>
    </div>
  );
}

export default NotFound;
