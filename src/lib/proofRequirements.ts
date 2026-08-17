import type { WorkOrder } from '../mockData';

export interface ProofRequirements {
  photos: boolean;
  signature: boolean;
  notes: boolean;
  summary: string;
}

export const getProofRequirements = (workOrder: WorkOrder): ProofRequirements => {
  if (workOrder.type === 'Welfare Check') {
    return {
      photos: true,
      signature: true,
      notes: true,
      summary: 'Photos, customer signature and visit notes are required.',
    };
  }

  if (workOrder.type === 'Payment Collection') {
    return {
      photos: true,
      signature: true,
      notes: true,
      summary: 'Photos, customer signature and payment notes are required.',
    };
  }

  if (workOrder.type === 'Repair') {
    return {
      photos: true,
      signature: true,
      notes: false,
      summary: 'Capture the completed repair and customer approval.',
    };
  }

  if (workOrder.action === 'Dropoff' && (workOrder.type === 'Delivery' || workOrder.type === 'Private Move')) {
    return {
      photos: true,
      signature: true,
      notes: false,
      summary: 'Delivery photos and customer signature are required.',
    };
  }

  return {
    photos: true,
    signature: true,
    notes: false,
    summary: 'Photos and customer signature are required for this task.',
  };
};

export const isProofComplete = (workOrder: WorkOrder, requirements = getProofRequirements(workOrder)) => {
  const photosComplete = !requirements.photos || Boolean(workOrder.photos?.length);
  const signatureComplete = !requirements.signature || Boolean(workOrder.signature);
  const notesComplete = !requirements.notes || Boolean(workOrder.notes?.trim());

  return photosComplete && signatureComplete && notesComplete;
};
