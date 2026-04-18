export default async function pushProvider(token: string) {
    // 1. สร้างข้อมูลสุ่ม (เหมือนที่เราคุยกันรอบที่แล้ว)
    const firstNames = ["Stephen", "Marsha", "Laverne", "Darrell", "Stanton"];
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${Math.floor(Math.random() * 100)}`;
    const randomAddress = `${Math.floor(Math.random() * 999)} Lon Way`;
    const randomTel = `702-${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8999 + 1000)}`;

    const providerData = {
        name: randomName,
        address: randomAddress,
        tel: randomTel,
    };

    console.log("Sending data:", providerData); // Debug ดูข้อมูลก่อนส่ง

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers`,
        {
            method: "POST", // ต้องเป็น POST เพื่อสร้างข้อมูล
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ส่ง Token ไปยืนยันตัวตน
            },
            body: JSON.stringify(providerData),
        }
    );

    // แก้ไขตรงนี้: ดึงข้อความ Error จริงๆ จาก Backend มาโชว์
    if (!response.ok) {
        const errorDetail = await response.json().catch(() => ({ message: "Unknown Error" }));
        throw new Error(`HTTP ${response.status}: ${errorDetail.message || response.statusText}`);
    }

    return await response.json();
}