import { adminDb } from '../firebaseAdmin';
import { Alert, AlertType, AlertSeverity } from '../../types';
import { notifyAlert } from './notificationService';

const COLLECTION = 'alerts';

export async function getActiveAlerts(hospitalId: string): Promise<Alert[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('hospitalId', '==', hospitalId)
    .where('status', '==', 'active')
    .get();
    
  const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'status'>): Promise<Alert> {
  const docRef = adminDb.collection(COLLECTION).doc();
  const newAlert: Alert = {
    ...alertData,
    id: docRef.id,
    createdAt: new Date(),
    status: 'active',
    smsSent: false,
    emailSent: false,
  };
  await docRef.set(newAlert);

  // Asynchronously send notifications wait for it to finish so Next.js doesn't kill the promise
  try {
    const { smsSent, emailSent } = await notifyAlert(newAlert.title, newAlert.message, newAlert.severity);
    await docRef.update({ smsSent, emailSent });
    newAlert.smsSent = smsSent;
    newAlert.emailSent = emailSent;
  } catch (err) {
    console.error('[Alert Service] Notification failed:', err);
  }

  return newAlert;
}

export async function acknowledgeAlert(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({
    status: 'acknowledged',
  });
}

export async function resolveAlert(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update({
    status: 'resolved',
    resolvedAt: new Date()
  });
}
