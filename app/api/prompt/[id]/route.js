import Prompt from "@models/prompt";
import User from "@models/user";
import { connectToDB } from "@utils/database";
import { ObjectId } from "mongodb";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // Update the prompt with new data
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response("Successfully updated the Prompts", { status: 200 });
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find all users who have marked the prompt as a favorite
    const users = await User.find({ favorites: params.id });
    console.log(users);
    // Update each user's favorites array to remove the deleted prompt ID
    await Promise.all(
      users.map(async (user) => {
        user.favorites = user.favorites.filter((favId) => {
          return favId.toString() === params.id;
        });
        await user.save();
      })
    );
    console.log(users[0].favorites);
    // Find the prompt by ID and remove it
    const deletedPrompt = await Prompt.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error deleting prompt", { status: 500 });
  }
};
