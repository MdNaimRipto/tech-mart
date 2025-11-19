/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import logo from "@/assets/logo.png";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import Link from "next/link";
import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import AccountMenu from "../AccountMenu";
import { useGetWishlistsProductQuery } from "@/redux/features/wishlist/wishlistApi";
import { useUserContext } from "@/context/AuthContext";
import { GetCartLength } from "@/components/cartComponents/GetCartLength";
import SearchBar from "./SearchBar";
import { categoryList } from "@/components/common/categoryList/CategoryList";
import { useState } from "react";

const MainNav = () => {
  const { user, token } = useUserContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const option = {
    userId: user?._id as string,
    token: token as string,
  };

  const { data, isLoading } = useGetWishlistsProductQuery(option);

  const wishlistProducts = data?.data;

  return (
    <div className="bg-[#e7e7e7] sticky top-0 z-50">
      <div className="flex items-center justify-between h-18 py-3 container px-4 xl:px-0">
        <a href="/" className="h-full w-2/5 md:w-1/5 lg:w-[16%]">
          <Image
            src={logo}
            alt="Website-Logo"
            priority={true}
            className="w-full"
          />
        </a>
        <SearchBar />
        <div className="hidden lg:flex items-center justify-evenly lg:w-[32%] xl:w-[24%]">
          {/* DropDown Here For Categories */}
          <div className={`relative hidden lg:block`}>
            <Button
              sx={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#f15700",
                textTransform: "none",
                border: `1px solid #f15700`,
              }}
              onClick={e => setAnchorEl(e.currentTarget)}
              size="small"
            >
              Categories
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {categoryList?.map(cat => (
                <MenuItem
                  key={cat.value}
                  onClick={() => {
                    setAnchorEl(null);
                  }}
                  sx={{
                    width: 220,
                  }}
                >
                  <Link
                    href={`/products?category=${cat.value}`}
                    className="w-full h-full flex items-center gap-4"
                  >
                    <div className="w-6 h-6">{cat.icon}</div>
                    <span className="text-xs">{cat.name}</span>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </div>
          <Tooltip title="Wishlist">
            <Link href="/user/wishlists" className="relative">
              <p className="absolute top-0 -right-1 text-xs bg-secondary text-black rounded-full w-4 h-4 text-center">
                {isLoading || !wishlistProducts ? 0 : wishlistProducts?.length}
              </p>
              <FavoriteBorderIcon />
            </Link>
          </Tooltip>
          <Tooltip title="Cart">
            <Link href="/cart" className="relative">
              <p className="absolute top-0 -right-1 text-xs bg-secondary text-black rounded-full w-4 h-4 text-center">
                {GetCartLength()}
              </p>
              <ShoppingBasketOutlinedIcon />
            </Link>
          </Tooltip>
          <AccountMenu smallIconSize="30px" largeIconSize="24px" />
          <Link href="/pc-builder">
            <Button
              className="gradient-button"
              sx={{
                padding: "10px",
                xl: {
                  padding: "12px",
                  fontSize: "16px",
                },
                fontWeight: "bold",
                color: "white",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              PC BUILDER
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2 justify-end lg:hidden ">
          {/* DropDown Here For Categories */}
          <div className={`relative lg:hidden`}>
            <Button
              sx={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#f15700",
                textTransform: "none",
                border: `1px solid #f15700`,
              }}
              onClick={e => setAnchorEl(e.currentTarget)}
              size="small"
            >
              Categories
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {categoryList?.map(cat => (
                <MenuItem
                  key={cat.value}
                  onClick={() => {
                    setAnchorEl(null);
                  }}
                  sx={{
                    width: 220,
                  }}
                >
                  <Link
                    href={`/products?category=${cat.value}`}
                    className="w-full h-full flex items-center gap-4"
                  >
                    <div className="w-6 h-6">{cat.icon}</div>
                    <span className="text-xs">{cat.name}</span>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </div>
          <AccountMenu smallIconSize="30px" largeIconSize="24px" />
        </div>
      </div>
    </div>
  );
};

export default MainNav;
