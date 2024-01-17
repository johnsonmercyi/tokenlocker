import AppLogo from "@/util/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Menu } from "semantic-ui-react";
import UIButton from "../UI/UIButton/UIButton";

const Header = ({ ...props }) => {
  const router = useRouter();
  const { manager } = router.query;

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
    }}>
      <Link href={`/${manager}/tokens`} style={{ color: "white" }}>
        <AppLogo
          title={"TheLockerSpace"}
          width={"3rem"}
          height={"3rem"} />
      </Link>

      <div style={{
        width: "fit-content",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Link href={`/${manager}/tokens`} style={{ color: "white" }}>
          <UIButton
            rounded_left
            content={"Locked Tokens"}
            icon={"lock"}
            labelPosition={"left"} />
        </Link>

        <Link href={`/${manager}/tokens/new`} style={{ color: "white" }}>
          <UIButton
            rounded_right
            content={"+"} />
        </Link>
      </div>
    </div>
  );
}

export default Header;