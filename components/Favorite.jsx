import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "./FavoritesContextProvider";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Favorite = ({ post }) => {
  const { favoritesPrompts, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext);
  const [isfavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    setIsFavorite(favoritesPrompts?.find((p) => p._id === post._id));
  }, [favoritesPrompts]);
  return (
    <div
      className="copy_btn"
      onClick={() =>
        !isfavorite ? addToFavorites(post) : removeFromFavorites(post)
      }
    >
      {isfavorite ? (
        <AiFillHeart color="red" />
      ) : (
        <AiOutlineHeart color="red" />
      )}
    </div>
  );
};

export default Favorite;
