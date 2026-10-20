import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const initialProfileData = {
  name: "",
  phone: "",
  whatsAppNumber: "",
  address: "",
  city: "",
  state: "",
  country: "",
  PostalCode: "",
  title: "",
  intro: "",
  description: "",
  github: "",
  linkedIn: "",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
};

const defaultProfilePicPreview =
  "https://cdn.vectorstock.com/i/1000v/41/91/avatar-default-user-profile-icon-simple-flat-grey-vector-57234191.jpg";

const Profile = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(
    defaultProfilePicPreview,
  );
  const profilePicInputRef = useRef(null);

  useEffect(
    () => () => {
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    },
    [profilePicPreview],
  );

  const handleProfileDataChange = (event) => {
    const { name, value } = event.target;
    setProfileData((currentProfileData) => ({
      ...currentProfileData,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (event) => {
    setIsAvailable(event.target.checked);
  };

  const handleProfilePicChange = (event) => {
    const selectedProfilePic = event.target.files?.[0] || null;
    setProfilePic(selectedProfilePic);
    setProfilePicPreview(
      selectedProfilePic ? URL.createObjectURL(selectedProfilePic) : "",
    );
  };

  const profileFields = [
    ["name", "Name"],
    ["phone", "Phone"],
    ["whatsAppNumber", "WhatsApp number"],
    ["address", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["country", "Country"],
    ["PostalCode", "Postal code"],
    ["title", "Title"],
    ["intro", "Introduction"],
    ["description", "Description"],
    ["github", "GitHub"],
    ["linkedIn", "LinkedIn"],
    ["instagram", "Instagram"],
    ["facebook", "Facebook"],
    ["twitter", "Twitter"],
    ["youtube", "YouTube"],
  ];
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // console.log(profileData);
      // console.log(profilePicPreview);
      // console.log(isAvailable);

      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profilePic) {
        formData.append("profile", profilePic);
      }
      formData.append("isAvailable", isAvailable);

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Profile updated successfully",
        );
        setProfileData(initialProfileData);
        setIsAvailable(true);
        setProfilePic(null);
        setProfilePicPreview(defaultProfilePicPreview);
        setLoading(false);
      }
      if (profilePicInputRef.current) {
        profilePicInputRef.current.value = "";
      }
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Profile</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your public profile information.
        </p>
      </div>

      <form className="grid gap-5 " onSubmit={onSubmitHandler}>
        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          <span>Profile picture</span>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            ref={profilePicInputRef}
            onChange={handleProfilePicChange}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1 file:text-zinc-100"
          />
          {profilePic && (
            <span className="text-xs text-zinc-400">{profilePic.name}</span>
          )}
          {profilePicPreview && (
            <img
              src={profilePicPreview}
              alt="Selected profile picture preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
        </label>
        {profileFields.map(([name, label]) => (
          <label
            key={name}
            className="flex flex-col gap-2 text-sm text-zinc-300"
          >
            <span>{label}</span>
            <input
              type="text"
              name={name}
              value={profileData[name]}
              onChange={handleProfileDataChange}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-indigo-500"
            />
          </label>
        ))}

        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="isAvailable"
            checked={isAvailable}
            onChange={handleAvailabilityChange}
            className="h-4 w-4 accent-indigo-500"
          />
          Available for work
        </label>
        <button type="submit">{loading ? "Saving..." : "Save"}</button>
      </form>
    </section>
  );
};

export default Profile;
