import { apiRequest } from './api';

export const requestCertification = async (): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await apiRequest<{ ok: boolean; message: string }>('/api/users/me/certification-request', {
      method: 'POST',
      auth: true
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de la demande de certification:', error);
    throw error;
  }
};

export const requestPremium = async (): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await apiRequest<{ ok: boolean; message: string }>('/api/users/me/premium-request', {
      method: 'POST',
      auth: true
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de la demande premium:', error);
    throw error;
  }
};
