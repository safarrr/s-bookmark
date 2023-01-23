import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { AiFillHome, AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import { useStore } from "../../lib/store";
interface SideBarProps {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }) => {
  const folder = useStore((state) => state.folder);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { id } = router.query;
  const handleLogout = async () => {
    if (confirm("ingin logout?")) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("terjadi error: " + error.message);
      } else {
        router.push("/login");
      }
    }
  };
  return (
    <div
      className={`absolute top-0 z-50 flex h-screen flex-col space-y-4 border-r-4 border-gray-200 bg-white pt-5 pl-2 md:sticky md:w-1/4 md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      } `}
    >
      <h1 className="text-center text-xl font-bold">{"S'BookMark"}</h1>
      <div className="flex flex-col space-y-2">
        <Link
          className={`flex w-full items-center rounded-md ${
            router.pathname === "/me" ? "border-l-4 border-blue-500" : ""
          }  py-2 px-5 text-lg transition-all ease-in-out hover:scale-95  hover:shadow-md`}
          href="/me"
        >
          <AiFillHome className="mr-2 text-xl" /> Beranda
        </Link>
        <Link
          href="/me/setting"
          className=" flex w-full items-center rounded-md  py-2 px-5 text-lg transition-all ease-in-out hover:scale-95  hover:shadow-md "
        >
          <AiFillSetting className="mr-2 text-xl" /> Peraturan
        </Link>
      </div>
      <span className=" pl-2 text-sm tracking-[5px] text-gray-400">Folder</span>
      <div className="flex h-[55%] flex-col space-y-3 overflow-x-auto pl-2 ">
        {folder?.map((v: any) => {
          return (
            <Link
              href={`/me/${v.type}/${v.id}`}
              key={v.id}
              className={`flex w-full items-center rounded-md  py-2 px-5 text-lg transition-all ease-in-out hover:scale-95  hover:shadow-md ${
                id === v.id ? "border-l-4 border-blue-500" : ""
              }`}
            >
              {v.name}
            </Link>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center justify-center space-x-2 rounded-xl py-3 text-red-500 transition-all ease-in-out hover:scale-95 hover:bg-red-200"
      >
        <AiOutlineLogout /> <p>logout</p>
      </button>
    </div>
  );
};

export default SideBar;
