import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

httpClient.interceptors.response.use((response) => {
  if (response.status === 401) {
    // FIXME: redirect to login
  }
  return response;
});

export default httpClient;
