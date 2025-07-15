import axios from "axios";

export default axios.create({
  baseURL: "https://realtime-notepad-k45e.onrender.com", // your backend
});
