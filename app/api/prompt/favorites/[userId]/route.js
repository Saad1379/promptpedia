import Prompt from "@models/prompt";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    // Extract the user ID from the request parameters
    const { userId } = params;

    // Find the user by ID and populate their favorites field
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Fetch the favorite prompts based on the IDs in user.favorites
    const favoritePrompts = await Prompt.find({
      _id: { $in: user.favorites },
    }).populate("creator");

    return new Response(JSON.stringify(favoritePrompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch favorite prompts", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectToDB();

    // Extract the user ID and prompt ID from the request body
    const { userId, postId } = await request.json();

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check if the prompt ID already exists in the user's favorites array
    if (user.favorites.includes(postId)) {
      return new Response("Prompt already saved as favorite", { status: 200 });
    }

    // Add the prompt ID to the user's favorites array
    user.favorites.push(postId);

    // Save the updated user object
    await user.save();

    // Fetch the favorite prompts based on the IDs in user.favorites
    const favoritePrompts = await Prompt.find({
      _id: { $in: user.favorites },
    }).populate("creator");

    return new Response(JSON.stringify(favoritePrompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to save prompt as favorite", { status: 500 });
  }
};
