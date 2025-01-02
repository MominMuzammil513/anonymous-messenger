"use client";
import { X } from "lucide-react";
import { Message } from "@/model/User";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  isSent: boolean; // New prop to determine the alignment of the message
};

const MessageCard = ({ message, onMessageDelete, isSent }: MessageCardProps) => {
  const formattedDate = new Date(message.createAt).toLocaleDateString();

  return (
    <div className="w-full pr-1 py-2 bg-gray-200 rounded-xl flex flex-col items-start">
      <div className="flex justify-end flex-row gap-x-4 items-end w-full mb-3">
      <div className={`text-sm`}>
          {formattedDate}
        </div>
          <X
            className={`text-black hover:bg-red-500 hover:fill-white hover:text-white w-5 h-5 rounded-full cursor-pointer ${isSent ? '' : 'hidden'}`}
            onClick={() => onMessageDelete(message._id)}
          />
      </div>
      <p className="whitespace-pre-wrap px-4">{message.content}</p>

    </div>
  );
};

export default MessageCard;
