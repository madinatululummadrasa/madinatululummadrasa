/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ReusableForm = ({
  endpoint,
  fields,
  initialValues = {},
  buttonText = "Submit",
  onSuccess,
  onError,
  onChange,
  validationFn,
  grid = false,
  buttons = [],
  styleMode = "default" // NEW PROP
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const secureAxios = useAxiosSecure();
  const firstFieldRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(initialValues);
  }, []);

  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const updated = {
      ...formData,
      [name]: type === "file" ? files[0] : value,
    };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const validate = async () => {
    const newErrors = {};
    for (let field of fields) {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} আবশ্যক`;
      }
      if (field.validate) {
        const customError = await field.validate(formData[field.name], formData);
        if (customError) newErrors[field.name] = customError;
      }
    }
    if (validationFn) {
      const customErrors = await validationFn(formData);
      Object.assign(newErrors, customErrors);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;
    setLoading(true);
    try {
      const formToSend = { ...formData };
      for (let field of fields) {
        if (field.type === "file" && formData[field.name]) {
          const fileForm = new FormData();
          fileForm.append("file", formData[field.name]);
          const res = await secureAxios.post("/upload-google-drive", fileForm);
          formToSend[field.name] = res.data.url || res.data.imageUrl || res.data.pdfUrl;
        }
      }
      const res = await secureAxios.post(endpoint, formToSend);
      if (onSuccess) onSuccess(res);
      setFormData(initialValues);
      setErrors({});
    } catch (err) {
      if (onError) onError(err);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialValues);
    setErrors({});
  };

  const modernInputClass =
    "w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";
  const modernLabelClass = "block text-sm font-medium text-gray-700 mb-1";

  const renderField = (field, index) => {
    const isModern = styleMode === "modern";

    const commonProps = {
      name: field.name,
      value: formData[field.name] || "",
      onChange: handleChange,
      placeholder: field.placeholder || "",
      className: isModern ? modernInputClass : "w-full border rounded p-2",
    };

    if (field.hidden && formData[field.hidden.dependsOn] !== field.hidden.value) {
      return null;
    }

    return (
      <div key={field.name} className="space-y-1">
        <label className={isModern ? modernLabelClass : "block text-sm font-medium text-gray-700"}>
          {field.label}
        </label>
        {field.description && <p className="text-xs text-gray-500 mb-1">{field.description}</p>}

        {field.type === "select" ? (
          <select {...commonProps}>
            <option value="">-- নির্বাচন করুন --</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === "file" ? (
          <input
            type="file"
            name={field.name}
            accept={field.accept || "*"}
            onChange={handleChange}
            className={isModern ? modernInputClass : commonProps.className}
          />
        ) : field.type === "textarea" ? (
          <textarea
            {...commonProps}
            rows={4}
            ref={index === 0 ? firstFieldRef : null}
          />
        ) : field.type === "date" ? (
          <input
            type="date"
            {...commonProps}
            ref={index === 0 ? firstFieldRef : null}
          />
        ) : (
          <input
            type={field.type || "text"}
            {...commonProps}
            ref={index === 0 ? firstFieldRef : null}
          />
        )}

        {errors[field.name] && (
          <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${grid ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : ""} ${
        styleMode === "modern" ? "bg-white p-6 rounded-xl shadow-xl" : ""
      }`}
    >
      {fields.map((field, i) => renderField(field, i))}

      <div className="col-span-2 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 ${
            styleMode === "modern"
              ? "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow"
              : "w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          }`}
        >
          {loading ? "লোড হচ্ছে..." : buttonText}
        </button>

        {buttons.map((btn, idx) => {
          const baseClass =
            "flex-1 py-2 px-4 rounded-md text-white font-semibold shadow";
          if (btn.type === "navigate") {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(btn.to)}
                className={`${baseClass} bg-green-600 hover:bg-green-700`}
              >
                {btn.label}
              </button>
            );
          }

          if (btn.type === "reset") {
            return (
              <button
                key={idx}
                type="button"
                onClick={handleReset}
                className={`${baseClass} bg-yellow-600 hover:bg-yellow-700`}
              >
                {btn.label}
              </button>
            );
          }

          if (btn.type === "custom" && typeof btn.onClick === "function") {
            return (
              <button
                key={idx}
                type="button"
                onClick={btn.onClick}
                className={`${baseClass} bg-gray-600 hover:bg-gray-700`}
              >
                {btn.label}
              </button>
            );
          }

          return null;
        })}
      </div>
    </form>
  );
};

export default ReusableForm;





/* 
a complete usage 

 const [successMessage, setSuccessMessage] = useState("");

  const studentFields = [
    { name: "name", label: "নাম", required: true },
    { name: "studentId", label: "আইডি", required: true },
    { name: "class", label: "শ্রেণী", required: true, type: "select", options: ["প্রথম", "দ্বিতীয়", "তৃতীয়"] },
    { name: "status", label: "অবস্থা", type: "select", options: ["সক্রিয়", "নিষ্ক্রিয়"], required: true },
    { name: "address", label: "ঠিকানা", required: false },
    { name: "feeType", label: "বেতনের ধরন", type: "select", options: ["বেতন", "ফ্রি", "আংশিক"], required: true },

    // Profile Image
    { name: "profileImageUrl", label: "ছবি", type: "file", accept: "image/*", required: true },

    // Guardian info
    { name: "guardian.name", label: "অভিভাবকের নাম", required: true },
    { name: "guardian.phone", label: "মোবাইল", required: true },
    { name: "guardian.password", label: "পাসওয়ার্ড", required: true },
  ];

  const handleSuccess = (res) => {
    setSuccessMessage("ছাত্র সফলভাবে যোগ করা হয়েছে!");
  };

  const validatePhone = (value) => {
    if (!/^01[3-9]\d{8}$/.test(value)) {
      return "বৈধ মোবাইল নম্বর লিখুন (১১ ডিজিট)";
    }
    return null;
  };

  const handleCustomValidation = async (formData) => {
    const errors = {};
    if (formData["guardian.phone"]) {
      const error = validatePhone(formData["guardian.phone"]);
      if (error) errors["guardian.phone"] = error;
    }
    return errors;
  };








  

*/