import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function CreateComplaint() {

  const navigate = useNavigate();

  const [image, setImage] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setFormData((prev) => ({
          ...prev,
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        }));

        alert("Location Captured");
      },

      (error) => {

        console.log(error);

        alert("Location Access Denied");
      }
    );
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const submitData =
        new FormData();

      submitData.append(
        "title",
        formData.title
      );

      submitData.append(
        "description",
        formData.description
      );

      submitData.append(
        "latitude",
        formData.latitude
      );

      submitData.append(
        "longitude",
        formData.longitude
      );

      if (image) {

        submitData.append(
          "image",
          image
        );
      }

      await API.post(
        "/complaints/create",
        submitData,
        {
          headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type":
    "multipart/form-data",
},
        }
      );

      alert(
        "Complaint Submitted Successfully"
      );

      navigate("/user-dashboard");

    } catch (error) {

      console.log(error);

      alert("Failed To Submit Complaint");
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-2xl w-full max-w-2xl shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Create Complaint
        </h1>

        {/* Title */}

        <div className="mb-5">

          <label className="text-slate-300">
            Complaint Title
          </label>

          <input
            type="text"
            name="title"
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-lg bg-slate-800 text-white outline-none"
            placeholder="Enter complaint title"
            required
          />

        </div>

        {/* Image Upload */}

        <div className="mb-5">

          <label className="text-slate-300">
            Upload Complaint Image
          </label>

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white"
          />

        </div>

        {/* Description */}

        <div className="mb-5">

          <label className="text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            rows="5"
            onChange={handleChange}
            className="w-full mt-2 p-4 rounded-lg bg-slate-800 text-white outline-none"
            placeholder="Describe the issue"
            required
          />

        </div>

        {/* Location */}

        <div className="grid grid-cols-2 gap-4 mb-5">

          <div>

            <label className="text-slate-300">
              Latitude
            </label>

            <input
              type="text"
              value={formData.latitude}
              readOnly
              className="w-full mt-2 p-4 rounded-lg bg-slate-800 text-white outline-none"
            />

          </div>

          <div>

            <label className="text-slate-300">
              Longitude
            </label>

            <input
              type="text"
              value={formData.longitude}
              readOnly
              className="w-full mt-2 p-4 rounded-lg bg-slate-800 text-white outline-none"
            />

          </div>

        </div>

        {/* Capture Location Button */}

        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded-lg text-lg font-semibold text-white mb-5"
        >
          Capture Location
        </button>

        {/* Submit Button */}

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition p-4 rounded-lg text-lg font-semibold text-white"
        >
          Submit Complaint
        </button>

      </form>

    </div>
  );
}

export default CreateComplaint;