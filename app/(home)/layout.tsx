export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-[5000px]">
      <div
        className="bg-indigo-200 absolute top-[-6rem] 
        -z-10 right-[-25rem] h-[45rem] w-[60rem] rounded-full 
        blur-[10rem] sm:w-[75rem] md:right-[-33rem]
        lg:right-[-28rem] xl:right-[-15rem] 2xl:right-[-5rem]"
      ></div>
      <div
        className="bg-cyan-200 absolute top-[-1rem] 
        -z-10 left-[-25rem] h-[45rem] w-[55rem] rounded-full 
        blur-[10rem] sm:w-[65rem] md:left-[-33rem]   
        lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"
      ></div>
      {children}
    </div>
  );
}
