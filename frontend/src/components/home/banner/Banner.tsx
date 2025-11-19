import Image from "next/image";
import sideBanner1 from "@/assets/banner/side-banner1.png";
import sideBanner2 from "@/assets/banner/side-banner2.png";
import SideNav from "./SideNave";
import BannerSlider from "./BannerSlider";

const Banner = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-[15px] md:gap-[10px] xl:gap-[15px] mt-4 mb-16 relative container px-4">
      <SideNav />
      <div className="flex flex-col md:flex-row gap-[15px] md:gap-[10px] xl:gap-[15px] w-full">
        <div className="w-full h-[620px] md:h-auto">
          <BannerSlider />
        </div>
        <div className="flex flex-col md:flex-col gap-[15px] md:gap-[10px] xl:gap-[15px] w-full md:w-[35%]">
          <div>
            <Image src={sideBanner1} alt="" className="w-full" priority />
          </div>
          <div>
            <Image src={sideBanner2} alt="" className="w-full" priority />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
