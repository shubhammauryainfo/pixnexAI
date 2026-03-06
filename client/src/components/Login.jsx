import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const [state, setState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          toast.success("Login successful");
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          toast.success("Account created successfully");
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const subtitle =
    state === "Login"
      ? "Welcome back! Please login to continue"
      : "Create your account to get started";

  return (
    <div className="fixed left-0 top-0 bottom-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-center text-neutral-700 text-2xl font-medium">
            {state}
          </h1>
          <p className="text-sm">{subtitle}</p>
          {state !== "Login" && (
            <div className="border px-5 py-2 flex items-center gap-1 rounded-full mt-5">
              <img className="w-5" src={assets.profile_icon} />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="outline-none text-sm"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.email_icon} />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none text-sm"
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.lock_icon} />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none text-sm"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="bg-blue-600 w-full text-white py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? state === "Login"
                ? "Logging in..."
                : "Creating account..."
              : state === "Login"
                ? "Login"
                : "Create Account"}
          </motion.button>
          {state === "Login" ? (
            <p className="mt-5 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 cursor-pointer"
              >
                Sign up
              </span>
            </p>
          ) : (
            <p className="mt-5 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          )}
        </motion.div>

        <img
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
        />
      </motion.form>
    </div>
  );
};

export default Login;
