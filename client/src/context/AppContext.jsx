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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  const loadCreditsData = async () => {
    try {
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
    uncropImage
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
