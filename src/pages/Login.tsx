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
import { useAuth } from "@/hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const onLoginBtnClick = async () => {
    const name = nameInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    if (!name || !password) return alert("Please enter name and password");

    const res = await fetch(`${api_url}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
    if (res.ok) {
      toast.success("Login successful");
      nameInputRef.current.value = "";
      passwordInputRef.current.value = "";
      const data = await res.json();
      const { token, name } = data;
      login(token, name);
      navigate("/", { replace: true });
    } else {
      if (res.status === 409) return toast.error("User already exists");
      toast.error("Failed to register");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credetials to login</CardDescription>
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
            Do not have a account. Please register an account first by clicking
            on register.
            <span
              onClick={() => navigate("/register")}
              className='ml-2 text-blue-500 underline cursor-pointer'
            >
              register
            </span>
          </p>
          <Button onClick={onLoginBtnClick} className='block mt-4'>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
