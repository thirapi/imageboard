export function PageBackground() {
  return (
    <>
      {/* GRID PATTERN OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none bg-[length:40px_40px] 
      bg-[linear-gradient(to_right,_#e4e4e7_1px,_transparent_1px),_linear-gradient(to_bottom,_#e4e4e7_1px,_transparent_1px)]
      dark:bg-[linear-gradient(to_right,_#262626_1px,_transparent_1px),_linear-gradient(to_bottom,_#262626_1px,_transparent_1px)]
      opacity-40 dark:opacity-30 z-0 vaporwave:hidden pastel:hidden"
      />

      {/* ECLIPSE / DARK VIGNETTE OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center 
      bg-white dark:bg-black 
      [mask-image:radial-gradient(ellipse_at_center,_#00000079_20%,_black)]
      [-webkit-mask-image:radial-gradient(ellipse_at_center,_#00000079_20%,_black)]
      z-0 vaporwave:hidden pastel:hidden"
      />
    </>
  );
}