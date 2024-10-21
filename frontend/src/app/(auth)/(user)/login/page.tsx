"use client";

import { login } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "../../home/components/navbar/Navbar";

const formSchema = z.object({
  email: z.string()
    .email("Invalid email"),
  password: z.string(),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    login(data.email, data.password);
  };

  return (
    <>
      <Navbar/>
      <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Login</h1>
        <p className="text-primary-300 text-lg">
          Login to our platform to access its features! Don&apos;t have an account? <a href="/register" className="text-yellow-500 hover:underline">Register here!</a>
        </p>
        <Form {...form}>
          <form className="my-10 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">EMAIL</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} className="focus:border-yellow-500 text-white"/>
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
                  <FormLabel className="text-yellow-500 text-lg">PASSWORD</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} className="focus:border-yellow-500 text-white"/>
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black">Login</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Login;