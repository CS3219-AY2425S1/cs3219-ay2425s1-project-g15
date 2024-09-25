"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { setGetProfile } from "@/api/user";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string()
    .optional(),
  bio: z.string()
    .optional(),
  linkedin: z.string()
    .optional(),
  github: z.string()
    .optional(),
});

const ProfilePage = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<User>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    setGetProfile(token, {}).then((data) => {
      setUser(data);
      form.reset(data);
    }).catch((error) => {
      console.error("Profile Fetch Failed:", error);
      // or swal
    });
  }, [token]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setGetProfile(token, data).then((data) => {
      setUser(data);
      form.reset(data);
    }).catch((error) => {
      console.error("Profile Update Failed:", error);
      // or swal
    });
  };

  return (
    <div className="mx-auto max-w-xl my-10 p-4">
      <h1 className="text-white font-extrabold text-h1">Welcome, {user?.username}</h1>

      <Form {...form}>
        <form className="my-10 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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