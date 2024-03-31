import { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { api_url } from "@/lib/constant";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

function HomePage() {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState<{ id: number | string; name: string }[]>(
    [],
  );
  const { token } = useAuth();
  const [shouldFetch, setShouldFetch] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch(`${api_url}/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setRooms(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [shouldFetch, token]);

  const onJoinBtnClick = () => {
    if (selectedRoom) {
      navigate(`/chat-app?room-id=${selectedRoom}`);
      setSelectedRoom("");
    }
  };

  const onSaveBtnClick = () => {
    if (nameRef.current) {
      const name = nameRef.current.value;
      if (name) {
        fetch(`${api_url}/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        })
          .then((response) => {
            if (response.status === 409) {
              throw new Error("Room name already exists");
            }
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setShouldFetch(!shouldFetch);
            toast.success(`Room ${data.name} created successfully`);
          })
          .catch((error) => {
            toast.error(error.message);
            console.error(
              "There was a problem with the fetch operation:",
              error,
            );
          });
        nameRef.current.value = "";
      }
    }
  };

  return (
    <div
      style={{ height: "calc(100vh - 64px)" }}
      className='flex w-full items-center justify-center'
    >
      <Tabs
        defaultValue='join'
        className='w-[400px] items-center justify-center'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='join'>Join Room</TabsTrigger>
          <TabsTrigger value='create'>Create Room</TabsTrigger>
        </TabsList>
        <TabsContent value='join'>
          <Card>
            <CardHeader>
              <CardTitle>Join</CardTitle>
              <CardDescription>
                Select a room below and click 'Join' to enter:
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label>Rooms</Label>
                <Select defaultValue='' onValueChange={setSelectedRoom}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='--select--' />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={`${room.id}`}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onJoinBtnClick}>Join</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='create'>
          <Card>
            <CardHeader>
              <CardTitle>Create</CardTitle>
              <CardDescription>
                Enter the name of your room below and click 'Save':
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='room_name'>Name</Label>
                <Input
                  placeholder='Room Name'
                  ref={nameRef}
                  id='room_name'
                  type='text'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onSaveBtnClick}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HomePage;
