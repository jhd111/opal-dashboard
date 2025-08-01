import React, { useState, useCallback } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import Base_url from "../../Base_url/Baseurl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const MediaUploadInterface = () => {
  const [activeTab, setActiveTab] = useState("Hero Banner");
  const [tabImages, setTabImages] = useState({
    "Hero Banner": [],
    "Media Gallery": [],
    "Awards & Certificates": [],
  });

  const tabs = ["Hero Banner", "Media Gallery", "Awards & Certificates"];
  const apiEndpoints = {
    "Hero Banner": `${Base_url}/api/admin/upload-image/`,
    "Media Gallery": `${Base_url}/api/admin/upload-media-gallery/`,
    "Awards & Certificates": `${Base_url}/api/admin/upload-certifications-award/`,
  };
const token=localStorage.getItem("token")
  const handlePublishChanges = async () => {
    const currentImages = tabImages[activeTab] || [];
    const endpoint = apiEndpoints[activeTab];
  
    if (!endpoint) {
      toast.error("Invalid tab selected.");
      return;
    }
  
    try {
      const formData = new FormData();
      currentImages.forEach((image) => {
        formData.append('image', image.file);
      });
  
      
  
      const response = await axios.post(endpoint, formData,
        
        {
        headers: {
          
          Authorization: `Token ${token}`,
          // Note: Don't set Content-Type manually, let axios handle it with FormData
        },
      });
  
      toast.success(`${activeTab} images uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMessage);
    }
  };
  

  const processFile = useCallback((file) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/")) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: Date.now() + Math.random(),
          file,
          url: e.target.result, // base64 data URL
          name: file.name,
          size: file.size,
        });
      };
      reader.onerror = () => {
        console.error("Error reading file");
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const processFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const arr = Array.from(files);
      const imgs = [];
      for (let f of arr) {
        const img = await processFile(f);
        if (img) imgs.push(img);
      }
      if (imgs.length) {
        setTabImages((prev) => ({
          ...prev,
          [activeTab]: [...(prev[activeTab] || []), ...imgs],
        }));
      }
    },
    [activeTab, processFile]
  );

  const handleFileUpload = useCallback(
    (e) => {
      processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles]
  );

  const handleReplaceImage = useCallback(
    async (imageId, e) => {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith("image/")) {
        e.target.value = "";
        return;
      }
      // remove old URL if we had used createObjectURL, but here we use base64 so skip
      const newImage = await processFile(file);
      if (newImage) {
        setTabImages((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].map((img) =>
            img.id === imageId ? { ...newImage, id: imageId } : img
          ),
        }));
      }
      e.target.value = "";
    },
    [activeTab, processFile]
  );

  const deleteImage = useCallback(
    (imageId) => {
      setTabImages((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((img) => img.id !== imageId),
      }));
    },
    [activeTab]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const currentImages = tabImages[activeTab] || [];
  const thumbnailImages = currentImages.slice(0, 3);
  const mainImage = currentImages.length >= 4 ? currentImages[3] : null;

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Upload Media
      </h1>

      {/* Tabs */}
      <div className="flex w-[50%] bg-[#E6E9F5] rounded-lg shadow-sm mb-6">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className="flex p-3 text-sm font-medium  transition-colors"
    >
      <span
        className={`px-3 py-1 rounded-lg transition-colors ${
          activeTab === tab
            ? "bg-white text-gray-900 shadow-sm"
            : "text-[#4B5563]"
        }`}
      >
        {tab}
      </span>
    </button>
  ))}
</div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Upload {activeTab} Images
        </h2>

        {/* Main Upload / Preview Area */}
        <div className="mb-4">
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </div>

          {mainImage ? (
            <div className="mb-4">
              <div className="relative group">
                {/* Image container */}
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
                  <img
                    src={mainImage.url}
                    alt={mainImage.name}
                    className="block max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg pointer-events-none" />

                {/* Delete + Replace buttons */}
                <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteImage(mainImage.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Replace button and hidden input */}
                  {/* 
    <label
      htmlFor={`replace-main-${mainImage.id}`}
      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
    >
      <RotateCcw size={16} />
    </label>
    */}
                  <input
                    id={`replace-main-${mainImage.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    // onChange={(e) => handleReplaceImage(mainImage.id, e)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-gray-500 mb-4">
                  Drag and drop image here, or click to add image
                </div>
                <label
                  htmlFor="main-upload"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Add Image
                </label>
                <input
                  id="main-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 gap-4">
            {thumbnailImages.map((image) => (
              <div key={image.id} className="relative group">
                {/* Image container */}
                <div className="w-full h-32 bg-gray-100 rounded-lg border overflow-hidden flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="block max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-all duration-200 pointer-events-none" />

                {/* Delete button (top-right) */}
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-1 right-1 z-10 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>

                {/* Optional: Replace image logic here */}
                {/* ... */}
              </div>
            ))}

            {currentImages.length < 4 && (
              <div
                className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() =>
                  document.getElementById("thumbnail-upload").click()
                }
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </div>
              </div>
            )}
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePublishChanges}
            className="bg-[#3651BF] text-white px-6 py-3 cursor-pointer rounded-lg font-medium transition-colors"
          >
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadInterface;
