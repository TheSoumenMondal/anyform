import Image from "next/image";
import React from "react";

const IllustrationDemo = () => {
  return (
    <div className="w-full min-w-40 aspect-video relative my-6">
      <Image src={"/images/illustration.png"} alt="illustration" fill />
    </div>
  );
};

export default IllustrationDemo;
