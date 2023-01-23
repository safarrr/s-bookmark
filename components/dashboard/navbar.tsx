import { FC } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
interface NavbarProps {
  openSidebar: boolean;
  setOpenSidebar: any;
}

const Navbar: FC<NavbarProps> = ({ setOpenSidebar, openSidebar }) => {
  return (
    <div className=" sticky top-0 flex w-full flex-row items-center justify-between border-b-4 border-gray-200 bg-white p-5 ">
      <h1 className="text-center text-2xl font-bold">{"S'BookMark"}</h1>
      <button
        onClick={() => setOpenSidebar(!openSidebar)}
        className="text-xl transition-transform ease-in-out hover:scale-90 md:hidden"
      >
        {openSidebar ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>
    </div>
  );
};

export default Navbar;
