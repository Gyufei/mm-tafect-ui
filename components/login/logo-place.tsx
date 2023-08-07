export default function LogoPlace() {
  const BorderCol = () => {
    return (
      <div className="h-8 w-full border-y bg-white md:h-full md:w-8 md:border-x md:border-y-0"></div>
    );
  };

  return (
    <div className="align-center relative m-0 flex w-full flex-col justify-center md:left-[-200px] md:h-full md:w-auto md:flex-row">
      <BorderCol />
      <div
        className="absolute top-[-50%] z-10 mx-auto my-0 h-32 w-32 select-none rounded-full border-stone-300 bg-white md:left-[-50%] md:top-1/4"
        style={{
          left: "calc(50% - 64px)",
          boxShadow: "-1px 0px 0px 0px #d6d6d6, inset -1px 0px 0px 0px #d6d6d6",
        }}
      ></div>

      <BorderCol />
    </div>
  );
}
