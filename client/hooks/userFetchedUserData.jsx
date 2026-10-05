// Higher Order Component (HOC):
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../src/redux/userSlice";

const userFetchedUserData = () => {
  const serverURI = import.meta.env.VITE_SERVER_URI;
  const token = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const fetchedUserData = async () => {
      try {
        const response = await axios.get(`${serverURI}/api/user/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response?.data?.success) {
          console.log(response?.data?.user);
          dispatch(setUserData(response?.data?.user));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchedUserData();
  }, [serverURI, token]);
};

export default userFetchedUserData;
