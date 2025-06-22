/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ReusableForm = ({
  endpoint,
  fields,
  initialValues = {},
  buttonText = "Submit",
  onSuccess,
  onError,
  validationFn,
  grid = false, // optional: display in grid format
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const secureAxios = useAxiosSecure();
  const firstFieldRef = useRef(null);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
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
      setFormData(initialValues); // reset form
      setErrors({});
    } catch (err) {
      if (onError) onError(err);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, index) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name] || "",
      onChange: handleChange,
      placeholder: field.placeholder || "",
      className: "w-full border rounded p-2",
    };

    if (field.hidden && formData[field.hidden.dependsOn] !== field.hidden.value) {
      return null;
    }

    return (
      <div key={field.name} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
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
            className={commonProps.className}
          />
        ) : (
          <input
            ref={index === 0 ? firstFieldRef : null}
            type={field.type || "text"}
            {...commonProps}
          />
        )}

        {errors[field.name] && (
          <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${grid ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : ""}`}>
      {fields.map((field, i) => renderField(field, i))}

      <div className="col-span-2 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "লোড হচ্ছে..." : buttonText}
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData(initialValues);
            setErrors({});
          }}
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          রিসেট করুন
        </button>
      </div>
    </form>
  );
};

export default ReusableForm;
