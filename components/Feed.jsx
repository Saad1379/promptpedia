"use client";

import { useState, useEffect, useContext } from "react";

import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { FavoritesContext } from "./FavoritesContextProvider";

const PromptCardList = ({ data, handleTagClick }) => {
  const [promptCardData, setPromptCardData] = useState(data);
  console.log(promptCardData);
  useEffect(() => {
    setPromptCardData(data);
  }, [data]);
  return (
    <div className="mt-16 prompt_layout">
      {promptCardData.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const { data: session } = useSession();
  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const { favoritesPrompts } = useContext(FavoritesContext);

  const [favoritesToggle, setFavoritesToggle] = useState(false);

  const fetchPosts = async () => {
    // const response = session?.user
    //   ? await fetch(`/api/prompt/favorites/${session?.user.id}`)
    //   : await fetch(`/api/prompt`);
    const response = await fetch(`/api/prompt`);
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  const handleFavoritesToggle = () => {
    setFavoritesToggle((prev) => !prev);
  };

  return (
    <section className="feed">
      <div className="search w-full flex gap-3">
        <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            required
            className="search_input peer"
            disabled={favoritesToggle}
          />
        </form>
        {session?.user && (
          <button className="fav_btn" onClick={handleFavoritesToggle}>
            <span className="flex items-center justify-center">
              {favoritesToggle ? (
                <AiFillHeart width={15} height={15} color="red" />
              ) : (
                <AiOutlineHeart width={15} height={15} color="red" />
              )}
            </span>
          </button>
        )}
      </div>
      {/* All Prompts */}
      {favoritesToggle ? (
        <PromptCardList
          data={favoritesPrompts}
          handleTagClick={handleTagClick}
        />
      ) : searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
