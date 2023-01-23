import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import { BsGoogle, BsFillExclamationTriangleFill } from "react-icons/bs";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SiDiscord } from "react-icons/si";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  GetServerSidePropsContext,
  PreviewData,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { ParsedUrlQuery } from "querystring";
// import { supabase } from "../lib/supabase";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [Loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);
  const [handleErorr, setHandleErorr] = useState({ error: false, message: "" });
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  // const handleDiscordLogin = async () => {
  //   const { data, error } = await supabaseClient.auth.signInWithOAuth({
  //     provider: "discord",
  //     options: {
  //       redirectTo: "https://s-bookmark.vercel.app/me",
  //     },
  //   });
  //   if (error) {
  //     alert(`terjadi error ${error.name} ${error.message} `);
  //   } else {
  //     router.push("/");
  //   }
  // };
  return (
    <div className="login-bg flex h-screen w-screen items-center justify-center md:justify-start">
      <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-white p-5 px-5 md:h-screen md:w-1/2 md:rounded-br-[20%] md:rounded-tr-[10%]">
        <h1 className="text-4xl font-black">{"S'BookMark"}</h1>
        <div className="flex flex-col space-y-3 p-5 ">
          <div className="flex flex-row justify-between rounded-full bg-gray-100 p-2">
            <button
              onClick={() => setRegister(false)}
              className={`w-1/2 rounded-full py-2  ${
                register ? "" : "bg-blue-500 text-white"
              }`}
            >
              masuk
            </button>
            <button
              onClick={() => setRegister(true)}
              className={`w-1/2 rounded-full py-2  ${
                register ? "bg-blue-500 text-white" : ""
              }`}
            >
              daftar
            </button>
          </div>
          {register ? <SignUp setRegister={setRegister} /> : <SignIn />}
          <div className="my-5 rounded-lg border-b-4 border-gray-300 p-1 text-center text-sm text-gray-500">
            Atau
          </div>
          {/* <button
            onClick={handleDiscordLogin}
            className="flex items-center justify-center rounded-full border-2 border-blue-400 px-10 py-2 font-semibold transition-transform ease-linear hover:scale-90 "
          >
            <SiDiscord className="mr-1 text-lg text-blue-500" />
            <span>Discord</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};
const SignUp: FC<{ setRegister: any }> = ({ setRegister }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [errorHandle, setErrorHandle] = useState({
    error: false,
    message: "",
  });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.auth.signUp({
      email: emailInput,
      password: passwordInput,
      options: {
        data: {
          username: usernameInput,
        },
      },
    });
    if (error) {
      setErrorHandle({
        error: true,
        message: error.message,
      });
    } else {
      router.push("/me");
    }
  };

  return (
    <>
      {errorHandle.error && (
        <div className=" inline-flex items-center space-x-4 rounded-full bg-red-500 px-5 py-3 text-white">
          <BsFillExclamationTriangleFill className="text-2xl" />
          <p>{errorHandle.message}</p>
        </div>
      )}

      <form onSubmit={handleForm} className="flex flex-col space-y-2 ">
        <input
          type="text"
          className="rounded-full border-2 border-blue-400 px-4 py-2 outline-none transition-transform ease-linear focus:scale-105 "
          placeholder="username"
          name="username"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUsernameInput(e.target.value);
          }}
        />
        <input
          type="email"
          className="rounded-full border-2 border-blue-400 px-4 py-2 outline-none transition-transform ease-linear focus:scale-105 "
          placeholder="Email"
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmailInput(e.target.value);
          }}
        />
        <input
          type="password"
          className="rounded-full border-2 border-blue-400 px-4 py-2 outline-none transition-transform ease-linear focus:scale-105 "
          placeholder="password"
          name="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPasswordInput(e.target.value);
          }}
        />
        <button
          type="submit"
          className="rounded-full bg-blue-500 py-3 text-lg font-medium text-white transition-transform ease-linear hover:scale-90"
        >
          Daftar
        </button>
      </form>
    </>
  );
};
const SignIn: FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [errorHandle, setErrorHandle] = useState({
    error: false,
    message: "",
  });
  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });
    if (error) {
      if (error.message === "Invalid login credentials") {
        setErrorHandle({
          error: true,
          message: "salah email atau password",
        });
      } else {
        setErrorHandle({
          error: true,
          message: "terjadi error " + error.message,
        });
      }
    } else {
      router.push("/me");
    }
  };
  return (
    <>
      {errorHandle.error && (
        <div className=" inline-flex items-center space-x-4 rounded-full bg-red-500 px-5 py-3 text-white">
          <BsFillExclamationTriangleFill className="text-2xl" />
          <p>{errorHandle.message}</p>
        </div>
      )}

      <form onSubmit={handleForm} className="flex flex-col space-y-2">
        <input
          type="email"
          className="rounded-full border-2 border-blue-400 px-4 py-2 outline-none transition-transform ease-linear focus:scale-105 "
          placeholder="Email"
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmailInput(e.target.value);
          }}
        />
        <input
          type="password"
          className="rounded-full border-2 border-blue-400 px-4 py-2 outline-none transition-transform ease-linear focus:scale-105 "
          placeholder="password"
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPasswordInput(e.target.value);
          }}
        />
        <button
          type="submit"
          className="rounded-full bg-blue-500 py-3 text-lg font-medium text-white transition-transform ease-linear hover:scale-90"
        >
          masuk
        </button>
      </form>
    </>
  );
};

export const getServerSideProps = async (
  ctx:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | { req: NextApiRequest; res: NextApiResponse<any> }
) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/me",
        permanent: false,
      },
    };
  return {
    props: {},
  };
};
export default Login;
