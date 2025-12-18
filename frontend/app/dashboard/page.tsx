import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Zap, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800">نظرة عامة</h2>
      
      {/* شبكة البطاقات الإحصائية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* بطاقة 1: المحادثات */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المحادثات</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% من الشهر الماضي</p>
          </CardContent>
        </Card>

        {/* بطاقة 2: العملاء */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+180 عميل جديد هذا الأسبوع</p>
          </CardContent>
        </Card>

        {/* بطاقة 3: المبيعات/النشاط */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الاستجابة</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 دقيقة</div>
            <p className="text-xs text-muted-foreground">أسرع بـ 4% من المتوسط</p>
          </CardContent>
        </Card>

        {/* بطاقة 4: الحالة */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة النظام</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ممتازة</div>
            <p className="text-xs text-muted-foreground">جميع الخدمات تعمل بكفاءة</p>
          </CardContent>
        </Card>
      </div>

      {/* منطقة فارغة لإضافة رسوم بيانية مستقبلاً */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[300px] flex items-center justify-center bg-gray-50 border-dashed">
          <p className="text-gray-400">سيتم إضافة رسم بياني للمحادثات هنا قريباً 📊</p>
        </Card>
        <Card className="col-span-3 h-[300px] flex items-center justify-center bg-gray-50 border-dashed">
          <p className="text-gray-400">آخر النشاطات 🕒</p>
        </Card>
      </div>
    </div>
  );
}