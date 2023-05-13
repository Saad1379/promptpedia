import Image from "next/image";

const Loading = ({ width = 50, height = 50 }) => {
  return (
    <div className="w-full flex-center">
      <Image
        src="assets/icons/loader.svg"
        width={width}
        height={height}
        alt="loader"
        className="object-contain"
      />
    </div>
  );
};

export default Loading;
