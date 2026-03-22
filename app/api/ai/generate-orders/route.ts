import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Medicine } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { hospitalId = 'hosp001' } = await req.json().catch(() => ({}));
    
    const medSnap = await adminDb.collection('medicines').where('hospitalId', '==', hospitalId).get();
    
    // Simulate Weather-based ML trends
    const weatherConditions = ["monsoon", "summer_heatwave", "winter_chill", "normal"];
    const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
      // AI Logic: Calculate 30-day predicted demand
      // For the demo, we dynamically generate a predicted demand that is ALWAYS slightly higher than current stock
      // for 1 to 3 random medicines, to guarantee the user sees alerts being generated.
      
      const orders = [];
      const batch = adminDb.batch();
      
      // Shuffle medicines and pick 1 to 3 random ones to trigger
      const shuffled = [...medSnap.docs].sort(() => 0.5 - Math.random());
      const selectedDocs = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
      
      for (const doc of selectedDocs) {
        const med = doc.data() as Medicine;
        
        let multiplier = 1.0;
        if (currentWeather === "monsoon" && (med.category === "antibiotic" || med.genericName.toLowerCase().includes("paracetamol"))) {
          multiplier = 1.5; 
        } else if (currentWeather === "winter_chill" && med.category === "cold_chain") {
          multiplier = 1.3;
        } else if (currentWeather === "summer_heatwave" && med.category === "analgesic") {
          multiplier = 1.6;
        } else {
          multiplier = 1.2; // default slight bump
        }
        
        // Force predicted demand to be higher than current stock so it always triggers
        const predictedDemand = Math.max(Math.round(med.totalQuantity * multiplier) + 40, 150);
        const orderQuantity = predictedDemand - med.totalQuantity + 50; // Buffer
        
        const alertRef = adminDb.collection('alerts').doc();
        const alertMsg = `Weather impact detected. Predicted 30-day demand: ${predictedDemand} units. Current stock: ${med.totalQuantity}. Automated Request: ${orderQuantity} units.`;
        const alertTitle = `AI Reorder: ${med.name} (${currentWeather.replace('_', ' ').toUpperCase()})`;

        const alert = {
          id: alertRef.id,
          type: "auto_order",
          severity: "info",
          title: alertTitle,
          message: alertMsg,
          status: "active",
          smsSent: false,
          emailSent: false, // will update below
          hospitalId: hospitalId,
          createdAt: new Date().toISOString()
        };
        
        batch.set(alertRef, alert);
        orders.push({ ref: alertRef, alert });
      }
      
      // Also delete old auto_order alerts to prevent spam in demo
      const oldAlerts = await adminDb.collection('alerts').where('hospitalId', '==', hospitalId).where('type', '==', 'auto_order').get();
      for (const doc of oldAlerts.docs) {
         batch.delete(doc.ref);
      }

    await batch.commit();

    // After commit, fire off notifications asynchronously and update their status
    const { notifyAlert } = await import('@/lib/services/notificationService');
    for (const { ref, alert } of orders) {
      notifyAlert(alert.title, alert.message, alert.severity)
        .then(async ({ smsSent, emailSent }) => {
          await ref.update({ smsSent, emailSent });
        })
        .catch(err => console.error('[AI Orders] Notification failed:', err));
    }
    
    return NextResponse.json({ success: true, ordersGenerated: orders.length, weather: currentWeather, orders: orders.map(o => o.alert) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
