import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import {
  FiCamera,
  FiSave,
  FiUser,
  FiMapPin,
  FiGlobe,
  FiShare2,
} from "react-icons/fi";

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
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(
    userData?.profilePic || defaultProfilePicPreview,
  );
  const profilePicInputRef = useRef(null);

  useEffect(
    () => () => {
      if (profilePicPreview && profilePicPreview !== defaultProfilePicPreview) {
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
      selectedProfilePic
        ? URL.createObjectURL(selectedProfilePic)
        : userData?.profilePic || defaultProfilePicPreview,
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
        const updatedUser = response.data.data;
        if (updatedUser) {
          dispatch(setUserData(updatedUser));
        }
        setProfilePic(null);
        setProfilePicPreview(
          updatedUser?.profilePic ||
            userData?.profilePic ||
            defaultProfilePicPreview,
        );
        if (profilePicInputRef.current) {
          profilePicInputRef.current.value = "";
        }
        toast.success(
          response?.data?.message || "Profile updated successfully",
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your public profile information, social links, and
          availability.
        </p>
      </div>

      <form className="space-y-8" onSubmit={onSubmitHandler}>
        {/* Profile Picture Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:border-zinc-700">
          <div className="relative group">
            <img
              src={profilePicPreview}
              alt="Profile preview"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <label
              htmlFor="profilePicUpload"
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
            >
              <FiCamera className="text-2xl" />
            </label>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 flex-1">
            <div>
              <h3 className="text-base font-medium text-zinc-200">
                Profile Picture
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                PNG, JPG or WEBP (Max 5MB).
              </p>
            </div>
            <input
              id="profilePicUpload"
              type="file"
              name="profilePic"
              accept="image/*"
              ref={profilePicInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
            />
            <div className="flex flex-wrap gap-3 items-center">
              <label
                htmlFor="profilePicUpload"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                Change Picture
              </label>
              {profilePic && (
                <span className="text-xs text-indigo-400 truncate max-w-[200px]">
                  {profilePic.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability Toggle Box */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex items-center justify-between transition-all duration-300 hover:border-zinc-700">
          <div>
            <span className="text-sm font-medium text-zinc-200 block">
              Work Status
            </span>
            <span className="text-xs text-zinc-400">
              Show clients if you are currently available for projects.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={isAvailable}
              onChange={handleAvailabilityChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Personal Details Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-zinc-200 font-medium">
            <FiUser className="text-indigo-400" />
            <h2>Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ["name", "Name", "text"],
              ["title", "Professional Title", "text"],
              ["phone", "Phone", "tel"],
              ["whatsAppNumber", "WhatsApp Number", "tel"],
            ].map(([name, label, type]) => (
              <label
                key={name}
                className="flex flex-col gap-2 text-sm text-zinc-300"
              >
                <span className="font-medium">{label}</span>
                <input
                  type={type}
                  name={name}
                  value={profileData[name]}
                  onChange={handleProfileDataChange}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                />
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium">Introduction / Bio</span>
            <input
              type="text"
              name="intro"
              value={profileData.intro}
              onChange={handleProfileDataChange}
              placeholder="Short headline about you"
              className="rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium">Description</span>
            <textarea
              name="description"
              rows="4"
              value={profileData.description}
              onChange={handleProfileDataChange}
              placeholder="Write a detailed description about yourself..."
              className="rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-y"
            />
          </div>
        </div>

        {/* Address & Location Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-zinc-200 font-medium">
            <FiMapPin className="text-indigo-400" />
            <h2>Location Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["country", "Country"],
              ["PostalCode", "Postal Code"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="flex flex-col gap-2 text-sm text-zinc-300"
              >
                <span className="font-medium">{label}</span>
                <input
                  type="text"
                  name={name}
                  value={profileData[name]}
                  onChange={handleProfileDataChange}
                  placeholder={label}
                  className="rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-zinc-200 font-medium">
            <FiShare2 className="text-indigo-400" />
            <h2>Social Profiles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ["github", "GitHub URL"],
              ["linkedIn", "LinkedIn URL"],
              ["twitter", "Twitter / X URL"],
              ["instagram", "Instagram URL"],
              ["facebook", "Facebook URL"],
              ["youtube", "YouTube URL"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="flex flex-col gap-2 text-sm text-zinc-300"
              >
                <span className="font-medium">{label}</span>
                <input
                  type="url"
                  name={name}
                  value={profileData[name]}
                  onChange={handleProfileDataChange}
                  placeholder="https://..."
                  className="rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <FiSave className="text-lg" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Profile;
