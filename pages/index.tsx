import Link from "next/link";

export default function Home() {
  return (
    <h1>
      home pages masih dalam pembuatan jika ingin mencoba bisa langsung ke{" "}
      <Link className="hover:text-blue-500 hover:underline" href="/login">
        login (klik disini)
      </Link>{" "}
      atau{" "}
      <Link className="hover:text-blue-500 hover:underline" href="/me">
        dashboard (klik disini)
      </Link>
    </h1>
  );
}
