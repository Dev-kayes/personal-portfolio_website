import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSkills } from "../src/redux/userSlice.js";

const useFetchedSkills = () => {
  const token = localStorage.getItem("token");
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();

  const fetchedSkills = useCallback(async () => {
    try {
      const response = await axios.get(`${serverURL}/api/skill/get-all-skill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.success) {
        dispatch(setSkills(response.data.skills));
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      toast.error(error.response?.data?.message || "Error in Fetching Skills");
    }
  }, [serverURL, token, dispatch]);
  return fetchedSkills;
};

export default useFetchedSkills;
