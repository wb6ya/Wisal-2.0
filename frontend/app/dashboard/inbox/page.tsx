"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 استيراد للتوجيه
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// تعريف أنواع البيانات
interface Message {
  id: string;
  content: string;
  direction: "INCOMING" | "OUTGOING";
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
  channel: "WHATSAPP" | "TELEGRAM" | "WEB";
}

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  // 1. دالة مساعدة لجلب التوكن والهيدر
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // 👈 المفتاح السحري
    };
  };

  // 2. جلب القائمة عند فتح الصفحة
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // طرده إذا ما عنده توكن
      return;
    }

    fetch("http://localhost:3000/conversations", {
      headers: getAuthHeaders(), // إرسال التوكن
    })
      .then(async (res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        // حماية إضافية: نتأكد أن البيانات مصفوفة فعلاً
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("Data is not an array:", data);
          setConversations([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
        if (err.message === "Unauthorized") router.push("/login");
        setLoading(false);
      });
  }, [router]);

  // 3. دالة جلب التفاصيل
  const handleSelectChat = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/conversations/${id}`, {
        headers: getAuthHeaders(), // إرسال التوكن هنا أيضاً
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedChat(data);
      }
    } catch (error) {
      console.error("Error fetching chat details", error);
    }
  };

  // 4. دالة إرسال رسالة
  const handleSendMessage = async () => {
    if(!inputText.trim() || !selectedChat) return;
    
    console.log("Sending:", inputText);
    setInputText("");
    // سنضيف كود الإرسال الحقيقي لاحقاً
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg border shadow-sm overflow-hidden" dir="rtl">
      
      {/* === القائمة اليمنى === */}
      <div className="w-1/3 border-l bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-lg mb-2">الرسائل</h2>
          <Input placeholder="بحث عن عميل..." className="bg-gray-50" />
        </div>
        
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">لا توجد محادثات</div>
          ) : (
            <div className="flex flex-col">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-3 p-4 text-right hover:bg-gray-100 transition-colors border-b ${
                    selectedChat?.id === chat.id ? "bg-blue-50 border-r-4 border-r-blue-600" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={chat.contact.avatarUrl} />
                    <AvatarFallback>{chat.contact.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold truncate">{chat.contact.name || chat.contact.phone}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(chat.lastMessageAt).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.messages[0]?.content || "صورة أو ملف..."}
                    </p>
                  </div>
                  {chat.channel === 'WHATSAPP' && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">W</Badge>}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* === المنطقة اليسرى (الشات) === */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedChat ? (
          <>
            <header className="h-16 border-b bg-white flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedChat.contact.avatarUrl} />
                  <AvatarFallback>{selectedChat.contact.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{selectedChat.contact.name}</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    متصل عبر واتساب
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-gray-400">
                <Button variant="ghost" size="icon"><Phone size={20} /></Button>
                <Button variant="ghost" size="icon"><Video size={20} /></Button>
                <Button variant="ghost" size="icon"><MoreVertical size={20} /></Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'OUTGOING' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                        msg.direction === 'OUTGOING'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                      <span className={`block text-[10px] mt-1 opacity-70 ${msg.direction === 'OUTGOING' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="اكتب رسالتك هنا..." 
                  className="flex-1"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 opacity-50">
              <Send size={40} />
            </div>
            <p>اختر محادثة للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
}