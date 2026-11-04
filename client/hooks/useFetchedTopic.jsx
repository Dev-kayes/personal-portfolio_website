import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setTopics } from "../src/redux/userSlice.js";

const useFetchedTopic = () => {
  const token = localStorage.getItem("token");
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();

  const fetchedTopic = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverURL}/api/topic/get-admin-topic`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        dispatch(setTopics(response.data.getAdminTopic));
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      toast.error(error.response?.data?.message || "Error in Fetching Topics");
    }
  }, [serverURL, token, dispatch]);

  return fetchedTopic;
};

export default useFetchedTopic;