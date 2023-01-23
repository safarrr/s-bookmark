import { useRouter } from "next/router";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import MeLayout from "../../../components/layout/meLayout";
import {
  AiTwotoneSetting,
  AiFillEdit,
  AiOutlineSend,
  AiOutlineClose,
  AiFillDelete,
  AiOutlineCheck,
} from "react-icons/ai";
import { getDomain } from "../../../lib/function";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useStore } from "../../../lib/store"; //
import { ParsedUrlQuery } from "querystring";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next/types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
type linkProps = {
  id: string;
  name: string;
  url: string;
  description: string;
};

interface IdProps {}
const Id: FC<IdProps> = () => {
  const router = useRouter();
  const { user, setFolder, folder } = useStore();
  const [identity, setIdentity] = useState({
    name: "",
    description: "",
    id: "",
  });
  const [editFolder, setEditFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [folderDescription, setFolderDescription] = useState("");
  const [bookmark, setBookmark] = useState<any[]>([]);
  const supabase = useSupabaseClient();
  const getDataFolder = async () => {
    setLoading(true);
    const folder = await supabase
      .from("folder")
      .select()
      .eq("id", router.query.id)
      .single();
    if (folder.error) {
      alert("terjadi error: " + folder.error.message);
    } else {
      setIdentity({
        name: folder.data.name,
        description: folder.data.description,
        id: folder.data.id,
      });
      setFolderName(folder.data.name);
      setFolderDescription(folder.data.description);
      setLoading(false);
    }
  };
  const getDataBookmark = async () => {
    const bookmark = await supabase
      .from("bookmark")
      .select("name, description,id,url")
      .eq("folder_id", router.query.id);
    if (bookmark.error) {
      alert("terjadi error: " + bookmark.error.message);
    } else {
      setBookmark(bookmark.data);
    }
  };
  useEffect(() => {
    if (router.query.id) {
      getDataFolder();
      getDataBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
      url: { value: string };
    };
    const newBookmark = await supabase
      .from("bookmark")
      .insert({
        author_id: user?.id,
        folder_id: identity.id,
        name: target.title.value,
        description: target.description.value,
        url: target.url.value,
      })
      .select();
    if (newBookmark.error) {
      alert("terjadi error: " + newBookmark.error.message);
    } else {
      setBookmark([...bookmark, newBookmark.data[0]]);
    }
  };
  const handleFormFolder = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (
      identity.name === folderName &&
      identity.description === folderDescription
    ) {
      setEditFolder(false);
      return;
    } else {
      const { error } = await supabase
        .from("folder")
        .update({
          name: folderName,
          description: folderDescription,
        })
        .eq("id", identity.id);
      if (error) {
        alert("terjadi error: " + error.message);
      } else {
        if (identity.name !== folderName) {
          setFolder([
            ...folder.filter((v: { id: string }) => v.id !== identity.id),
            {
              name: folderName,
              description: folderDescription,
              id: identity.id,
              type: "bookmark",
            },
          ]);
        }
        setIdentity({
          name: folderName,
          description: folderDescription,
          id: identity.id,
        });
        return;
      }
    }
  };
  const handleDelete = async () => {
    if (confirm("ingin hapus folder " + identity.name + "?")) {
      const { error } = await supabase
        .from("folder")
        .delete()
        .eq("id", identity.id);
      if (error) {
        alert("terjadi error: " + error.message);
      } else {
        setFolder(folder.filter((v: { id: string }) => v.id !== identity.id));
        router.push("/me");
      }
    }
  };
  return (
    <>
      <Head>
        <title>📂 | {loading ? "loading" : identity.name}</title>
      </Head>
      <MeLayout>
        {loading ? (
          <h1>loading</h1>
        ) : (
          <>
            <div className="mb-5 flex flex-row items-center justify-between bg-white p-5 ">
              {editFolder ? (
                <form onSubmit={handleFormFolder} className="flex flex-col">
                  <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    className=" text-3xl font-bold capitalize outline-none"
                    maxLength={10}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                  <textarea
                    required
                    name="description"
                    className="  resize-none text-lg outline-none"
                    value={folderDescription}
                    onChange={(e) => setFolderDescription(e.target.value)}
                  ></textarea>
                  <div className="inline-flex items-center space-x-3  ">
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center rounded-xl py-3 px-5 text-lg text-red-500 transition-all ease-in-out hover:scale-95 hover:bg-red-200 "
                    >
                      <AiFillDelete /> <p>hapus folder</p>
                    </button>
                    <button
                      type="submit"
                      className=" rounded-xl bg-green-500 py-3 px-5 text-lg text-white transition-all ease-in-out hover:scale-95 hover:bg-green-200"
                    >
                      <AiOutlineCheck />
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold capitalize">
                    {identity.name}
                  </h1>
                  <p className="text-lg">{identity.description}</p>
                </div>
              )}

              <button
                onClick={() => setEditFolder(!editFolder)}
                className="text-3xl transition-all ease-in-out hover:scale-95 hover:text-blue-600"
              >
                {editFolder ? <AiOutlineClose /> : <AiTwotoneSetting />}
              </button>
            </div>
            <div className="">
              <div className=" mb-5 rounded-lg bg-yellow-400 p-5 text-sm ">
                <p className="flex flex-col">
                  url harus mempunyai https:// atau http:// dan memiliki domain
                  contoh:
                  <span>
                    ✅ https://example.com atau https://example.com/benar/ok
                  </span>
                  <span>❌ example.com atau https://example</span>
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-row items-center justify-between rounded-lg bg-white p-5"
              >
                <div className="flex flex-col space-y-3 ">
                  <input
                    required
                    type="text"
                    name="title"
                    id="title"
                    maxLength={10}
                    placeholder="title"
                    className=" text-lg outline-none"
                  />
                  <input
                    required
                    type="url"
                    name="url"
                    id="url"
                    placeholder="url atau link"
                    className=" text-lg outline-none"
                  />
                  <textarea
                    name="description"
                    id="description"
                    placeholder="description"
                    className=" resize-none text-lg outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500  px-5 py-2 text-2xl text-white transition-all ease-in-out hover:scale-95"
                >
                  <AiOutlineSend />
                </button>
              </form>
              {bookmark.map((v: linkProps) => {
                return <Link key={v.id} data={v} setBoomark={setBookmark} />;
              })}
            </div>
          </>
        )}
      </MeLayout>
    </>
  );
};
const Link: FC<{ data: linkProps; setBoomark: any }> = ({
  data,
  setBoomark,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(data.name);
  const [url, setUrl] = useState(data.url);
  const [description, setDescription] = useState(data.description);
  const supabase = useSupabaseClient();
  const handleDelete = async () => {
    if (confirm("ingin menghapus " + data.name + "?")) {
      const { error } = await supabase
        .from("bookmark")
        .delete()
        .eq("id", data.id);
      if (error) {
        alert("terjadi error: " + error.message);
      } else {
        setBoomark((value: any[]) => value.filter((v) => v.id !== data.id));
      }
    }
  };
  const handleSumit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("bookmark")
      .update({
        name: title,
        description: description,
        url,
      })
      .eq("id", data.id);
    if (error) {
      alert("terjadi error: " + error.message);
    } else {
      setEditMode(false);
    }
  };
  return (
    <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-5">
      {editMode ? (
        <form onSubmit={handleSumit} className="flex flex-col">
          <input
            type="text"
            name="title"
            value={title}
            required
            className="text-2xl font-bold outline-none"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            required
            className="font-semibold outline-none"
            type="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <textarea
            className="h-auto resize-none outline-none"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className=" inline-flex items-center space-x-5">
            <button
              onClick={handleDelete}
              className="rounded-xl py-3 px-5 text-xl text-red-500 transition-all ease-in-out hover:scale-95 hover:bg-red-200"
            >
              <AiFillDelete />
            </button>
            <button
              type="submit"
              className="w-max rounded-xl bg-blue-500 py-3 px-5 text-xl text-white transition-all ease-in-out hover:scale-95"
            >
              <AiOutlineSend />
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className=" font-semibold">{getDomain(url)}</h2>
          <p className="w-auto break-words pr-10">{description}</p>
        </div>
      )}

      <div className="inline-flex items-center space-x-3 ">
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-2xl hover:text-blue-500"
        >
          {editMode ? <AiOutlineClose /> : <AiFillEdit />}
        </button>
        {!editMode && (
          <a
            className="rounded-xl bg-blue-500 py-3 px-5 text-white transition-all ease-in-out hover:scale-95 "
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getDomain(data.url)}
          </a>
        )}
      </div>
    </div>
  );
};
export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const id = ctx.query.id;
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
  }
  return {
    props: {},
  };
  // else {
  //   const { data, error } = await supabase
  //     .from("folder")
  //     .select()
  //     .eq("id", id)
  //     .single();
  //   if (error) {
  //     return {
  //       redirect: {
  //         destination: "/me",
  //         permanent: false,
  //       },
  //     };
  //   } else {
  //     if (data) {
  //       return {
  //         props: {
  //           data: null,
  //         },
  //       };
  //     } else {
  //       return {
  //         redirect: {
  //           destination: "/me",
  //           permanent: false,
  //         },
  //       };
  //     }
  //   }
  // }
};
export default Id;
