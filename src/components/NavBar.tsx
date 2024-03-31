import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
function NavBar() {
  const navigate = useNavigate();
  const { name, token, logout } = useAuth();

  return (
    <div className='pt-16'>
      <div className='fixed top-0 left-0 z-20 w-full bg-white shadow-lg'>
        <div className='relative z-10 flex items-center justify-center h-16 max-w-3xl mx-auto black'>
          <span
            onClick={() => navigate("/")}
            className='text-2xl font-bold text-center cursor-pointer'
          >
            Chat App
          </span>
          {token && (
            <div className='absolute inline-block left-3'>
              <span className='text-sm font-bold'>User: </span>
              <span className='mr-3 text-sm font-semibold'>{name}</span>
            </div>
          )}
          {token ? (
            <div className='absolute text-sm right-3'>
              <Button onClick={logout} variant={"outline"} className='h-8 p-0'>
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant={"outline"}
              className='absolute h-8 p-0 text-sm right-3'
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
