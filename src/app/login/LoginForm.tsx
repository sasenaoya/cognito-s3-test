"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { useCognito } from "@/hooks/useCognito";

interface IFormInput {
  username: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const { authenticateUser, session, error, needPasswordVerify } = useCognito();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    if (needPasswordVerify) {
      router.push("/password/reset");
    }
  }, [needPasswordVerify]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    authenticateUser(data.username, data.password);
  };

  return (
    <div className="mt-[20%]" >
      <form method="post" onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <h1 className="mb-5">ログイン</h1>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("username", { required: true })}
            type="text"
            id="username"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Email address
          </label>
          {errors.username &&
            <div className="mt-2 text-sm text-red-600 dark:text-red-500">必須項目です</div>
          }
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("password", { required: true })}
            type="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Password
          </label>
          {errors.password &&
            <div className="mt-2 text-sm text-red-600 dark:text-red-500">必須項目です</div>
          }
        </div>
        {error &&
          <div className="mt-2 text-sm text-red-600 dark:text-red-500 mb-5">ログインできませんでした</div>}
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
  );
}
