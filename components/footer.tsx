import { FC } from "react";
import { FaGithub, FaInstagram } from "react-icons/fa";
interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <footer className="m-5 mt-auto flex flex-row items-center justify-evenly rounded-2xl bg-white py-5">
      <h1 className="text-2xl font-black">{"S'BookMark"}</h1>
      <div className="flex flex-col">
        <div className="">
          <p>Di buat dengan 💖 oleh</p>
          <h1 className="text-2xl font-black">Safarudin</h1>
        </div>
        <ul>
          <li>
            <a
              href="https://github.com/safarrr"
              target="_blank"
              rel="noopener noreferrer"
              className=" inline-flex items-center space-x-2 hover:text-blue-500"
            >
              <FaGithub className="text-lg" /> <p>safarrr</p>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/safar19x/"
              target="_blank"
              rel="noopener noreferrer"
              className=" inline-flex items-center space-x-2 hover:text-blue-500"
            >
              <FaInstagram className="text-lg" /> <p>@safar19x</p>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
