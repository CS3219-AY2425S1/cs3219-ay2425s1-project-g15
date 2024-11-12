/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  getToken,
  getUser,
  getUserId,
  updateUser,
  getFileUrl,
} from "@/api/user";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { CgProfile } from "react-icons/cg";
import MoonLoader from "react-spinners/MoonLoader";
import { IoCloseCircle } from "react-icons/io5";

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
  profilePictureUrl: z
    .string()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Invalid URL",
    }),
  email: z.string().email("Invalid email").optional(),
  password: z
    .string()
    .max(100, "Password must be at most 100 characters")
    .optional(),
  bio: z.string().optional(),
  linkedin: z
    .string()
    .refine((val) => val.length == 0 || val.includes("linkedin.com/in/"), {
      message: "Invalid URL, is this a LinekdIn URL?",
    })
    .optional(),
  github: z
    .string()
    .refine((val) => val.length == 0 || val.includes("github.com/"), {
      message: "Invalid URL, is this a GitHub URL?",
    })
    .optional(),
});

const ProfilePage = () => {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState<User>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      profilePictureUrl: "",
      email: "",
      password: "",
      bio: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    setToken((_) => !!getToken());
  }, []);

  useEffect(() => {
    getUser().then((res) => {
      setUser(res.data);
      form.reset(res.data);
    });
  }, [form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // remove unnecessary fields
    if (!data.password) delete data.password;
    if (data.password && data.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Password must be at least 8 characters",
      });
      return;
    }
    await updateUser(data);
    setUser(data);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !isLoading) {
      console.log("Click");
      fileInputRef.current.click();
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("Uploading profile picture...");
    try {
      if (e.target.files) {
        const imageFile = e.target.files[0];
        const formData = new FormData();
        formData.append("profilePicture", imageFile);
        const userId = getUserId() ?? "";

        setIsLoading(true);
        const res = await getFileUrl(userId, formData);

        if (res.fileUrl) {
          form.setValue("profilePictureUrl", res.fileUrl);
          setUser({ ...user, profilePictureUrl: res.fileUrl });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Done");
      setIsLoading(false);
    }
  };

  return (
    !!token && (
      <div className="mx-auto max-w-xl my-10 p-4">
        <h1 className="text-white font-extrabold text-h1">
          Welcome, {user?.username}!
        </h1>
        <Form {...form}>
          <form
            className="my-10 grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="profilePictureUrl"
              render={({ field }) => (
                <div>
                  <FormControl>
                    <div className="w-full flex justify-center">
                      {field.value ? (
                        <div
                          className="relative group w-40 h-40 rounded-full"
                          onClick={triggerFileInput}
                        >
                          <img
                            src={field.value}
                            className="w-full h-full rounded-full object-cover"
                          ></img>
                          {isLoading ? (
                            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-primary-300 opacity-70">
                              <MoonLoader />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-primary-300 opacity-0 group-hover:opacity-70 transition-opacity duration-300 hover:cursor-pointer rounded-full flex items-center justify-center text-5xl">
                              +
                            </div>
                          )}
                          <IoCloseCircle
                            className="absolute top-0 right-0 -mt-2 -mr-2 text-red-500 bg-white rounded-full cursor-pointer"
                            size={24}
                            onClick={(e) => {
                              e.stopPropagation();
                              form.setValue("profilePictureUrl", "");
                              setUser({ ...user, profilePictureUrl: "" });
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          {isLoading ? (
                            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-primary-300">
                              <MoonLoader />
                            </div>
                          ) : (
                            <CgProfile
                              size={150}
                              className="hover:bg-primary-300 hover:cursor-pointer hover:rounded-full"
                              onClick={triggerFileInput}
                            />
                          )}
                        </div>
                      )}
                      <input
                        type="file"
                        id="profilePictureInput"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                        accept="image/*"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">
                    USERNAME
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">
                    EMAIL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">
                    NEW PASSWORD
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">BIO</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="I am a..."
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">
                    LINKEDIN URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.linkedin.com/in/..."
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">
                    GITHUB URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/..."
                      {...field}
                      className="focus:border-yellow-500 text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black"
              disabled={form.formState.isSubmitting || isLoading}
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    )
  );
};

export default ProfilePage;
