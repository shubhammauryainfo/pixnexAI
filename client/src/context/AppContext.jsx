import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  const loadCreditsData = async () => {
    try {
      setIsAuthLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/image/generate-image", { prompt }, { headers: { token } })
      if (data.success) {
        loadCreditsData()
        return data.resultImage
      }
      else {
        toast.error(data.message)
        if (data.creditBalance === 0) {
          navigate("/buy")
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const cleanupImage = async (imageFile, maskFile) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/cleanup",
        { imageFile, maskFile },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const upscaleImage = async (imageFile, targetWidth, targetHeight) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/upscale",
        { imageFile, targetWidth, targetHeight },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeBackgroundImage = async (imageFile) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/remove-background",
        { imageFile },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeTextImage = async (imageFile) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/remove-text",
        { imageFile },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const replaceBackgroundImage = async (imageFile, prompt) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/replace-background",
        { imageFile, prompt },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const uncropImage = async (imageFile, { left, right, up, down }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/uncrop",
        {
          imageFile,
          extendLeft: left,
          extendRight: right,
          extendUp: up,
          extendDown: down
        },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        toast.success(data.message);
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/admin/users",
        { headers: { token } }
      );
      if (data.success) {
        return data.users;
      }
      toast.error(data.message || "Failed to load users");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return [];
  };

  const adminCreateUser = async ({ name, email, password, role, creditBalance }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/admin/users",
        { name, email, password, role, creditBalance },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("User created");
        return data.user;
      }
      toast.error(data.message || "Failed to create user");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return null;
  };

  const adminUpdateCredits = async (id, credits) => {
    try {
      const { data } = await axios.patch(
        backendUrl + `/api/user/admin/users/${id}/credits`,
        { credits },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Credits updated");
        return data.user;
      }
      toast.error(data.message || "Failed to update credits");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return null;
  };

  const adminDeleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        backendUrl + `/api/user/admin/users/${id}`,
        { headers: { token } }
      );
      if (data.success) {
        toast.success("User deleted");
        return true;
      }
      toast.error(data.message || "Failed to delete user");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return false;
  };

  const shortenUrl = async ({ url, customAlias }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/utility/shorten",
        { url, customAlias },
        { headers: { token } }
      );
      if (data.success) {
        loadCreditsData();
        return data.data;
      }
      toast.error(data.message || "Failed to shorten URL");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return null;
  };

  const listShortUrls = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/utility/shorten", {
        headers: { token },
      });
      if (data.success) {
        return data.urls;
      }
      toast.error(data.message || "Failed to load URLs");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return [];
  };

  const deleteShortUrl = async (id) => {
    try {
      const { data } = await axios.delete(
        backendUrl + `/api/utility/shorten/${id}`,
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Short URL deleted");
        return true;
      }
      toast.error(data.message || "Failed to delete URL");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return false;
  };

  const summarizeText = async (text) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/utility/summarize",
        { text },
        { headers: { token } }
      );
      if (data.success) {
        return data;
      }
      toast.error(data.message || "Failed to summarize");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return null;
  };

  const fetchAdminStats = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/admin/stats",
        { headers: { token } }
      );
      if (data.success) {
        return data;
      }
      toast.error(data.message || "Failed to load stats");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    return { stats: { totalUsers: 0, totalCreditsUsed: 0 }, recentLogins: [] };
  };

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    cleanupImage,
    upscaleImage,
    removeBackgroundImage,
    removeTextImage,
    replaceBackgroundImage,
    uncropImage,
    isAuthLoading,
    fetchAdminUsers,
    adminCreateUser,
    adminUpdateCredits,
    adminDeleteUser,
    fetchAdminStats,
    shortenUrl,
    listShortUrls,
    deleteShortUrl,
    summarizeText
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
