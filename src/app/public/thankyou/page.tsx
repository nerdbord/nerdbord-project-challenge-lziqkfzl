import React from "react";
import styles from "./page.module.css";
import { ThankYou } from "@/components/ThankYou";

type Props = {};

const page = (props: Props) => {
  return (
    <div className={styles.thankyou}>
      <div className={styles.card}>
        <ThankYou />
      </div>
    </div>
  );
};

export default page;
