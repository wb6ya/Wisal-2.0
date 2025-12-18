"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // لمعرفة الصفحة الحالية وتلوين الزر
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

// قائمة الروابط الجانبية
const sidebarItems = [
  { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { name: "المحادثات", href: "/dashboard/inbox", icon: MessageSquare }, // سنبنيها لاحقاً
  { name: "العملاء", href: "/dashboard/contacts", icon: Users },
  { name: "الرد الآلي", href: "/dashboard/flows", icon: Bot },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* 1. القائمة الجانبية (Sidebar) */}
      <aside className="w-64 bg-white border-l shadow-sm flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">وصال 2.0</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
               // سنضيف كود تسجيل الخروج لاحقاً
               window.location.href = "/login";
            }}
          >
            <LogOut size={20} />
            تسجيل خروج
          </Button>
        </div>
      </aside>

      {/* 2. منطقة المحتوى (المتغيرة) */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}