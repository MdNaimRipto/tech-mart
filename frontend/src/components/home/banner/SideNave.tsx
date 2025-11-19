import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { categoryList } from "@/components/common/categoryList/CategoryList";

const SideNav = () => {
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const [fixedSideNav, setFixedSideNav] = useState(true);
  const [responsiveStyle, setResponsiveStyle] = useState("");

  // Detect screen size and set sideNavOpen accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        // Mobile and tablet view
        setSideNavOpen(false);
        setFixedSideNav(false);
        setResponsiveStyle("absolute transform -translate-x-1/2 left-1/2");
      } else {
        // Desktop view
        setFixedSideNav(true);
        setSideNavOpen(true);
        setResponsiveStyle("");
      }
    };

    // Initial check
    handleResize();
    // Add event listener to update on window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`hidden xl:block w-[96%] lg:w-full xl:w-[30%] z-10 ${responsiveStyle}  ${
        sideNavOpen && "h-full"
      }`}
    >
      <Button
        sx={{
          width: "100%",
          background: "linear-gradient(to bottom, #f15700, #ff7a1a) !important",
          borderRadius: 0,
          py: {
            sx: "8px",
            sm: "8px",
            md: "8px",
            lg: "12px",
            xl: "12px",
          },
          color: "#ffffff",
          fontWeight: "bold",
          "&.Mui-disabled": {
            color: "#ffffff",
          },
        }}
        disabled={fixedSideNav}
        onClick={() => setSideNavOpen(!sideNavOpen)}
      >
        All Categories
      </Button>
      <ul
        className={`${
          !sideNavOpen
            ? "h-0 opacity-0"
            : "h-screen md:h-full xl:h-[90%] opacity-100"
        } duration-300 absolute w-full xl:w-[20%] bg-[#fff] side-nav-scroll px-4`}
      >
        {categoryList.map((list, i) => (
          <li
            key={i + 1}
            className="py-3 mb-1 w-full text-[#252525] font-medium cursor-pointer hover:text-secondary duration-300"
          >
            <Link
              href={`/products?category=${list.value}`}
              className="flex items-center gap-3"
            >
              <>{list.icon}</>
              <p>{list.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
