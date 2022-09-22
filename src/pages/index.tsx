import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { MainLayout } from "../layouts";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col h-full w-full justify-center -mt-24">
        <div className="text-6xl font-bold">당신의 아디이어에 축복을,</div>
        <div className="text-6xl">아이디어스랩</div>
      </div>
    </MainLayout>
  );
};

export default Home;
