"use client";

import { register } from "@/api/user";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/app/common/Navbar";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
});

const Register = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const registerIsSuccessful = await register(
      data.email,
      data.password,
      data.username
    );
    if (!registerIsSuccessful) return;

    // redirect to /login
    Swal.fire({
      title: "Account created!",
      text: "You can now login to your account.",
      icon: "success",
      confirmButtonText: "Login",
    }).then(() => {
      if (!mounted) return;
      router.push("/login");
    });
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Register</h1>
        <p className="text-primary-300 text-lg">
          Register to our platform to access its features! Have an account?{" "}
          <a href="/login" className="text-yellow-500 hover:underline">
            Login here!
          </a>
        </p>
        <Form {...form}>
          <form
            className="my-10 grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                    PASSWORD
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
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
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Register;
