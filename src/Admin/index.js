
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "https://translation-oksx.onrender.com";
// const API_BASE_URL = "http://localhost:5008";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const signupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export function AdminLogin({ setAdmin }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error?.message || "Login failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      if (data.token && data.data) {
      
        localStorage.setItem("adminToken", data.token);
        setAdmin(data.token );
        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/admin/files", { replace: true });
        }, 500);
        
      } else {
        toast.error("User not found", {
          position: "top-right",
          autoClose: 3000,
        });
      }

    } catch (err) {
      toast.error("An error occurred during login", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "url('/images/admin-bg.jpg') no-repeat center center/cover",
      }}
    >
      <ToastContainer />
      <div
        className="card shadow-lg p-4"
        style={{
          width: "350px",
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">Admin Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`form-control ${errors.email && touched.email ? "is-invalid" : ""
                    }`}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`form-control ${errors.password && touched.password ? "is-invalid" : ""
                      }`}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/admin/signup" className="text-decoration-none">
            Sign up here
          </Link>
        </p>

        <p className="mt-2 text-center">
          <Link to="/client/login" className="text-decoration-none">
            Switch to Client Login
          </Link>
        </p>
      </div>
    </div>
  );
}


export function AdminSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        throw new Error(data.message || "Signup failed");
      }
      toast.success("Admin created successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/admin/login");
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "url('/images/admin-bg.jpg') no-repeat center center/cover" }}>
      <ToastContainer />
      <div className="card shadow-lg p-4"
        style={{ width: "350px", background: "rgba(255, 255, 255, 0.85)", borderRadius: "12px" }}>
        <h2 className="text-center mb-4">Admin Signup</h2>

        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting, status, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <Field
                  name="name"
                  placeholder="Full Name"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AdminFiles({ setAdmin }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/file/admin/files`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch files");

        const { data } = await res.json();
        setFiles(data || []);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    navigate("/admin/login");
  };

  const handleTranslateUpload = async (fileId, translatedFile) => {
    const formData = new FormData();
    formData.append("file", translatedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/file/admin/upload/${fileId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload translated file");

      const data = await res.json();

      // ✅ Update local state after successful upload
      const updatedFiles = files.map((file) =>
        file.id === fileId ? { ...file, translated: data.translatedUrl, status: "Completed" } : file
      );
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Error uploading translated file:", error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/file/download/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to download file");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `file_${id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  
  
  
  return (
    <div className="container mt-5">
      <h2>All Files</h2>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Original File</th>
            <th>Status</th>
            <th>Translated File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>
                <button className="btn btn-sm btn-secondary" onClick={() => handleDownload(file.user)}>
                  Download
                </button>
              </td>
              <td>{file.status}</td>
              <td>
                {file.translated ? (
                  <button className="btn btn-sm btn-success" onClick={() => handleDownload(file.user)}>
                    Download
                  </button>
                ) : (
                  "Pending"
                )}
              </td>
              <td>
                {!file.translated && (
                  <input
                    type="file"
                    onChange={(e) => handleTranslateUpload(file.id, e.target.files[0])}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
