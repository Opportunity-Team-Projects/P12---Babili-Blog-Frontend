import { authClient } from './AuthService';

export default {
  sendMessage(payload) {
    return authClient.post('/api/contact', payload);
  },
};