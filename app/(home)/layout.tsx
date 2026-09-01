import AltitudeScrollbar from "@/components/altitude-scrollbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flight-page relative">
      <AltitudeScrollbar />
      <div className="sky-cloud sky-cloud-one" aria-hidden="true">☁️</div>
      <div className="sky-cloud sky-cloud-two" aria-hidden="true">☁️</div>
      <div className="sky-cloud sky-cloud-three" aria-hidden="true">☁️</div>
      <div className="wind-field" aria-hidden="true">
        <i className="wind-one" />
        <i className="wind-two" />
        <i className="wind-three" />
        <i className="wind-four" />
      </div>
      {children}
    </div>
  );
}
