"use server";

import axios from "axios";
import { LoginFormSchema, SignupFormSchema } from "../lib/definition";
import setCookieParser from "set-cookie-parser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: unknown, formData: FormData) => {
  const validateFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  //   console.log("validate Fields")
  if (!validateFields.success) {
    console.log("Validation error:", validateFields.error);
    return { error: validateFields.error, success: false };
  }
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const res = await axios.post("/user/login", { email, password });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);
        cookieData.forEach((cookie: any) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );
    console.log(data);

    redirect("/profile");
  } catch (error) {
    console.log("Error occurred during login: ", error);
    throw error;
  }
};


export const signupAction = async (prevState: unknown, formData: FormData) => {
  console.log(prevState);

  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log("Fields validated");

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("/user/register", { name, email, password });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);

    cookieData.forEach((cookie: any) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      cookieStore.set(cookie.name, cookie.value, { ...cookie })
    );
    redirect("/profile");
    return data;
  } catch (error) {
    console.log("Error occurred during login: ", error);
    throw error;
  }
};
