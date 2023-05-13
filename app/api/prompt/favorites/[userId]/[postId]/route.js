import Prompt from "@models/prompt";
import User from "@models/user";
import { connectToDB } from "@utils/database";
import { ObjectId } from "mongodb";

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Extract the user ID and prompt ID from the request parameters
    const { userId, postId } = params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Find the index of the prompt ID in the user's favorites array
    const prompt_id = new ObjectId(postId);
    const index = user.favorites.findIndex((favoriteId) => {
      return favoriteId.toString() === postId;
    });

    console.log(index);

    if (index === -1) {
      return new Response("Prompt not found in favorites", { status: 404 });
    }

    // Remove the prompt ID from the user's favorites array
    user.favorites.splice(index, 1);

    // Save the updated user object
    await user.save();

    // Fetch the favorite prompts based on the IDs in user.favorites
    const favoritePrompts = await Prompt.find({
      _id: { $in: user.favorites },
    }).populate("creator");

    return new Response(JSON.stringify(favoritePrompts), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to remove prompt from favorites", {
      status: 500,
    });
  }
};
