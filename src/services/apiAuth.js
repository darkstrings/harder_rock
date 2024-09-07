/*
 * REMEMBER TO UPDATE THE URL CONFIGURATION TO THE NEW SERVER URLs WHEN YOU DEPLOY
 */

import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  console.log("data from supabase is", data.user);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. update password or fullName
  let updateData = {};
  if (password) {
    updateData.password = password;
  }
  if (fullName) {
    updateData.data = { full_name: fullName };
  }

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. upload avatar image

  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage.from("avatars").upload(fileName, avatar);
  // In the object returned is the response of the upload operation.....if error is in there, destructure that out and name it storageError

  if (storageError) throw new Error(storageError.message);

  // 3. update avatar in the user
  const { data: updatedUser, error: updateUserError } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });
  if (updateUserError) throw new Error(updateUserError.message);
  return updatedUser;
}

// For the signup function:

/*

In the provided signup function, data and error are returned from the supabase.auth.signUp method as the sign-up process happens asynchronously.

Here's a breakdown of what's happening:

The signup function is an asynchronous function (denoted by the async keyword) that takes an object with properties fullName , email , password , and passwordConfirm as its argument. [1]

Inside the function, the supabase.auth.signUp method is called, which is likely a method provided by the Supabase authentication service to create a new user account.

The supabase.auth.signUp method is called with an object that contains the email and password properties, as well as an options object. The options object has a nested data object with full_name and avatar properties, which are likely additional user data that will be associated with the new user account.

The await keyword is used before calling supabase.auth.signUp , which means that the function execution will pause at this line until the asynchronous operation (sign-up process) completes.

The supabase.auth.signUp method returns an object with data and error properties. The data property will contain the data related to the newly created user account if the sign-up process is successful, while the error property will contain an error object if the sign-up process fails for any reason.

The { data, error } syntax is using object destructuring to extract the data and error properties from the object returned by supabase.auth.signUp .

So, when the signup function is called, it will initiate the sign-up process with Supabase, and once the process is complete (either successfully or with an error), the data and error values will be available within the function.

However, it's important to note that the signup function doesn't explicitly return data or error . If you want to handle the sign-up response or catch any errors, you would need to call the signup function and handle the returned Promise accordingly.

*/
