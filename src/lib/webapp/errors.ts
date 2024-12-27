export class WebAppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WebAppError';
  }
}

export const WEBAPP_ERRORS = {
  CREATION_FAILED: new WebAppError('Failed to create web app'),
  FETCH_FAILED: new WebAppError('Failed to fetch web app'),
  UPDATE_FAILED: new WebAppError('Failed to update web app'),
  NO_SESSION: new WebAppError('No active session'),
  NAME_EXISTS: new WebAppError('A web app with this name already exists'),
  INVALID_INPUT: new WebAppError('Invalid input data'),
} as const;