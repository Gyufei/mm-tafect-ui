export default function Candle({ up }: { up: boolean }) {
  return (
    <div
      data-up={up ? true : false}
      className="relative left-2 h-[98px] w-[2px] data-[up=false]:bg-[#ED1414] data-[up=true]:bg-[#07D498]"
    >
      <div
        data-up={up ? true : false}
        className="absolute -left-[7px] top-[22px] h-14 w-4 data-[up=false]:bg-[#ED1414] data-[up=true]:bg-[#07D498]"
      ></div>
    </div>
  );
}
