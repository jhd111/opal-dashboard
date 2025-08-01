import { useState } from "react";
import { Plus, CreditCard, MessageCircle, X } from "lucide-react";

import { fetchResults } from "../../Services/GetResults";

import Base_url from "../../Base_url/Baseurl";

import { toast } from "react-hot-toast";


export default function PaymentInformation() {
  const {
    data: ResultsApi,
    isLoading,
    error,
    refetch
  } = fetchResults("add-payment", "/api/admin/add-payment-information/")

  const [paymentInfos, setPaymentInfos] = useState([]);

  const token=localStorage.getItem("token")

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    accountTitle: "",
    bankName: "",
    iban: "",
    accountNumber: "",
    whatsappNumber: "",
    policy: ""
  });

  const resetForm = () => {
    setFormData({
      accountTitle: "",
      bankName: "",
      iban: "",
      accountNumber: "",
      whatsappNumber: "",
      policy: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      accountTitle: item.account_title || "",
      bankName: item.bank_name || "",
      iban: item.iban_number || "",
      accountNumber: item.account_number || "",
      whatsappNumber: item.whatsapp_number || "",
      policy: item.policy || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.accountTitle || !formData.bankName || !formData.iban || !formData.accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      iban_number: formData.iban,
      account_number: formData.accountNumber,
      account_title: formData.accountTitle,
      bank_name: formData.bankName,
      whatsapp_number: formData.whatsappNumber,
      policy: formData.policy
    };

    // Add ID to payload for edit operations
    if (editingItem) {
      payload.id = editingItem.id;
    }

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = `${Base_url}/api/admin/add-payment-information/`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Add your auth headers here if needed
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        let result = null;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text) {
            result = JSON.parse(text);
          }
        }
        
        if (editingItem) {
          // Update existing item in local state
          setPaymentInfos(prev => 
            prev.map(item => 
              item.id === editingItem.id ? { ...item, ...result } : item
            )
          );
        } else {
          // Add new item to local state
          if (result) {
            setPaymentInfos(prev => [...prev, result]);
          }
        }

        resetForm();
        setIsModalOpen(false);
        setEditingItem(null);
        toast.success(editingItem ? 'Payment information updated successfully!' : 'Payment information added successfully!');
        
        refetch();
        // Optionally refetch data to ensure sync
        // You might want to trigger a refetch of ResultsApi data here
        
      } else {
        // Handle error response
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to save payment information';
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const text = await response.text();
            if (text) {
              const errorData = JSON.parse(text);
              toast.error('Error:', errorData);
              errorMessage = errorData.message || errorMessage;
            }
          } catch (e) {
            toast.error('Error parsing error response:', e);
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred. Please try again.');
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (!editingItem) { // Only allow "Save and Add Another" for new entries
      await handleSubmit();
      if (!isModalOpen) { // If modal closed successfully, open for new entry
        openAddModal();
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-gray-50 min-h-screen">
      {/* <Toaster position="top-right" /> */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Payment Informations</h1>
      
      {ResultsApi?.data?.length === 0 || !ResultsApi?.data ? (
        // Empty State
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <button
                onClick={openAddModal}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Add Payment Information
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Payment Information List
        <div className="space-y-6">
          {/* <div className="flex justify-end mb-4">
            <button
              onClick={openAddModal}
              className="bg-[#3651BF] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Payment Info
            </button>
          </div> */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ResultsApi?.data?.map((info, index) => (
              <div key={info.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Information {index + 1}</h3>
                <div className="flex flex-col items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{info?.iban_number}</div>
                    <div className="text-sm text-gray-600">{info?.account_title}</div>
                    <div className="text-sm text-gray-600">{info?.bank_name} {info?.account_number}</div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 mt-2">Whatsapp</h3>
                  <div className="flex items-center w-full justify-between">
                    <div>
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{info?.whatsapp_number}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditModal(info)}
                      className="bg-[#3651BF] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Information
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
          <div className="bg-white rounded-lg w-[95%] lg:w-[60%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingItem ? 'Edit Payment Information' : 'Add Payment Information'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Details */}
                <div className="border border-gray-200 rounded-lg p-6 md:col-span-2">
                  <h3 className="font-medium text-gray-700 mb-4">Basic Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Title *
                      </label>
                      <input
                        type="text"
                        name="accountTitle"
                        value={formData.accountTitle}
                        onChange={handleInputChange}
                        placeholder="OPAL INSTITUTE"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="UBL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IBAN *
                      </label>
                      <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleInputChange}
                        placeholder="PK65 UNIL 56372189"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="456789876865"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy
                      </label>
                      <textarea
                        name="policy"
                        value={formData.policy}
                        onChange={handleInputChange}
                        placeholder="Enter policy details..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Basic Details Buttons */}
                  <div className="flex justify-center space-x-1 mt-6 pt-4 border-gray-200">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    {!editingItem && (
                      <button
                        onClick={handleSaveAndAddAnother}
                        className="px-3 py-2 bg-[#3651BF] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save and Add Another
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-3 py-1 bg-[#3651BF] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                    </button>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="border border-gray-200 rounded-lg p-6 md:col-span-1 h-fit">
                  <h3 className="font-medium text-gray-700 mb-4">WhatsApp Number</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Number
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="0332-1762829"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#3651BF] text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}