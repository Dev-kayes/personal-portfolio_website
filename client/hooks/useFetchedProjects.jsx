import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setProjects } from "../src/redux/userSlice.js";

const usefetchedProjects = () => {
  const token = localStorage.getItem("token");
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();

  const fetchedProjects = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverURL}/api/projects/get-admin-projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data?.success) {
        console.log("Fetched projects:", response.data.projects);
        dispatch(setProjects(response.data.projects));
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error(error.response?.data?.message || "Error in Fetching Projects");
    }
  }, [serverURL, token, dispatch]);
  return fetchedProjects;
};

export default usefetchedProjects;
