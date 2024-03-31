import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
function NavBar() {
  const navigate = useNavigate();
  const { name, token, logout } = useAuth();

  return (
    <div className='pt-16'>
      <div className='fixed top-0 left-0 z-20 w-full  shadow-lg bg-gray-800'>
        <div className='relative z-10 flex items-center justify-center h-16 max-w-3xl mx-auto'>
          <span
            onClick={() => navigate("/")}
            className='text-2xl font-bold text-center cursor-pointer text-white'
          >
            Chat App
          </span>
          {token ? (
            <div className='absolute text-sm right-3'>
              <span className='text-white mr-2 font-semibold '>{name}</span>
              <Button
                onClick={logout}
                variant={"outline"}
                className='h-7 px-2 '
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant={"outline"}
              className='absolute h-7 px-2 text-sm right-3'
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
