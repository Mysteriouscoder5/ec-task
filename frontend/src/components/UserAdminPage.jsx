import React, { useEffect } from "react";
import "../stylesheet/UserAdminPage.css";
import Nav from "./Nav";
import UserDetails from "./UserDetails/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../redux/reducers/userReducer";

const UserAdminPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const id = "66c6faeac9d127bdeee4361b";
    dispatch(loadUser(id));
    if (user) {
      console.log(user);
    }
  }, [dispatch, user]);
  return (
    <>
      <Nav />
      <div className="relative h-full w-full px-52 my-12">
        <div className="UserAdminPageDetails h-full w-full">
          <UserDetails />
        </div>
      </div>
    </>
  );
};

export default UserAdminPage;
