const ACUBE_AUTH_URL = 'https://common-sandbox.api.acubeapi.com/login';

export class AuthRepository {
  async login(email: string, password: string): Promise<string> {
    const response = await fetch(ACUBE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Authentication failed: ${response.status}`);
    }

    const { token } = await response.json();
    if (!token) {
      throw new Error('No authentication token received');
    }

    return token;
  }
}