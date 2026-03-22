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

  // Fire SMS + Email notifications asynchronously (don't block the response)
  notifyAlert(newAlert.title, newAlert.message, newAlert.severity)
    .then(async ({ smsSent, emailSent }) => {
      // Update doc with real notification status
      await docRef.update({ smsSent, emailSent });
    })
    .catch(err => console.error('[Notification] Failed:', err));

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
