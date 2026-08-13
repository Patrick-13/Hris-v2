import { motion } from "framer-motion";

export default function Ghost() {
    return (
        <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{
                position: "fixed",
                right: 50,
                top: 100,
                fontSize: "40px",
            }}
        >
            👻
        </motion.div>
    );
}
