import styles from "./page.module.css"
import WorkFlow from "@/components/workFlow/WorkFlow";

//pull feedly topics - AI / Mommy
//run through gpt script


export default function Home() {
  return (
    <main className={styles.main}>
      <WorkFlow />
    </main>
  );
}
