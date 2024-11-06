/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { getToken, getUser, updateUser } from "@/api/user";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import VerificationSymbol from "@/app/common/VerificationSymbol";

const formSchema = z.object({
  username: z.string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
  email: z.string()
    .email("Invalid email")
    .optional(),
  password: z.string().optional(),
  bio: z.string().optional(),
  linkedin: z.string()
    .refine((val) => val.length == 0 || val.includes("linkedin.com/in/"),
      { message: "Invalid URL" })
    .optional(),
  github: z.string()
    .refine((val) => val.length == 0 || val.includes("github.com/"),
      { message: "Invalid URL" })
    .optional(),
});

const ProfilePage = () => {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState<User>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    setToken(_ => !!getToken());
  }, []);

  useEffect(() => {
    getUser().then((res) => {
      setUser(res.data);
      console.log(res.data);
      form.reset(res.data);
    });
  }, [form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // remove unnecessary fields
    if (!data.password) delete data.password;
    if (data.password && data.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Password must be at least 8 characters",
      });
      return;
    };
    updateUser(data);
    setUser(data);
  };

  return !!token && (
    <div className="mx-auto max-w-xl my-10 p-4">
      <h1 className="text-white font-extrabold text-h1">Welcome, {user?.username}!</h1>
      <p className="text-white text-lg">You may update your profile information below.</p>

      <h2 className="text-lg text-yellow-500 mt-10">USER ID</h2>
      <div className="flex my-2 gap-2">
        <p className="text-white">{user?.id} </p>
      </div>

      <h2 className="text-lg text-yellow-500 mt-10">EMAIL</h2>
      <div className="flex my-2 gap-2">
        <p className="text-white">{user?.email} </p>
        <VerificationSymbol isVerified={user?.isVerified || false}/>
      </div>
      
      <Form {...form}>
        <form className="my-5 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">USERNAME</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">NEW PASSWORD</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
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
                  <Input placeholder="I am a..." {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">LINKEDIN URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.linkedin.com/in/..." {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-yellow-500 text-lg">GITHUB URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} className="focus:border-yellow-500 text-white"/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
}

export default ProfilePage;