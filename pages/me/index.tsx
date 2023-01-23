import {
  AiOutlineSend,
  AiTwotoneSetting,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { FC, useState, ChangeEvent, FormEvent } from "react";
import MeLayout from "../../components/layout/meLayout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useStore } from "../../lib/store";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next/types";
import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
interface MeProps {
  user: {
    id: string;
    email: string;
    username: string;
  };
}
type folderDataProps = {
  id: string;
  name: string;
  type: string;
};
const Me: FC<MeProps> = () => {
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [inputNewFolder, setInputNewFolder] = useState("");
  const supabase = useSupabaseClient();
  const { folder, setFolder, user } = useStore();
  const router = useRouter();
  const handleNewFolderForm = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("folder")
      .insert({
        author: user?.id,
        name: inputNewFolder,
        description: "hallo 🌏",
        type: "bookmark",
      })
      .select();
    if (error) {
      alert("terjadi error: " + error.message);
    } else {
      setFolder([...folder, data[0]]);
      setOpenNewFolder(false);
      setInputNewFolder("");
    }
  };
  return (
    <>
      <Head>
        <title>{user?.username} folder</title>
      </Head>
      <MeLayout>
        <form className="flex w-full justify-between rounded-full bg-white p-5">
          <input
            type="text"
            name="search"
            required
            className=" w-1/2 bg-transparent  outline-none"
            placeholder="cara folder atau link"
          />
          <button type="submit" className="text-2xl">
            <AiOutlineSend />
          </button>
        </form>
        <button
          onClick={() => setOpenNewFolder(!openNewFolder)}
          className="mt-3 inline-flex items-center rounded-full bg-blue-500 px-5 py-2 text-lg text-white "
        >
          {openNewFolder ? (
            <AiOutlineClose className="text-xl" />
          ) : (
            <>
              <AiOutlinePlus className="text-xl" />
              <span>Folder</span>
            </>
          )}
        </button>
        <form
          onSubmit={handleNewFolderForm}
          className={`flex w-full justify-between rounded-full bg-white px-5 transition-all  delay-100 ease-in-out ${
            openNewFolder ? "h-auto py-5" : "h-0 py-0"
          }`}
        >
          <input
            type="text"
            required
            maxLength={10}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInputNewFolder(e.target.value);
            }}
            placeholder="nama folder"
            className=" w-auto outline-none"
          />
          <button className={openNewFolder ? "" : "hidden"} type="submit">
            <AiOutlineSend className="text-3xl" />
          </button>
        </form>
        <div className="flex flex-wrap justify-center gap-5">
          {folder?.map((v: folderDataProps) => {
            return (
              <div
                onClick={() => router.push(`/me/${v.type}/${v.id}`)}
                key={v.id}
                className="space-y-2 rounded-lg bg-white py-5 pl-5 pr-14 transition-all ease-in-out hover:scale-95 hover:shadow-md"
              >
                <span className="rounded-full bg-blue-500 px-3 py-2 text-xs font-light text-white">
                  Bookmark
                </span>
                <h2 className="text-2xl font-bold">{v.name}</h2>
                <button className="text-xl hover:text-blue-600">
                  <AiTwotoneSetting />
                </button>
              </div>
            );
          })}
        </div>
      </MeLayout>
    </>
  );
};
export const getServerSideProps = async (
  ctx:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | { req: NextApiRequest; res: NextApiResponse<any> }
) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
export default Me;
