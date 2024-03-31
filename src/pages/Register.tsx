import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { api_url } from "@/lib/constant";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "name") {
      if (nameInputRef.current) {
        nameInputRef.current.value = e.target.value;
      }
    }
    if (e.target.name === "password") {
      if (passwordInputRef.current) {
        passwordInputRef.current.value = e.target.value;
      }
    }
  };

  const onRegisterBtnClick = async () => {
    const name = nameInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    if (!name || !password) return alert("Please enter name and password");

    const res = await fetch(`${api_url}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
    if (res.ok) {
      toast.success("Registered successfully");
      nameInputRef.current.value = "";
      passwordInputRef.current.value = "";
      navigate("/login");
    } else {
      if (res.status === 409) return toast.error("User already exists");
      toast.error("Failed to register");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Please add name and passord to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid items-center w-full gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='name'>User Name</Label>
                <Input
                  onChange={handleChange}
                  ref={nameInputRef}
                  name='name'
                  id='name'
                  placeholder='user name'
                  autoComplete='off'
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>password</Label>
                <Input
                  onChange={handleChange}
                  ref={passwordInputRef}
                  name='password'
                  id='password'
                  placeholder='password'
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='block'>
          <p className='block text-xs'>
            Go to login page
            <span
              onClick={() => navigate("/login")}
              className='ml-2 text-blue-500 underline cursor-pointer'
            >
              Login
            </span>
          </p>
          <Button onClick={onRegisterBtnClick} className='block mt-4'>
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
