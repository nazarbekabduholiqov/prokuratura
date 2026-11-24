# HUQUQCHIUZ imtihon — Vercel + Upstash

## Siz bajaradigan ishlar
1. ZIP ichidagi fayllarni GitHub repository rootiga yuklang (ZIPni ochib, ichidagi `api`, `public`, `package.json`, `vercel.json` fayllarini joylang).
2. Vercel'da shu GitHub repository'ni import qilib deploy qiling.
3. Upstash Console → Redis → Create Database. Database ichidan REST URL va REST Token oling.
4. Vercel → Project → Settings → Environment Variables:
   - `UPSTASH_REDIS_REST_URL` = Upstash REST URL
   - `UPSTASH_REDIS_REST_TOKEN` = Upstash REST Token
   - `ADMIN_PASSWORD` = `mashina` (xohlasangiz boshqa maxfiy so'z)
5. Redeploy qiling.

O'quvchi sahifasi: `/`
Admin panel: `/admin`
Admin kirish so'zi: Vercel'da `ADMIN_PASSWORD` ga kiritgan so'z.

## Ishlash tartibi
- 1–12 savollar avtomatik tekshiriladi.
- 13-savol ham oldindan belgilangan javoblar bo'yicha avtomatik tekshiriladi.
- 14–15 savollar admin tomonidan qo'lda 0 yoki 1 ball qilib baholanadi.
- O'quvchiga imtihon topshirilgach avtomatik natija: avtomatik tekshirilgan ball / 15 va qolgan 2 savol "admin tekshiruvida" holatida ko'rinadi.
- Admin panelda har bir o'quvchining javoblari ko'rinadi; 14–15 ni baholab saqlaydi. Shundan so'ng yakuniy ball yangilanadi.
- Admin natijalarni CSV qilib yuklab oladi.

## Eslatma
API kalitlari va admin parolini GitHub kodiga yozmang. Ularni faqat Vercel Environment Variables orqali kiriting.
