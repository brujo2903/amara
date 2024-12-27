import type { WebAppFormData } from '@/types/webapp';
import { WEBAPP_ERRORS } from './errors';

export function validateWebAppInput(formData: WebAppFormData): void {
  if (!formData.name?.trim()) {
    throw WEBAPP_ERRORS.INVALID_INPUT;
  }
  if (!formData.description?.trim()) {
    throw WEBAPP_ERRORS.INVALID_INPUT;
  }
}

export function validateSession(sessionId: string | null): void {
  if (!sessionId) {
    throw WEBAPP_ERRORS.NO_SESSION;
  }
}