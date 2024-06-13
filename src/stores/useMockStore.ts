import axios from 'axios';

export const useMockStore = axios.create({
  baseURL: 'http://localhost:5000/apis/', // แก้ไข baseURL เป็น URL ของ API จริง
  headers: {
    'Content-Type': 'application/json',
    // สามารถกำหนด headers อื่นๆ ตามต้องการได้
  },
});

export default useMockStore;
