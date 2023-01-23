import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { useStore } from "../../lib/store";
import Navbar from "../dashboard/navbar";
import SideBar from "../dashboard/sideBar";
import Footer from "../footer";

interface MeLayoutProps {
  children: ReactNode;
}

const MeLayout: FC<MeLayoutProps> = ({ children }) => {
  const [OpenSidebar, setOpenSidebar] = useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { setFolder, setUser } = useStore();

  useEffect(() => {
    const getData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        alert("terjadi kesalahan: " + error.message);
      } else {
        if (!session) {
          router.push("/login");
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            username:
              session.user.user_metadata.name ||
              session.user.user_metadata.username,
          });
          const { data, error } = await supabase
            .from("folder")
            .select()
            .eq("author", session.user.id);
          if (data) {
            setFolder(data);
          }
        }
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-row">
      <SideBar open={OpenSidebar} />
      <div className="flex h-screen w-full flex-col overflow-y-scroll bg-gray-50">
        <Navbar setOpenSidebar={setOpenSidebar} openSidebar={OpenSidebar} />
        <div className="m-5">{children}</div>
        <Footer />
      </div>
    </div>
  );
};
// export const getServerSideProps = async (
//   ctx:
//     | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
//     | { req: NextApiRequest; res: NextApiResponse<any> }
// ) => {
//   // Create authenticated Supabase Client
//   const supabase = createServerSupabaseClient(ctx);
//   // Check if we have a session
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session)
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   return {
//     props: {

//     },
//   };
// };
export default MeLayout;
