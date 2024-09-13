import supabase, { supabaseUrl } from "./supabase";

export default async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("cabins could not be loaded");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  let imageName = null;
  let imagePath = null;

  if (newCabin.image) {
    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  }

  let query = supabase.from("cabins");

  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  } else {
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();
  }

  const { data, error } = await query.single();

  if (error) {
    console.error(error);
    throw new Error("cabin could not be created");
  }

  if (hasImagePath) return data;

  if (newCabin.image && !hasImagePath) {
    const { error: storageError } = await supabase.storage.from("cabin-images").upload(imageName, newCabin.image);
    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error("Cabin image could not be uploaded. Cabin therefore not created.");
    }
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("cabin(s) could not be deleted");
  }
}
