import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCerts } from "../src/redux/userSlice.js";

const useFetchedCert = () => {
  const token = localStorage.getItem("token");
  const serverURL = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();

  const fetchedCert = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverURL}/api/cert/get-admin-cert`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        dispatch(setCerts(response.data.getAdminCert));
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast.error(
        error.response?.data?.message || "Error in Fetching Certificates",
      );
    }
  }, [serverURL, token, dispatch]);

  return fetchedCert;
};

export default useFetchedCert;
