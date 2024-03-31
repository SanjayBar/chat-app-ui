import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io";
import { io } from "socket.io-client";
import { api_url } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTimeInFormat } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ChatPage() {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [messages, setMessages] = useState<
    { username: string; text: string; createdAt: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { token, name } = useAuth();
  const location = useLocation();
  const nevigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("room-id");
  const messagesRef = useRef<HTMLDivElement>(null);
  const [roomData, setRoomData] = useState<{
    room: string;
    users: string[];
  } | null>(null);

  console.log(roomData);

  useEffect(() => {
    if (token && roomId) {
      const socket = io(api_url, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSocket(
        socket as unknown as Socket<DefaultEventsMap, DefaultEventsMap>,
      );
      socket.emit("join", roomId, (error: string) => {
        if (error) {
          alert(error);
          nevigate("/");
        }
      });
      socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.on("roomData", (data) => {
        setRoomData(data);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [nevigate, roomId, token]);

  useEffect(() => {
    if (messagesRef.current) {
      const newMessage = messagesRef.current.lastElementChild as HTMLDivElement;
      if (newMessage) {
        const newMessageHeigth = newMessage.offsetHeight;

        const visibleHeight = messagesRef.current.offsetHeight;

        const containerHeight = messagesRef.current.scrollHeight;

        const scrollOffset = messagesRef.current.scrollTop + visibleHeight;

        // Only scroll if user did not scrolled up
        if (containerHeight - newMessageHeigth <= scrollOffset + 20) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }
    }
  }, [messages]);

  const onSendBtnClick = useCallback(() => {
    if (inputRef.current) {
      if (!inputRef.current.value) return;
      socket?.emit("sendMessage", inputRef.current.value);
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [socket]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onSendBtnClick();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onSendBtnClick]);

  return (
    <div
      style={{ height: "calc(100vh - 64px)" }}
      className='w-full max-w-3xl mx-auto'
    >
      <div className='relative w-full h-full pb-20 border-[1px] drop-shadow-sm'>
        <div className='flex items-end justify-end w-full h-full px-4'>
          <div
            ref={messagesRef}
            className='flex flex-col w-full max-h-full gap-2 pb-4 overflow-y-auto'
          >
            {messages.map((message, index) => (
              <div key={index} className='px-6 py-2 bg-gray-100 rounded-md'>
                <div className='text-xs flex gap-2'>
                  <span className='font-bold'>
                    {message.username === name ? "You" : message.username}
                  </span>
                  {getTimeInFormat(message.createdAt)}
                </div>
                <p className='text-base'>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 flex items-center justify-center h-20 gap-4 px-6 bg-gray-200'>
          <Input
            type='text'
            ref={inputRef}
            className='text-base h-14'
            placeholder='Type message...'
            autoComplete='off'
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Users</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List of users</DialogTitle>
              </DialogHeader>
              <div className='space-y-3'>
                {roomData &&
                  roomData?.users.map((user, index) => (
                    <div
                      className='text-base px-2 py-1 rounded-md bg-gray-200'
                      key={index}
                    >
                      {user}
                    </div>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={onSendBtnClick} className='text-base h-14 '>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
