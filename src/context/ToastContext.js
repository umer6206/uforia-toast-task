import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  onMessage,
  saveLikedFormSubmission,
  fetchLikedFormSubmissions,
} from "../service/mockServer";

// Create context
const ToastContext = createContext();

// Toast reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case "LIKE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
        likedSubmissions: [...state.likedSubmissions, action.payload],
      };
    case "SET_LIKED_SUBMISSIONS":
      return { ...state, likedSubmissions: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Toast provider
export const ToastProvider = ({ children }) => {
  const initialState = {
    toasts: [],
    likedSubmissions: [],
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Load liked submissions on mount
  useEffect(() => {
    const loadLikedSubmissions = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetchLikedFormSubmissions();
        dispatch({
          type: "SET_LIKED_SUBMISSIONS",
          payload: response.formSubmissions,
        });
      } catch (error) {
        console.error("Failed to fetch liked submissions:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load liked submissions",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadLikedSubmissions();
  }, []);

  // Listen for new form submissions
  useEffect(() => {
    onMessage((formSubmission) => {
      dispatch({ type: "ADD_TOAST", payload: formSubmission });
    });
  }, []);

  // Handle liking a submission
  const likeSubmission = async (formSubmission) => {
    const likedSubmission = {
      ...formSubmission,
      data: {
        ...formSubmission.data,
        liked: true,
      },
    };

    try {
      await saveLikedFormSubmission(likedSubmission);
      dispatch({ type: "LIKE_TOAST", payload: likedSubmission });
    } catch (error) {
      console.error("Failed to save liked submission:", error);
      // Show error toast or feedback
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to save liked submission",
      });
    }
  };

  // Handle dismissing a toast
  const dismissToast = (id) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        likedSubmissions: state.likedSubmissions,
        loading: state.loading,
        error: state.error,
        likeSubmission,
        dismissToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
