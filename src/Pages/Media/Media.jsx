import React, { useState, useCallback, useEffect } from "react";
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
  const [existingImages, setExistingImages] = useState({
    "Hero Banner": [],
    "Media Gallery": [],
    "Awards & Certificates": [],
  });
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = ["Hero Banner", "Media Gallery", "Awards & Certificates"];
  const apiEndpoints = {
    "Hero Banner": `${Base_url}/api/admin/upload-image/`,
    "Media Gallery": `${Base_url}/api/admin/upload-media-gallery/`,
    "Awards & Certificates": `${Base_url}/api/admin/upload-certifications-award/`,
  };

  const fetchEndpoints = {
    "Hero Banner": `${Base_url}/api/home-top-images/`,
    "Media Gallery": `${Base_url}/api/media-gallery/`,
    "Awards & Certificates": `${Base_url}/api/certification-and-award/`,
  };

  // **CHANGED: Keep same endpoints as upload for delete**
  const deleteEndpoints = {
    "Hero Banner": `${Base_url}/api/admin/upload-image/`,
    "Media Gallery": `${Base_url}/api/admin/upload-media-gallery/`,
    "Awards & Certificates": `${Base_url}/api/admin/upload-certifications-award/`,
  };

  const token = localStorage.getItem("token");

  // Fetch existing images for the active tab
  const fetchExistingImages = useCallback(async (tab) => {
    setLoading(true);
    try {
      const response = await axios.get(fetchEndpoints[tab], {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      let images = [];
      if (tab === "Hero Banner") {
        // Direct array response
        images = response.data.map(item => ({
          id: `existing_${item.id}`,
          url: item.image_url,
          name: `Image ${item.id}`,
          isExisting: true,
          originalId: item.id
        }));
      } else {
        // Response with data property
        images = response.data.data.map(item => ({
          id: `existing_${item.id}`,
          url: item.image,
          name: `Image ${item.id}`,
          isExisting: true,
          originalId: item.id
        }));
      }

      setExistingImages(prev => ({
        ...prev,
        [tab]: images
      }));
    } catch (error) {
      console.error(`Failed to fetch ${tab} images:`, error);
      toast.error(`Failed to load existing ${tab} images`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch images when component mounts or tab changes
  useEffect(() => {
    fetchExistingImages(activeTab);
  }, [activeTab, fetchExistingImages]);

  const handlePublishChanges = async () => {
    const currentImages = tabImages[activeTab] || [];
    const endpoint = apiEndpoints[activeTab];
  
    if (!endpoint) {
      toast.error("Invalid tab selected.");
      return;
    }
  
    try {
      setLoading(true);

      // **CHANGED: Removed deletion logic from publish - now handled immediately**
      // Upload new images only
      if (currentImages.length > 0) {
        const formData = new FormData();
        currentImages.forEach((image) => {
          if (image.file) { // Only upload new files
            formData.append('image', image.file);
          }
        });
  
        const response = await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }
  
      toast.success(`${activeTab} images uploaded successfully!`);
      
      // Clear new uploads only
      setTabImages(prev => ({
        ...prev,
        [activeTab]: []
      }));
      
      // Refresh the existing images
      await fetchExistingImages(activeTab);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
          url: e.target.result,
          name: file.name,
          size: file.size,
          isExisting: false,
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

  const deleteNewImage = useCallback(
    (imageId) => {
      setTabImages((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((img) => img.id !== imageId),
      }));
    },
    [activeTab]
  );

  const deleteExistingImage = useCallback(
    async (imageId, originalId) => {
      try {
        // **CHANGED: Send id instead of image_id in FormData body**
        const formData = new FormData();
        formData.append('id', originalId);
        
        await axios.delete(deleteEndpoints[activeTab], {
          headers: {
            Authorization: `Token ${token}`,
          },
          data: formData
        });
        
        // Remove from existing images display after successful deletion
        setExistingImages((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((img) => img.id !== imageId),
        }));
        
        toast.success("Image deleted successfully!");
      } catch (error) {
        console.error(`Failed to delete image ${originalId}:`, error);
        toast.error("Failed to delete image. Please try again.");
      }
    },
    [activeTab, token]
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

  // Combine existing and new images for display
  const currentExistingImages = existingImages[activeTab] || [];
  const currentNewImages = tabImages[activeTab] || [];
  const allImages = [...currentExistingImages, ...currentNewImages];
  
  // **CHANGED: Different limits for different tabs - Hero Banner: 4, Others: 9**
  const maxImages = activeTab === "Hero Banner" ? 4 : 9;
  const thumbnailImages = activeTab === "Hero Banner" ? allImages.slice(0, 3) : allImages.slice(0, maxImages - 1);
  const mainImage = allImages.length >= maxImages ? allImages[maxImages - 1] : null;

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Upload Media
      </h1>

      {/* Status indicator - CHANGED: Removed since deletion is immediate */}
      {currentNewImages.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            {currentNewImages.length} new image(s) ready to upload. Click "Publish Changes" to upload.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex w-[50%] bg-[#E6E9F5] rounded-lg shadow-sm mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex p-3 text-sm font-medium transition-colors"
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

        {loading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Loading images...</p>
          </div>
        )}

        {/* Main Upload / Preview Area */}
        <div className="mb-4">
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </div>

          {/* **CHANGED: Show main image area for all tabs** */}
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

                {/* Delete button */}
                <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => 
                      mainImage.isExisting 
                        ? deleteExistingImage(mainImage.id, mainImage.originalId)
                        : deleteNewImage(mainImage.id)
                    }
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Show if this is an existing image */}
                {mainImage.isExisting && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Existing
                  </div>
                )}
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
          {/* **CHANGED: Grid layout changes based on tab - 4 columns for Hero Banner, 3 for others** */}
          <div className={`grid gap-4 ${activeTab === "Hero Banner" ? "grid-cols-4" : "grid-cols-3"}`}>
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
                  onClick={() => 
                    image.isExisting 
                      ? deleteExistingImage(image.id, image.originalId)
                      : deleteNewImage(image.id)
                  }
                  className="absolute top-1 right-1 z-10 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>

                {/* Show if this is an existing image */}
                {image.isExisting && (
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs">
                    Existing
                  </div>
                )}
              </div>
            ))}

            {/* **CHANGED: Add image slots based on tab limits** */}
            {allImages.length < maxImages && (
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
          {/* **CHANGED: Always show button when there are new images to upload** */}
          {currentNewImages.length > 0 && (
            <button
              type="button"
              onClick={handlePublishChanges}
              disabled={loading}
              className={`px-6 py-3 cursor-pointer rounded-lg font-medium transition-colors ${
                loading 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-[#3651BF] text-white hover:bg-[#2C4299]"
              }`}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadInterface;

// import React, { useState, useCallback } from "react";
// import { Plus, RotateCcw, Trash2 } from "lucide-react";
// import Base_url from "../../Base_url/Baseurl";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// const MediaUploadInterface = () => {
//   const [activeTab, setActiveTab] = useState("Hero Banner");
//   const [tabImages, setTabImages] = useState({
//     "Hero Banner": [],
//     "Media Gallery": [],
//     "Awards & Certificates": [],
//   });

//   const tabs = ["Hero Banner", "Media Gallery", "Awards & Certificates"];
//   const apiEndpoints = {
//     "Hero Banner": `${Base_url}/api/admin/upload-image/`,
//     "Media Gallery": `${Base_url}/api/admin/upload-media-gallery/`,
//     "Awards & Certificates": `${Base_url}/api/admin/upload-certifications-award/`,
//   };
// const token=localStorage.getItem("token")
//   const handlePublishChanges = async () => {
//     const currentImages = tabImages[activeTab] || [];
//     const endpoint = apiEndpoints[activeTab];
  
//     if (!endpoint) {
//       toast.error("Invalid tab selected.");
//       return;
//     }
  
//     try {
//       const formData = new FormData();
//       currentImages.forEach((image) => {
//         formData.append('image', image.file);
//       });
  
      
  
//       const response = await axios.post(endpoint, formData,
        
//         {
//         headers: {
          
//           Authorization: `Token ${token}`,
//           // Note: Don't set Content-Type manually, let axios handle it with FormData
//         },
//       });
  
//       toast.success(`${activeTab} images uploaded successfully!`);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       const errorMessage =
//         error.response?.data?.message || "Upload failed. Please try again.";
//       toast.error(errorMessage);
//     }
//   };
  

//   const processFile = useCallback((file) => {
//     return new Promise((resolve) => {
//       if (!file || !file.type.startsWith("image/")) {
//         resolve(null);
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         resolve({
//           id: Date.now() + Math.random(),
//           file,
//           url: e.target.result, // base64 data URL
//           name: file.name,
//           size: file.size,
//         });
//       };
//       reader.onerror = () => {
//         console.error("Error reading file");
//         resolve(null);
//       };
//       reader.readAsDataURL(file);
//     });
//   }, []);

//   const processFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const arr = Array.from(files);
//       const imgs = [];
//       for (let f of arr) {
//         const img = await processFile(f);
//         if (img) imgs.push(img);
//       }
//       if (imgs.length) {
//         setTabImages((prev) => ({
//           ...prev,
//           [activeTab]: [...(prev[activeTab] || []), ...imgs],
//         }));
//       }
//     },
//     [activeTab, processFile]
//   );

//   const handleFileUpload = useCallback(
//     (e) => {
//       processFiles(e.target.files);
//       e.target.value = "";
//     },
//     [processFiles]
//   );

//   const handleReplaceImage = useCallback(
//     async (imageId, e) => {
//       const file = e.target.files[0];
//       if (!file || !file.type.startsWith("image/")) {
//         e.target.value = "";
//         return;
//       }
//       // remove old URL if we had used createObjectURL, but here we use base64 so skip
//       const newImage = await processFile(file);
//       if (newImage) {
//         setTabImages((prev) => ({
//           ...prev,
//           [activeTab]: prev[activeTab].map((img) =>
//             img.id === imageId ? { ...newImage, id: imageId } : img
//           ),
//         }));
//       }
//       e.target.value = "";
//     },
//     [activeTab, processFile]
//   );

//   const deleteImage = useCallback(
//     (imageId) => {
//       setTabImages((prev) => ({
//         ...prev,
//         [activeTab]: prev[activeTab].filter((img) => img.id !== imageId),
//       }));
//     },
//     [activeTab]
//   );

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   }, []);

//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       processFiles(e.dataTransfer.files);
//     },
//     [processFiles]
//   );

//   const currentImages = tabImages[activeTab] || [];
//   const thumbnailImages = currentImages.slice(0, 3);
//   const mainImage = currentImages.length >= 4 ? currentImages[3] : null;

//   return (
//     <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         Upload Media
//       </h1>

//       {/* Tabs */}
//       <div className="flex w-[50%] bg-[#E6E9F5] rounded-lg shadow-sm mb-6">
//   {tabs.map((tab) => (
//     <button
//       key={tab}
//       onClick={() => setActiveTab(tab)}
//       className="flex p-3 text-sm font-medium  transition-colors"
//     >
//       <span
//         className={`px-3 py-1 rounded-lg transition-colors ${
//           activeTab === tab
//             ? "bg-white text-gray-900 shadow-sm"
//             : "text-[#4B5563]"
//         }`}
//       >
//         {tab}
//       </span>
//     </button>
//   ))}
// </div>

//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h2 className="text-lg font-medium text-gray-800 mb-4">
//           Upload {activeTab} Images
//         </h2>

//         {/* Main Upload / Preview Area */}
//         <div className="mb-4">
//           <div className="block text-sm font-medium text-gray-700 mb-2">
//             Image
//           </div>

//           {mainImage ? (
//             <div className="mb-4">
//               <div className="relative group">
//                 {/* Image container */}
//                 <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
//                   <img
//                     src={mainImage.url}
//                     alt={mainImage.name}
//                     className="block max-w-full max-h-full object-contain"
//                   />
//                 </div>

//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg pointer-events-none" />

//                 {/* Delete + Replace buttons */}
//                 <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button
//                     onClick={() => deleteImage(mainImage.id)}
//                     className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                   >
//                     <Trash2 size={16} />
//                   </button>

//                   {/* Replace button and hidden input */}
//                   {/* 
//     <label
//       htmlFor={`replace-main-${mainImage.id}`}
//       className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
//     >
//       <RotateCcw size={16} />
//     </label>
//     */}
//                   <input
//                     id={`replace-main-${mainImage.id}`}
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     // onChange={(e) => handleReplaceImage(mainImage.id, e)}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div
//               className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-gray-400 transition-colors"
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             >
//               <div className="flex flex-col items-center">
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                   <Plus className="w-6 h-6 text-blue-500" />
//                 </div>
//                 <div className="text-gray-500 mb-4">
//                   Drag and drop image here, or click to add image
//                 </div>
//                 <label
//                   htmlFor="main-upload"
//                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
//                 >
//                   Add Image
//                 </label>
//                 <input
//                   id="main-upload"
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Thumbnail Grid */}
//           <div className="grid grid-cols-4 gap-4">
//             {thumbnailImages.map((image) => (
//               <div key={image.id} className="relative group">
//                 {/* Image container */}
//                 <div className="w-full h-32 bg-gray-100 rounded-lg border overflow-hidden flex items-center justify-center">
//                   <img
//                     src={image.url}
//                     alt={image.name}
//                     className="block max-w-full max-h-full object-contain"
//                   />
//                 </div>

//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/50 transition-all duration-200 pointer-events-none" />

//                 {/* Delete button (top-right) */}
//                 <button
//                   onClick={() => deleteImage(image.id)}
//                   className="absolute top-1 right-1 z-10 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
//                 >
//                   <Trash2 size={12} />
//                 </button>

//                 {/* Optional: Replace image logic here */}
//                 {/* ... */}
//               </div>
//             ))}

//             {currentImages.length < 4 && (
//               <div
//                 className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
//                 onClick={() =>
//                   document.getElementById("thumbnail-upload").click()
//                 }
//               >
//                 <div className="text-center">
//                   <Plus className="w-6 h-6 text-blue-500 mx-auto mb-1" />
//                   <span className="text-xs text-gray-500">Add Image</span>
//                 </div>
//               </div>
//             )}
//             <input
//               id="thumbnail-upload"
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={handlePublishChanges}
//             className="bg-[#3651BF] text-white px-6 py-3 cursor-pointer rounded-lg font-medium transition-colors"
//           >
//             Publish Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaUploadInterface;
