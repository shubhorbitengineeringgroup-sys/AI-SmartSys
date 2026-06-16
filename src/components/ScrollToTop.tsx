import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isNearContact, setIsNearContact] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    useEffect(() => {
        let observer: IntersectionObserver | null = null;
        let contactElement: HTMLElement | null = null;

        const checkInterval = setInterval(() => {
            contactElement = document.getElementById("contact");
            if (contactElement) {
                observer = new IntersectionObserver(
                    ([entry]) => {
                        setIsNearContact(entry.isIntersecting);
                    },
                    { threshold: 0.1 }
                );
                observer.observe(contactElement);
                clearInterval(checkInterval);
            }
        }, 500);

        return () => {
            clearInterval(checkInterval);
            if (observer && contactElement) {
                observer.unobserve(contactElement);
                observer.disconnect();
            }
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <Button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 bg-gradient-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 animate-fade-in [.chatbot-open_&]:opacity-0 [.chatbot-open_&]:pointer-events-none ${
                isNearContact ? "hidden lg:flex" : "flex"
            }`}
        >
            <ArrowUp size={20} className="text-white" />
        </Button>
    );
};

export default ScrollToTop;
