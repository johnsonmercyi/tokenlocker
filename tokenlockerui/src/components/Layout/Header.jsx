import AppLogo from "@/util/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Menu } from "semantic-ui-react";
import UIButton from "../UI/UIButton/UIButton";
import styles from "./Header.module.css";

const Header = ({ ...props }) => {
  const router = useRouter();
  const { manager } = router.query;

  return (
    <div
      className={styles.header}
      style={{
        width: "100%",
        marginBottom: "2rem",
      }}>
      <Link href={`/${manager}/tokens`} style={{ color: "white" }} className={styles.appLogo}>
        <AppLogo
          title={"TheLockerSpace"}
          width={"3rem"}
          height={"3rem"} />
      </Link>

      <div 
      className={styles.buttonsWrapper}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Link
          className={styles.spaceBtn}
          href={`/${manager}/tokens`}
          style={{ color: "white" }}>
          <UIButton
            rounded_left
            content={"Space"}
            icon={"block layout"}
            labelPosition={"left"} />
        </Link>

        <Link
          href={`/${manager}/tokens/new`}
          className={styles.lockNewBtn}
          style={{ color: "white", width: "6rem" }}>
          <UIButton
            rounded_right
            content={"+"} />
        </Link>
      </div>
    </div>
  );
}

export default Header;