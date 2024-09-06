"use client";

import React, { useState } from "react";
import {
  Button,
  Navbar as NavbarContainer,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Icon from "../Icon";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import Link from "next/link";

import NavbarProfile from "./NavbarProfile";
import SearchInput from "../search/SearchInput";
import LoadingBar from "react-top-loading-bar";
import { setProgress } from "@/redux/commonSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { authStatus } = useAppSelector((state) => state.auth);
  const { progress } = useAppSelector((state) => state.common);

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <NavbarContainer
        isBordered
        isBlurred
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        maxWidth="full"
        classNames={{ wrapper: "max-md:px-2" }}
      >
        <NavbarContent className="">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand className="basis-0 grow-0">
            <Button
              href={"/"}
              as={Link}
              variant="solid"
              isIconOnly
              aria-label="next-blog home page"
              radius="sm"
              className=" bg-black/90 text-white"
            >
              TEN
            </Button>
          </NavbarBrand>
          {/* ---SEARCH BAR--- */}
          <div className="max-md:hidden ">
            <SearchInput />
          </div>
        </NavbarContent>
        {/* Navbar */}
        <div className="sticky left-0 flex items-center justify-between flex-row max-md:hidden  ">
          {" "}
          <ul className="flex justify-between items-center max-md:hidden ">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Button
                  href={link.path ? `${link.path}` : "/"}
                  className="justify-start text-black hover:underline hover:text-primary group"
                  as={Link}
                  variant="light"
                  color="primary"
                  fullWidth
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        {/* ===AUTH USER ACCESS=== */}
        {authStatus ? (
          <NavbarProfile />
        ) : (
          <NavbarContent className="md:gap-4 gap-2" justify="end">
            <NavbarItem className="md:hidden">
              <Button
                as={Link}
                href={"/search"}
                variant="light"
                color="default"
                radius="sm"
                isIconOnly
              >
                <Icon name="search" strokeWidth={1.25} />
              </Button>
            </NavbarItem>
            {/* Hide the Sign in and create account for now */}
            {/* 
            <NavbarItem>
              <Button
                as={Link}
                href={"/signin"}
                variant="light"
                color="primary"
                radius="sm"
                className="max-md:hidden"
              >
                Sign in
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                href={"/signup"}
                variant="ghost"
                radius="sm"
                color="primary"
                className="border-1.5"
                role="link"
              >
                Create account
              </Button>
            </NavbarItem> */}
          </NavbarContent>
        )}
        <NavbarMenu>
          {navLinks.map((navMenu) => (
            <NavbarMenuItem key={navMenu.id}>
              <Button
                href="/"
                className="justify-start"
                as={Link}
                variant="light"
                fullWidth
              >
                <span>{navMenu.label}</span>
              </Button>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NavbarContainer>
    </>
  );
};

export default Navbar;

export const navLinks = [
  {
    id: 1,
    label: "Home",
    path: "/",
    icon: <Icon name="home" strokeWidth={1.25} />,
  },
  {
    id: 7,
    label: "FAQ",
    icon: <Icon name="lightbulb" strokeWidth={1.25} />,
  },
  {
    id: 9,
    label: "About",
    icon: <Icon name="user" strokeWidth={1.25} />,
  },
  {
    id: 10,
    label: "Contact",
    icon: <Icon name="contact" strokeWidth={1.25} />,
  },
];
