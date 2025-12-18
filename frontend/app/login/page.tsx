"use client"; // 👈 ضروري جداً: يخبر Next.js أن هذا الملف يعمل في متصفح المستخدم

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter(); // 👈 أداة التنقل بين الصفحات
  
  // 1. متغيرات لتخزين البيانات (State)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // لإظهار حالة التحميل
  const [error, setError] = useState(""); // لعرض رسائل الخطأ

  // 2. دالة تسجيل الدخول (تتنفذ عند ضغط الزر)
// ... بقية الكود في الأعلى

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      // 🔍🔍 التصحيح هنا: طباعة الاستجابة لمعرفة اسم التوكن
      console.log("Login Response from Server:", data);

      // تجربة الاسمين المحتملين (access_token أو accessToken)
      const token = data.access_token || data.accessToken;

      if (!token) {
        throw new Error("لم يتم العثور على التوكن في استجابة السيرفر!");
      }

      // حفظ التوكن الصحيح
      localStorage.setItem("token", token);
      
      console.log("Token Saved Successfully:", token);
      router.push("/dashboard/inbox"); // توجيه مباشر للصندوق

    } catch (err: unknown) { // 👈 غيرنا any إلى unknown (أكثر أماناً)
      console.error(err);
      
      // نتأكد هل الخطأ هو فعلاً Error وله message؟
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4" dir="rtl">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">تسجيل الدخول</CardTitle>
          <CardDescription>
            أهلاً بك في نظام وصال، أدخل بياناتك للمتابعة
          </CardDescription>
        </CardHeader>
        
        {/* نموذج الإدخال */}
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            {/* رسالة الخطأ تظهر هنا إن وجدت */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@wisal.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // تحديث المتغير عند الكتابة
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              type="submit"
              disabled={loading} // تعطيل الزر أثناء التحميل
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              ليس لديك حساب؟ <span className="text-blue-600 cursor-pointer hover:underline">تواصل مع الإدارة</span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}