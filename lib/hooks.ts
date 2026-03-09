import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useActiveSection } from "@/app/context/active-section-context";
import type { SectionName } from "./types";


export function useSectionInView(
    sectionName:SectionName, threshold = 0.75){
    const [ref, inView] = useInView({
        threshold,
    });
    const { setActiveSection } = useActiveSection();
    useEffect(() => {
      if (inView) {
        setActiveSection(sectionName);
      }
    }, [inView, setActiveSection, sectionName]);

    return { ref, inView };
}
