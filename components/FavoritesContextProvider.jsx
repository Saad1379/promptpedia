"use client";

import { useSession } from "next-auth/react";
import { useState, createContext, useEffect } from "react";

const FavoritesContext = createContext();

const FavoritesContextProvider = ({ children }) => {
  const { data: session } = useSession();
  const [favoritesPrompts, setFavoritesPrompts] = useState([]);
  const saveFavorites = async (postId) => {
    try {
      const response = await fetch(
        `/api/prompt/favorites/${session?.user.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: session?.user.id,
            postId: postId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFavoritesPrompts(data);
      } else {
        console.log("Failed to remove prompt from favorites");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFavorite = async (postId) => {
    try {
      const response = await fetch(
        `/api/prompt/favorites/${session?.user.id}/${postId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data !== null) {
        setFavoritesPrompts(data);
      } else {
        console.log("Failed to remove prompt from favorites");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch(
        `/api/prompt/favorites/${session?.user.id}`,
        { method: "GET" }
      );
      const data = await response.json();
      if (data !== null) {
        setFavoritesPrompts(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const add = (post) => {
    saveFavorites(post._id);
  };

  const remove = (post) => {
    deleteFavorite(post._id);
  };

  useEffect(() => {
    if (session?.user) {
      loadFavorites();
    }
  }, [session?.user]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesPrompts,
        addToFavorites: add,
        removeFromFavorites: remove,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesContext, FavoritesContextProvider };
