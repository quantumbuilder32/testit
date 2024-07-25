import styles from "./page.module.css"
import WorkFlow from "@/components/workFlow/WorkFlow";

export default function Home() {
  return (
    <main className={styles.main}>
      <WorkFlow />
    </main>
  );
}
