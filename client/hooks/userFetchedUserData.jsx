// Higher Order Component (HOC):
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setLoading, setUserData } from "../src/redux/userSlice";

const useFetchedUserData = () => {
  const serverURI = import.meta.env.VITE_SERVER_URI;
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  React.useEffect(() => {
    const fetchedUserData = async () => {
      // if (!token) {
      //   dispatch(setUserData(null));
      //   dispatch(setLoading(false));
      //   return;
      // }
      if (!token || loading) return;
      dispatch(setLoading(true));
      try {
        const response = await axios.get(`${serverURI}/api/user/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.success) {
          console.log(response?.data.data);
          dispatch(setUserData(response?.data?.data));
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error(error);
        dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchedUserData();
  }, [serverURI, token, dispatch]);
};

export default useFetchedUserData;
