import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setEducation } from "../src/redux/userSlice.js";

const usefetchedEducation = () => {
  const token = localStorage.getItem("token");
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();

  const fetchedEducation = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverURL}/api/education/get-admin-edu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        console.log("Fetched education:", response.data.getAdminEducation);
        dispatch(setEducation(response.data.getAdminEducation));
      }
    } catch (error) {
      console.error("Failed to fetch education:", error);
      toast.error(
        error.response?.data?.message || "Error in Fetching education",
      );
    }
  }, [serverURL, token, dispatch]);
  return fetchedEducation;
};

export default usefetchedEducation;
