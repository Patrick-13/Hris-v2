import Particles from "react-tsparticles";

export default function HalloweenParticles() {
  return (
    <Particles
      options={{
        background: { color: "#0b0b0b" },
        particles: {
          number: { value: 40 },
          color: { value: ["#ff6600", "#ffffff"] },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.3 },
          size: { value: 3 }
        }
      }}
    />
  );
}