import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Skills = () => {
  const [previewImage, setPreviewImage] = React.useState(null);
  const [skillImage, setSkillImage] = React.useState(null);
  const [skillLevel, setSkillLevel] = React.useState("");
  const [skillName, setSkillName] = React.useState("");
  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    setSkillImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillImage && !skillLevel && !skillName) {
      return toast.error("Please fill all the field");
    }
    const formData = new FormData();
    formData.append("skillName", skillName);
    if (!skillImage) {
      toast.error(error.message || "Please upload a file");
    } else {
      formData.append("skillImage", skillImage);
    }
    formData.append("skillLevel", skillLevel);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/skill/add-skill`,
        formData,
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Skills Added successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <img
          src={previewImage}
          alt="skill-Imgae"
          width={"100px"}
          height={"100px"}
        />
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="skill name"
          onChange={(e) => setSkillName(e.target.value)}
          value={skillName}
        />
        <input
          type="range"
          placeholder="skillLevel"
          min={0}
          max={100}
          onChange={(e) => setSkillLevel(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default Skills;
