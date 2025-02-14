import { PickerOverlay } from "filestack-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export function ClientLogin({setUser}) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/client/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.error?.message || "Login failed", { autoClose: 3000 });
        return;
      }
  
      if (data.token && data.data) {
        localStorage.setItem("clientToken", data.token);  
        setUser(data.token);  
        toast.success("Successfully logged in!", { autoClose: 1000 });
  
        // ✅ Delay navigation slightly to allow state update
        setTimeout(() => {
          navigate("/client/files", { replace: true });
        }, 500);
      } else {
        toast.error("User not found", { autoClose: 3000 });
      }
    } catch (err) {
      toast.error("An error occurred during login", { autoClose: 3000 });
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "url('/images/client-bg.jpg') no-repeat center center/cover",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="card shadow-lg p-4"
        style={{
          width: "350px",
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">Client Login</h2>

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
                  className={`form-control ${
                    errors.email && touched.email ? "is-invalid" : ""
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
                    className={`form-control ${
                      errors.password && touched.password ? "is-invalid" : ""
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
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
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
          <Link to="/client/signup" className="text-decoration-none">
            Sign up here
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link to="/admin/login" className="text-decoration-none">
            Switch to Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

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

export function ClientSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/client/signup`, {
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

      if (!response.ok || data.error) {
        const errorMessage =
          data.error?.message || data.message || "Signup failed";

        if (errorMessage.toLowerCase().includes("email already in use")) {
          setFieldError("email", "Email is already registered");
          toast.error("Email already in use", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (data.message?.toLowerCase().includes("successfully")) {
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            navigate("/client/login");
          },
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An error occurred during signup", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "url('/images/client-bg.jpg') no-repeat center center/cover",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="card shadow-lg p-4"
        style={{
          width: "350px",
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">Client Signup</h2>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <Field
                  name="name"
                  placeholder="Full Name"
                  className={`form-control ${
                    errors.name && touched.name ? "is-invalid" : ""
                  }`}
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
                  className={`form-control ${
                    errors.email && touched.email ? "is-invalid" : ""
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
                    className={`form-control ${
                      errors.password && touched.password ? "is-invalid" : ""
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
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`form-control ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "is-invalid"
                        : ""
                    }`}
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
                  <div className="invalid-feedback d-block">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
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
          <Link to="/client/login" className="text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export function MyFiles({ user, setUser }) {
  const [files, setFiles] = useState( [] );
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();






 useEffect(() => {
    const fetchFiles = async (id) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/file/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("clientToken")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch files");

        const  {data}  = await res.json();
        console.log(data,"ewfe")
        setFiles(data || []);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    setUser(null);
    navigate("/client/login");
  };





  // ✅ File Upload Handler
  const handleUpload = async (response) => {
    try {
      if (!response.filesUploaded || response.filesUploaded.length === 0) {
        alert("No file uploaded!");
        return;
      }
  
      const uploadedFile = response.filesUploaded[0];
  
      const formData = new FormData();
      formData.append("fileUrl", uploadedFile.url);
      formData.append("fileType", uploadedFile.mimetype || "unknown"); // ✅ Include fileType
  
      console.log([...formData.entries()], "FormData......."); // Debugging
  
      const res = await fetch(`${API_BASE_URL}/api/file/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("clientToken")}` },
        body: formData, // ✅ Send as FormData
      });
  
      const data = await res.json();
      if (!res.ok) {
        alert("Upload failed: " + data.message);
        return;
      }
  
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed, please try again.");
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Files</h2>
        <button className="btn btn-success" onClick={() => setShowUpload(true)}>
          Upload File
        </button>
      </div>

      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>

      {showUpload && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 rounded shadow">
            <h4>Upload a File</h4>
            <PickerOverlay
              apikey={process.env.REACT_APP_FILESTACK_API_KEY} // ✅ Ensure this is defined
              onUploadDone={handleUpload}
              onError={() => alert("Upload error")}
            />
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowUpload(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>From</th>
              <th>To</th>
              <th>TAT</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files
              .filter((f) => f.clientId === user.id)
              .map((file) => (
                <tr key={file.id}>
                  <td>English</td>
                  <td>Arbic</td>
                  <td>-</td>
                  <td>
                    <span
                      className={`badge ${
                        file.status === "Uploaded" ? "bg-warning" : "bg-success"
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td>
                    {file.translated ? (
                      <a
                        href={file.translated}
                        className="btn btn-sm btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-muted">Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
